import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import { getProduct } from "@/lib/catalog";

export type PayMethod = "tunai" | "qris" | "transfer";

export type PosLine = {
  key: string;
  productSlug?: string;
  name: string;
  image?: string;
  weightGrams: number;
  packingLabel: string;
  unitPrice: number;
  qty: number;
};

export type Sale = {
  id: string;
  createdAt: string;
  items: PosLine[];
  subtotal: number;
  discount: number;
  total: number;
  method: PayMethod;
  cashReceived?: number;
  change?: number;
  customerName?: string;
  customerWa?: string;
  note?: string;
  voided?: boolean;
};

export type Shift = {
  openedAt: string;
  openingCash: number;
  closedAt?: string;
  closingCash?: number;
  note?: string;
};

type PosState = {
  lines: PosLine[];
  sales: Sale[];
  shift: Shift | null;
  addProduct: (slug: string, grams: number) => void;
  addCustom: (name: string, unitPrice: number, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clearCart: () => void;
  checkout: (input: {
    method: PayMethod;
    discount?: number;
    cashReceived?: number;
    customerName?: string;
    customerWa?: string;
    note?: string;
  }) => Sale | null;
  voidSale: (id: string) => void;
  openShift: (openingCash: number) => void;
  closeShift: (closingCash: number, note?: string) => void;
};

function productKey(slug: string, grams: number) {
  return `${slug}__${grams}`;
}

function customKey(name: string, price: number) {
  return `custom__${name.trim().toLowerCase()}__${price}`;
}

function subtotalOf(lines: PosLine[]) {
  return lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
}

function nextId(sales: Sale[], now = new Date()) {
  const prefix = `TF-${format(now, "yyyyMMdd")}-`;
  const seq = sales.filter((s) => s.id.startsWith(prefix)).length + 1;
  return `${prefix}${String(seq).padStart(3, "0")}`;
}

export const usePos = create<PosState>()(
  persist(
    (set, get) => ({
      lines: [],
      sales: [],
      shift: null,
      addProduct: (slug, grams) => {
        const product = getProduct(slug);
        if (!product) return;
        const weight = product.weights.find((w) => w.grams === grams);
        if (!weight) return;
        const key = productKey(slug, grams);
        const existing = get().lines.find((l) => l.key === key);
        if (existing) {
          set({
            lines: get().lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              key,
              productSlug: slug,
              name: product.name,
              image: product.image,
              weightGrams: grams,
              packingLabel: product.packing[0]?.label ?? "Vakum",
              unitPrice: weight.price,
              qty: 1,
            },
          ],
        });
      },
      addCustom: (name, unitPrice, qty = 1) => {
        const trimmed = name.trim();
        if (!trimmed || unitPrice <= 0) return;
        const key = customKey(trimmed, unitPrice);
        const existing = get().lines.find((l) => l.key === key);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.key === key ? { ...l, qty: l.qty + qty } : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              key,
              name: trimmed,
              weightGrams: 0,
              packingLabel: "Satuan",
              unitPrice,
              qty,
            },
          ],
        });
      },
      setQty: (key, qty) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.key !== key) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        });
      },
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      clearCart: () => set({ lines: [] }),
      checkout: (input) => {
        const lines = get().lines;
        if (lines.length === 0) return null;
        const subtotal = subtotalOf(lines);
        const discount = Math.min(Math.max(0, input.discount ?? 0), subtotal);
        const total = subtotal - discount;
        const cashReceived = input.method === "tunai" ? (input.cashReceived ?? total) : undefined;
        const change =
          cashReceived != null ? Math.max(0, cashReceived - total) : undefined;
        const sale: Sale = {
          id: nextId(get().sales),
          createdAt: new Date().toISOString(),
          items: lines,
          subtotal,
          discount,
          total,
          method: input.method,
          cashReceived,
          change,
          customerName: input.customerName?.trim() || undefined,
          customerWa: input.customerWa?.trim() || undefined,
          note: input.note?.trim() || undefined,
        };
        set({ sales: [sale, ...get().sales], lines: [] });
        return sale;
      },
      voidSale: (id) =>
        set({
          sales: get().sales.map((s) => (s.id === id ? { ...s, voided: true } : s)),
        }),
      openShift: (openingCash) =>
        set({
          shift: {
            openedAt: new Date().toISOString(),
            openingCash: Math.max(0, openingCash),
          },
        }),
      closeShift: (closingCash, note) => {
        const shift = get().shift;
        if (!shift || shift.closedAt) return;
        set({
          shift: {
            ...shift,
            closedAt: new Date().toISOString(),
            closingCash: Math.max(0, closingCash),
            note: note?.trim() || undefined,
          },
          lines: [],
        });
      },
    }),
    { name: "tangkil-kasir" },
  ),
);

export function usePosHydrated() {
  const [ready, setReady] = useState(() => usePos.persist.hasHydrated());
  useEffect(() => {
    const unsub = usePos.persist.onFinishHydration(() => setReady(true));
    if (usePos.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  return ready;
}
