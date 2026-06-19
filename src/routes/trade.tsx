import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CHEESES, TRADE_DISCOUNT, estimateLine, tradePricePerKg, type TradeTier } from "@/lib/catalog";

export const Route = createFileRoute("/trade")({
  head: () => ({
    meta: [
      { title: "Trade Portal — Northumberland Cheese Co." },
      { name: "description", content: "Wholesale ordering for delis, farm shops and restaurants. Tiered pricing, catch-weight orders, direct Sage 50 sync." },
      { property: "og:title", content: "Trade Portal" },
      { property: "og:description", content: "Wholesale cheese ordering with tiered pricing and Sage 50 sync." },
    ],
  }),
  component: TradePage,
});

interface DemoAccount { ref: string; name: string; tier: TradeTier; }
const DEMO_ACCOUNTS: DemoAccount[] = [
  { ref: "DELI00142", name: "The Quayside Deli, Newcastle",      tier: "silver" },
  { ref: "FARM00088", name: "Hexham Farm Shop",                  tier: "bronze" },
  { ref: "REST00301", name: "Blackfriars Restaurant",            tier: "gold"   },
];

function TradePage() {
  const [account, setAccount] = useState<DemoAccount | null>(null);
  return account ? <Dashboard account={account} onLogout={() => setAccount(null)} /> : <LoginScreen onPick={setAccount} />;
}

function LoginScreen({ onPick }: { onPick: (a: DemoAccount) => void }) {
  return (
    <div className="container-page py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Wholesale · since 1984</p>
          <h1 className="mt-3 text-5xl leading-tight">The Trade Portal.</h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Self-service ordering for delis, farm shops, wholesalers and
            restaurants. Your negotiated tier prices, catch-weight items
            balanced at the packing bench, and every order pushed straight
            into Sage 50 via Zync.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>· Instant matrix pricing on your tier</li>
            <li>· Re-order from history in a click</li>
            <li>· No upfront card validation — invoice on dispatch</li>
            <li>· Bi-directional Sage 50 stock sync</li>
          </ul>
        </div>
        <div className="card-paper p-8">
          <p className="eyebrow">Demo sign-in</p>
          <h2 className="mt-2 text-2xl">Choose a sample trade account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real auth lands with Lovable Cloud. Pick an account to preview
            the portal.
          </p>
          <div className="mt-6 space-y-3">
            {DEMO_ACCOUNTS.map(a => (
              <button key={a.ref} onClick={() => onPick(a)}
                className="flex w-full items-center justify-between rounded-md border border-border p-4 text-left hover:border-primary">
                <div>
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.ref} · {(100-TRADE_DISCOUNT[a.tier]*100).toFixed(0)}% off retail</div>
                </div>
                <span className="rounded-full border border-accent px-2.5 py-0.5 text-xs uppercase tracking-wider text-accent">{a.tier}</span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            New account? <a href="#" className="text-primary underline">Apply for trade →</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ account, onLogout }: { account: DemoAccount; onLogout: () => void }) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<null | { ok: boolean; orderRef: string }>(null);

  const lines = useMemo(() => CHEESES.map(c => {
    const q = qty[c.sku] ?? 0;
    const perKg = tradePricePerKg(c, account.tier);
    const { weight, total } = estimateLine(c, q, perKg);
    return { cheese: c, qty: q, perKg, weight, total };
  }), [qty, account.tier]);

  const active = lines.filter(l => l.qty > 0);
  const subtotal = +active.reduce((s,l) => s + l.total, 0).toFixed(2);

  const payload = {
    order_header: {
      source_channel: "Web_Unified",
      customer_type: "TRADE",
      sage_account_reference: account.ref,
      transaction_date: new Date().toISOString(),
      payment_status: "PENDING_FINAL_WEIGHT_BALANCING",
    },
    order_lines: active.map(l => ({
      sku: l.cheese.sku,
      product_name: `${l.cheese.name} ${l.cheese.catchWeight ? "(Estimated)" : ""}`.trim(),
      quantity_ordered: l.qty,
      base_unit_weight_kg: l.cheese.baseUnitWeightKg,
      estimated_total_weight_kg: l.weight,
      unit_price_per_kg: l.perKg,
      line_total_estimated: l.total,
    })),
  };

  function submitOrder() {
    // MOCK Zync push — replace with POST to Zync receiver endpoint.
    const orderRef = "NCC-" + Math.random().toString(36).slice(2,8).toUpperCase();
    console.info("[ZYNC MOCK] outbound payload", payload);
    setSubmitted({ ok: true, orderRef });
  }

  return (
    <div className="container-page py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="eyebrow">Trade Portal</p>
          <h1 className="mt-2 text-4xl">{account.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sage ref {account.ref} · <span className="capitalize text-accent">{account.tier}</span> tier</p>
        </div>
        <button onClick={onLogout} className="btn btn-ghost text-xs">Sign out</button>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Catalog */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl">Matrix pricing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prices reflect your <span className="capitalize">{account.tier}</span> tier. Catch-weight items use an
            estimated weight (W<sub>est</sub> = wheel × qty); invoices balance to actual weight at pack.
          </p>
          <div className="mt-6 overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="px-4 py-3">Cheese</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-right">£/kg</th>
                  <th className="px-4 py-3 text-right">Wheel</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Est. line</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(l => (
                  <tr key={l.cheese.sku} className="border-t border-border/60">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{l.cheese.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{l.cheese.milk} · {l.cheese.catchWeight ? "catch-weight" : "fixed weight"}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.cheese.sku}</td>
                    <td className="px-4 py-3 text-right">£{l.perKg.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{l.cheese.baseUnitWeightKg}kg</td>
                    <td className="px-4 py-3 text-right">
                      <input type="number" min={0} value={l.qty || ""} placeholder="0"
                        onChange={e => setQty(q => ({ ...q, [l.cheese.sku]: Math.max(0, parseInt(e.target.value || "0", 10)) }))}
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-right" />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{l.total ? `£${l.total.toFixed(2)}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart / submit */}
        <aside className="card-paper h-fit p-6">
          <p className="eyebrow">Order summary</p>
          <h3 className="mt-2 text-2xl">Estimated total</h3>
          <p className="mt-4 font-display text-5xl">£{subtotal.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Estimated · finalises at pack weight</p>

          <ul className="mt-6 space-y-2 text-sm">
            {active.length === 0 && <li className="text-muted-foreground">Add quantities to begin.</li>}
            {active.map(l => (
              <li key={l.cheese.sku} className="flex justify-between">
                <span>{l.qty}× {l.cheese.name}</span>
                <span className="text-muted-foreground">≈ {l.weight.toFixed(2)}kg</span>
              </li>
            ))}
          </ul>

          <button onClick={submitOrder} disabled={active.length===0}
            className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50">
            Submit to dispatch
          </button>

          {submitted && (
            <div className="mt-4 rounded-md border border-primary/40 bg-secondary p-4 text-sm">
              <p className="font-semibold text-primary">Order {submitted.orderRef} queued for Sage 50.</p>
              <p className="mt-1 text-xs text-muted-foreground">Status: PENDING_FINAL_WEIGHT_BALANCING</p>
            </div>
          )}

          <details className="mt-6">
            <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">Preview Sage / Zync payload</summary>
            <pre className="mt-3 max-h-72 overflow-auto rounded bg-ink/95 p-3 text-[10px] leading-relaxed text-cream" style={{background:"oklch(0.235 0.013 60)", color:"oklch(0.962 0.022 88)"}}>
{JSON.stringify(payload, null, 2)}
            </pre>
          </details>
        </aside>
      </div>
    </div>
  );
}
