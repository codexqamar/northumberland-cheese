import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 — lost in the cellar</p>
        <h1 className="mt-3 text-5xl">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          That wheel isn't on our shelf. Let's get you back to the dairy.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">Return home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn btn-primary"
          >Try again</button>
          <a href="/" className="btn btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Northumberland Cheese Co. — Artisan since 1984" },
      { name: "description", content: "Handcrafted cow, goat and sheep cheeses from the Northumberland dairy. Retail, subscriptions and trade." },
      { property: "og:title", content: "Northumberland Cheese Co. — Artisan since 1984" },
      { property: "og:description", content: "Handcrafted cow, goat and sheep cheeses from the Northumberland dairy. Retail, subscriptions and trade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Northumberland Cheese Co. — Artisan since 1984" },
      { name: "twitter:description", content: "Handcrafted cow, goat and sheep cheeses from the Northumberland dairy. Retail, subscriptions and trade." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a48a2d7f-952e-454a-8266-97861414c86b/id-preview-5d8f5704--9ebe0496-486f-4f2b-8bda-7ef5e7de115c.lovable.app-1781882077191.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a48a2d7f-952e-454a-8266-97861414c86b/id-preview-5d8f5704--9ebe0496-486f-4f2b-8bda-7ef5e7de115c.lovable.app-1781882077191.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function SiteHeader() {
  const nav = [
    { to: "/shop", label: "Shop" },
    { to: "/subscriptions", label: "Cheese Box Club" },
    { to: "/trade", label: "Trade" },
    { to: "/about", label: "Our Dairy" },
  ] as const;
  return (
    <header className="relative z-10 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Northumberland Cheese Co." className="h-10 w-auto object-contain" />
          <div className="flex flex-col justify-center">
            <span className="font-display text-xl leading-none tracking-tight text-primary">Northumberland</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Cheese Co. · est. 1984</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {nav.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className="text-foreground/80 hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
            >{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/admin" className="hidden sm:inline btn btn-ghost text-xs">Ops</Link>
          <Link to="/shop" className="btn btn-accent text-xs">Shop now</Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/60 bg-secondary/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Northumberland Cheese Co." className="h-8 w-auto object-contain brightness-95" />
            <span className="font-display text-lg text-primary">Northumberland Cheese Co.</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Handcrafting cow, goat and sheep cheeses from our dairy on the
            edge of the Cheviots since 1984.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop">All cheeses</Link></li>
            <li><Link to="/subscriptions">Cheese Box Club</Link></li>
            <li><Link to="/trade">Trade accounts</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Dairy</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">Our story</Link></li>
            <li><a href="#">Visit the creamery</a></li>
            <li><a href="#">Wholesale enquiries</a></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <p className="text-sm text-muted-foreground">Blagdon, Northumberland<br/>NE13 6BZ<br/>+44 (0)1670 789798</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Northumberland Cheese Company. Sage 50 sync via Zync.
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen flex flex-col">
        <SiteHeader />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
