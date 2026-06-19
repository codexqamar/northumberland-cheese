import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Dairy — Northumberland Cheese Co." },
      { name: "description", content: "Handcrafting artisan cheese on the edge of the Cheviot hills since 1984." },
      { property: "og:title", content: "Our Dairy" },
      { property: "og:description", content: "Handcrafting artisan cheese on the edge of the Cheviot hills since 1984." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-page py-20">
      <p className="eyebrow">Our story</p>
      <h1 className="mt-3 max-w-3xl text-5xl leading-tight lg:text-6xl">
        A small dairy on the edge of the Cheviots,<br/>
        <em className="not-italic text-accent">turning wheels by hand since 1984.</em>
      </h1>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 text-lg leading-relaxed">
          <p>
            We started with a single copper vat, three cows, and a stubborn
            belief that good cheese is made slowly. Forty years on, not much
            has changed — the vats are bigger, but every wheel is still
            pressed, turned and washed by the same pair of hands.
          </p>
          <p>
            In August 2025 we welcomed the Cheese Box Club into the family.
            Their members became ours, and our cellar became theirs.
          </p>
          <p>
            Today we serve home kitchens, more than 180 delis and farm
            shops, and some of the finest restaurants in the North.
          </p>
        </div>
        <aside className="card-paper p-6 h-fit">
          <p className="eyebrow">Visit the creamery</p>
          <p className="mt-3 text-sm">Blagdon, Northumberland NE13 6BZ</p>
          <p className="mt-1 text-sm text-muted-foreground">Tours run Thursday–Saturday, by appointment.</p>
          <Link to="/shop" className="btn btn-primary mt-5 w-full">Shop the cellar</Link>
        </aside>
      </div>
    </div>
  );
}
