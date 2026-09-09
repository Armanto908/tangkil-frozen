import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { getCategory, getProductsByCategory, type CategoryId } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/kategori/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const category = getCategory(slug);
  const list = category ? getProductsByCategory(category.id as CategoryId) : [];

  if (!category) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Kategori tidak ada</h1>
        <Button asChild className="mt-6">
          <Link to="/produk">Lihat semua produk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-56 overflow-hidden sm:h-72">
        <img src={category.image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-8 sm:px-6">
          <h1 className="font-display text-4xl font-semibold text-ink-fg sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-lg text-ink-muted">{category.blurb}</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
