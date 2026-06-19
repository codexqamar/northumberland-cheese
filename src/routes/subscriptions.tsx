import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Cheese Box Club — Northumberland Cheese Co." },
      { name: "description", content: "A curated cheese box delivered monthly, bi-monthly or quarterly. Pause, skip or cancel any time." },
      { property: "og:title", content: "Cheese Box Club" },
      { property: "og:description", content: "A curated cheese box delivered monthly, bi-monthly or quarterly." },
    ],
  }),
  component: Subs,
});

type Plan = { id: string; name: string; freq: "Monthly"|"Bi-Monthly"|"Quarterly"; price: number; pieces: number; tagline: string };
const PLANS: Plan[] = [
  { id: "starter",  name: "The Starter Board", freq: "Quarterly",  price: 38, pieces: 3, tagline: "Three cheeses, four times a year." },
  { id: "club",     name: "The Club",          freq: "Bi-Monthly", price: 52, pieces: 4, tagline: "Our most popular — six boxes a year." },
  { id: "cellarer", name: "The Cellarer",      freq: "Monthly",    price: 64, pieces: 5, tagline: "Five cheeses, every month. For the devoted." },
];

export default function Subs() { return <Page />; }
function Page() {
  const [selected, setSelected] = useState<Plan>(PLANS[1]);

  return (
    <div>
      <section className="border-b border-border/60">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="eyebrow">The Cheese Box Club</p>
            <h1 className="mt-3 text-5xl leading-tight lg:text-6xl">
              A box of the dairy's best,<br/><em className="not-italic text-accent">on your kitchen table.</em>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Cut fresh, packed cold, posted Monday. Three curations — pick a
              cadence, change it any time. Billing is tokenised via Elavon, so
              there are no more broken renewals.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Pause, skip or cancel from your dashboard","Free chilled delivery within mainland UK","Tasting notes & a producer letter in every box","Members get 10% off the cellar"].map(b => (
                <li key={b} className="flex gap-3"><span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent"/>{b}</li>
              ))}
            </ul>
          </div>
          <div className="card-paper p-8">
            <p className="eyebrow">Choose your box</p>
            <div className="mt-4 space-y-3">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full rounded-md border p-5 text-left transition-colors ${selected.id===p.id ? "border-primary bg-secondary" : "border-border hover:border-primary/60"}`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl">{p.name}</h3>
                    <span className="font-display text-2xl">£{p.price}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                    <span>{p.freq} · {p.pieces} cheeses</span>
                    <span>{p.tagline}</span>
                  </div>
                </button>
              ))}
            </div>
            <button className="btn btn-primary mt-6 w-full">Subscribe — £{selected.price} {selected.freq.toLowerCase()}</button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Payments tokenised via Elavon · cancel any time
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Member dashboard preview</p>
        <h2 className="mt-2 text-4xl">Your subscription, in your hands.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { t: "Next box", v: "23 July", s: "The Club · 4 cheeses" },
            { t: "Card on file", v: "•••• 4242", s: "Tokenised — Elavon" },
            { t: "Status", v: "Active", s: "Skip next · Pause · Cancel" },
          ].map(c => (
            <div key={c.t} className="card-paper p-6">
              <p className="eyebrow">{c.t}</p>
              <p className="mt-3 font-display text-3xl">{c.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
