import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "@/lib/catalog";

export type CartItem = {
  key: string;
  productSlug: string;
  name: string;
  image: string;
  weightGrams: number;
  packingId: string;
  packingLabel: string;
  unitPrice: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: {
    productSlug: string;
    weightGrams: number;
    packingId: string;
    qty?: number;
  }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

function makeKey(slug: string, grams: number, packingId: string) {
  return `${slug}__${grams}__${packingId}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (input) => {
        const product = getProduct(input.productSlug);
        if (!product) return;
        const weight = product.weights.find((w) => w.grams === input.weightGrams);
        if (!weight) return;
        const packing = product.packing.find((p) => p.id === input.packingId);
        const key = makeKey(input.productSlug, input.weightGrams, input.packingId);
        const qty = input.qty ?? 1;
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + qty } : i,
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            {
              key,
              productSlug: input.productSlug,
              name: product.name,
              image: product.image,
              weightGrams: input.weightGrams,
              packingId: input.packingId,
              packingLabel: packing?.label ?? input.packingId,
              unitPrice: weight.price,
              qty,
            },
          ],
        });
      },
      setQty: (key, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.key !== key) });
          return;
        }
        set({
          items: get().items.map((i) => (i.key === key ? { ...i, qty } : i)),
        });
      },
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      clear: () => set({ items: [] }),
    }),
    { name: "tangkil-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
}
