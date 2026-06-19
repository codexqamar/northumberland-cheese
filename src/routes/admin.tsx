import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Ops · Sync Console — Northumberland Cheese Co." }] }),
  component: Admin,
});

interface SyncRow { ref: string; channel: "Retail"|"Trade"|"Subs"; status: "Synced"|"Pending"|"Failed"; reason?: string; total: string; }

const SEED: SyncRow[] = [
  { ref: "NCC-9F2KQ", channel: "Trade",  status: "Failed",  reason: "Zync 504: receiver timeout",       total: "£312.40" },
  { ref: "NCC-7B1XA", channel: "Trade",  status: "Pending", reason: "Awaiting pack weight balance",     total: "£128.90" },
  { ref: "NCC-W43LM", channel: "Retail", status: "Synced",                                              total: "£42.50"  },
  { ref: "NCC-S82QQ", channel: "Subs",   status: "Failed",  reason: "Elavon token expired — re-tokenise", total: "£52.00"  },
  { ref: "NCC-RTH88", channel: "Retail", status: "Synced",                                              total: "£18.20"  },
];

function Admin() {
  const [rows, setRows] = useState<SyncRow[]>(SEED);
  const [log, setLog] = useState<string[]>([]);

  function forceSync(r: SyncRow) {
    // MOCK: real flow re-POSTs the saved JSON payload to the Zync receiver.
    const ts = new Date().toLocaleTimeString();
    setLog(l => [`[${ts}] Force-syncing ${r.ref} → Zync /receiver/orders ...`, ...l]);
    setTimeout(() => {
      setRows(rs => rs.map(x => x.ref === r.ref ? { ...x, status: "Synced", reason: undefined } : x));
      setLog(l => [`[${new Date().toLocaleTimeString()}] ${r.ref} accepted by Sage 50.`, ...l]);
    }, 700);
  }

  const counts = {
    failed:  rows.filter(r => r.status === "Failed").length,
    pending: rows.filter(r => r.status === "Pending").length,
    synced:  rows.filter(r => r.status === "Synced").length,
  };

  return (
    <div className="container-page py-12">
      <header>
        <p className="eyebrow">Operations · internal</p>
        <h1 className="mt-2 text-4xl">Sage 50 sync console</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Outbound order queue to the Zync receiver. Failed payloads can be
          force-synced after the underlying error is resolved.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Failed"  value={counts.failed}  tone="bad" />
        <Stat label="Pending" value={counts.pending} tone="warn" />
        <Stat label="Synced today" value={counts.synced} tone="ok" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.ref} className="border-t border-border/60">
                  <td className="px-4 py-3 font-mono text-xs">{r.ref}</td>
                  <td className="px-4 py-3">{r.channel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                    {r.reason && <div className="mt-1 text-xs text-muted-foreground">{r.reason}</div>}
                  </td>
                  <td className="px-4 py-3">{r.total}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status !== "Synced" && (
                      <button onClick={() => forceSync(r)} className="btn btn-ghost text-xs">Force sync</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="card-paper p-5">
          <p className="eyebrow">Live log</p>
          <div className="mt-3 h-72 overflow-auto rounded bg-[oklch(0.235_0.013_60)] p-3 font-mono text-[11px] leading-relaxed text-[oklch(0.962_0.022_88)]">
            {log.length === 0 ? <span className="opacity-60">No activity yet.</span> :
              log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Wired to a mock Zync endpoint. Real receiver: <code className="text-foreground">POST /zync/receiver/orders</code>.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok"|"warn"|"bad" }) {
  const color = tone === "ok" ? "text-primary" : tone === "warn" ? "text-accent" : "text-destructive";
  return (
    <div className="card-paper p-5">
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 font-display text-4xl ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "Synced"|"Pending"|"Failed" }) {
  const cls = status === "Synced"
    ? "border-primary/40 bg-secondary text-primary"
    : status === "Pending"
    ? "border-accent/40 bg-accent/10 text-accent"
    : "border-destructive/40 bg-destructive/10 text-destructive";
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{status}</span>;
}
