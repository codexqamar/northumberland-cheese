import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CHEESES, type Milk } from "@/lib/catalog";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop all cheeses — Northumberland Cheese Co." },
      { name: "description", content: "Browse our full range of handmade cow, goat and sheep cheeses, cut fresh from the dairy." },
      { property: "og:title", content: "Shop all cheeses" },
      { property: "og:description", content: "Cow, goat and sheep cheeses, cut fresh from the Northumberland dairy." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [filter, setFilter] = useState<Milk | "all">("all");
  const items = filter === "all" ? CHEESES : CHEESES.filter(c => c.milk === filter);

  return (
    <div className="container-page py-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">The cellar</p>
          <h1 className="mt-2 text-5xl">Shop all cheeses</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every wheel is made by hand. Pieces are cut fresh to order and
            dispatched chilled within 48 hours.
          </p>
        </div>
        <div className="flex gap-1 rounded-md border border-border bg-card p-1 text-sm">
          {(["all","cow","goat","sheep"] as const).map(k => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded px-3 py-1.5 capitalize transition-colors ${filter===k ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >{k}</button>
          ))}
        </div>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(c => (
          <Link
            key={c.slug}
            to="/product/$slug"
            params={{ slug: c.slug }}
            className="card-paper group flex flex-col overflow-hidden p-6 transition-colors hover:border-primary"
          >
            <div className="aspect-[5/4] overflow-hidden rounded-md bg-muted">
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between">
              <h2 className="text-2xl">{c.name}</h2>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.milk}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
            <div className="mt-auto flex items-center justify-between pt-6 text-sm">
              <span className="font-semibold">£{c.retailPrice.toFixed(2)}<span className="text-muted-foreground font-normal"> / {c.retailWeightG}g</span></span>
              <span className="text-accent group-hover:translate-x-1 transition-transform">View →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
