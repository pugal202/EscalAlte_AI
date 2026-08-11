import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Activity, Gauge, Inbox, ScrollText, Sparkles, Users } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Overview", icon: Sparkles },
  { to: "/demo", label: "Hackathon Demo", icon: Activity },
  { to: "/queue", label: "Escalation Queue", icon: Inbox },
  { to: "/workspace", label: "Agent Workspace", icon: Users },
  { to: "/audit", label: "Audit Log", icon: ScrollText },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [liveMode, setLiveMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-400">
              <Gauge className="h-4.5 w-4.5 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Resolve<span className="text-primary">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setLiveMode((v) => !v)}
            title="Demo mode runs fully offline with deterministic scenario logic. Live AI requires a secure backend integration."
            className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                liveMode ? "bg-solve" : "bg-adapt",
              )}
            />
            {liveMode ? "LIVE AI MODE" : "DEMO MODE"}
          </button>
        </div>
        <nav className="flex md:hidden items-center gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((item) => {
            const active =
              item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
