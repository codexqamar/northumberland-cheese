import { createFileRoute, Link } from "@tanstack/react-router";
import { CHEESES } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northumberland Cheese Co. — Artisan since 1984" },
      { name: "description", content: "Handcrafted cow, goat and sheep cheeses from our Northumberland dairy. Shop, subscribe, or open a trade account." },
      { property: "og:title", content: "Northumberland Cheese Co." },
      { property: "og:description", content: "Handcrafted cow, goat and sheep cheeses since 1984." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = CHEESES.slice(0, 3);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid gap-12 pt-16 pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-24">
          <div className="lg:col-span-7">
            <p className="eyebrow">Handmade in Northumberland · est. 1984</p>
            <h1 className="mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Cheese with a sense of place,<br/>
              <em className="not-italic text-accent">cut fresh</em> and sent from the dairy.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Cow, goat and sheep wheels turned by hand on the edge of the
              Cheviot hills. Shop a single wedge, join the Cheese Box Club,
              or open a trade account for your deli, farm shop or restaurant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-primary">Shop the cellar</Link>
              <Link to="/subscriptions" className="btn btn-ghost">Join the Club</Link>
              <Link to="/trade" className="btn btn-ghost">Trade login</Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-6 text-sm">
              <div><dt className="eyebrow">Since</dt><dd className="mt-1 font-display text-2xl">1984</dd></div>
              <div><dt className="eyebrow">Wheels / yr</dt><dd className="mt-1 font-display text-2xl">42k</dd></div>
              <div><dt className="eyebrow">Trade clients</dt><dd className="mt-1 font-display text-2xl">180+</dd></div>
            </dl>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-secondary group">
              <img
                src="/Cheviot Hills_Cheese Board.jpg"
                alt="Northumberland Cheese Wheel"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <p className="font-display text-2xl">Cheviot</p>
                <p className="text-sm opacity-90">Our signature cow's milk wheel · 2.5 KG</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured cheeses */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container-page py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">From the cellar</p>
              <h2 className="mt-2 text-4xl">This week's cut</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:text-accent">Shop all →</Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map(c => (
              <Link
                key={c.slug}
                to="/product/$slug"
                params={{ slug: c.slug }}
                className="card-paper group overflow-hidden p-6 transition-colors hover:border-primary"
              >
                <div className="aspect-[5/4] overflow-hidden rounded-md bg-muted">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="text-2xl">{c.name}</h3>
                  <span className="text-sm text-muted-foreground capitalize">{c.milk}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold">£{c.retailPrice.toFixed(2)}<span className="font-normal text-muted-foreground"> / {c.retailWeightG}g</span></span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Three channels */}
      <section className="container-page py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <ChannelCard
            tag="Retail"
            title="Single wedges, gift boards, fast checkout."
            body="Apple Pay, Google Pay, and a one-page checkout. Cut fresh, dispatched in 48 hours."
            cta="Shop now" to="/shop"
          />
          <ChannelCard
            tag="Cheese Box Club"
            title="A curated box, monthly, bi-monthly or quarterly."
            body="Resilient billing via tokenised cards. Pause, skip or cancel from your dashboard."
            cta="Join the Club" to="/subscriptions"
          />
          <ChannelCard
            tag="Trade"
            title="Wholesale pricing, weighed at the bench."
            body="Self-service ordering with your negotiated tier. Catch-weight items balance on dispatch."
            cta="Open trade portal" to="/trade"
          />
        </div>
      </section>
    </div>
  );
}

function ChannelCard({ tag, title, body, cta, to }: { tag: string; title: string; body: string; cta: string; to: string }) {
  return (
    <div className="card-paper flex flex-col p-8">
      <p className="eyebrow">{tag}</p>
      <h3 className="mt-3 text-2xl leading-snug">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-muted-foreground">{body}</p>
      <Link to={to} className="mt-6 text-sm font-semibold text-primary hover:text-accent">{cta} →</Link>
    </div>
  );
}
