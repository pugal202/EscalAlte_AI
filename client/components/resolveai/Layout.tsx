import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Activity, Inbox, ScrollText, Sparkles, Users, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearDemoRole } from "@/lib/demo-auth";

const NAV = [
  { to: "/", label: "Overview", icon: Sparkles },
  { to: "/demo", label: "Demo", icon: Activity },
  { to: "/queue", label: "Escalation Queue", icon: Inbox },
  { to: "/workspace", label: "Agent Workspace", icon: Users },
  { to: "/audit", label: "Audit Log", icon: ScrollText },
];

export function EscalAIteLogo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary" aria-label="EscalAIte logo">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M18.5 5H7.2a2.2 2.2 0 0 0-2.2 2.2v9.6A2.2 2.2 0 0 0 7.2 19h11.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 12h8.4l2.4-3.1 2.3 1.9 2.1-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m17.2 7.8 2.6-.1-.5 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [liveMode, setLiveMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <EscalAIteLogo />
            <span className="text-lg font-bold tracking-tight">
              Escal<span className="text-primary">AI</span>te
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

          <div className="relative flex items-center gap-2">
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
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-semibold"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <UserCircle2 className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Pugalarasi S</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-border bg-card p-2 shadow-xl">
                <div className="border-b border-border px-3 py-2">
                  <div className="font-semibold">Pugalarasi S</div>
                  <div className="text-xs text-muted-foreground">Administrator</div>
                </div>
                <Link className="mt-1 block rounded-md px-3 py-2 text-sm hover:bg-secondary" to="/profile" onClick={() => setProfileOpen(false)}>Profile</Link>
                <Link className="block rounded-md px-3 py-2 text-sm hover:bg-secondary" to="/settings" onClick={() => setProfileOpen(false)}>Settings</Link>
                <button
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => {
                    clearDemoRole();
                    setProfileOpen(false);
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
      <footer className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © 2026 EscalAIte · Built by Pugalarasi S
      </footer>
    </div>
  );
}
