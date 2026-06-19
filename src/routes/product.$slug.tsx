import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { findCheese } from "@/lib/catalog";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const cheese = findCheese(params.slug);
    if (!cheese) throw notFound();
    return { cheese };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.cheese.name} — Northumberland Cheese Co.` },
      { name: "description", content: loaderData.cheese.description },
      { property: "og:title", content: loaderData.cheese.name },
      { property: "og:description", content: loaderData.cheese.description },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl">That cheese isn't on our board.</h1>
      <Link to="/shop" className="btn btn-primary mt-6">Back to the cellar</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl">Couldn't load this cheese.</h1>
    </div>
  ),
  component: Product,
});

function Product() {
  const { cheese } = Route.useLoaderData();
  const [qty, setQty] = useState(1);

  return (
    <div className="container-page py-16">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">← All cheeses</Link>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <rect width="400" height="400" fill="oklch(0.92 0.025 88)"/>
            <ellipse cx="200" cy="210" rx="150" ry="130" fill="oklch(0.82 0.08 70)"/>
            <ellipse cx="200" cy="210" rx="150" ry="25" fill="oklch(0.5 0.1 50)" opacity="0.35"/>
            <path d="M120 230 Q200 180 280 230" stroke="oklch(0.5 0.1 50)" strokeWidth="2" fill="none" opacity="0.5"/>
          </svg>
        </div>
        <div>
          <p className="eyebrow capitalize">{cheese.milk}'s milk · aged {cheese.agedMonths} months</p>
          <h1 className="mt-3 text-5xl">{cheese.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{cheese.tagline}</p>
          <div className="rule my-8" />
          <p className="leading-relaxed">{cheese.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cheese.notes.map((n: string) => (
              <span key={n} className="rounded-full border border-border bg-card px-3 py-1 text-xs">{n}</span>
            ))}
          </div>

          <div className="mt-10 card-paper p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl">£{cheese.retailPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">{cheese.retailWeightG}g piece · £{cheese.pricePerKg.toFixed(2)}/kg</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button onClick={() => setQty(Math.max(1, qty-1))} className="px-3 py-2">−</button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(qty+1)} className="px-3 py-2">+</button>
              </div>
              <button className="btn btn-primary flex-1">Add to basket — £{(cheese.retailPrice*qty).toFixed(2)}</button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <BuyChip label="Apple Pay" />
              <BuyChip label="Google Pay" />
              <BuyChip label="Card" />
            </div>
            {cheese.catchWeight && (
              <p className="mt-5 text-xs text-muted-foreground">
                Catch-weight item. Whole wheels (≈{cheese.baseUnitWeightKg}kg) are weighed
                at packing; your invoice balances to the exact weight cut.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BuyChip({ label }: { label: string }) {
  return <div className="rounded-md border border-border bg-muted py-2 text-muted-foreground">{label}</div>;
}
