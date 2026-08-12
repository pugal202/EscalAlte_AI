import { Layout } from "@/components/resolveai/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DecisionBadge } from "@/components/resolveai/DecisionBadge";
import {
  ELEVEN_SIGNALS,
  DECISION_META,
} from "@/lib/resolveai";
import {
  ArrowRight,
  Activity,
  Inbox,
  Users,
  ScrollText,
  MessageSquare,
  Brain,
  UserCircle2,
  ShieldAlert,
  Gauge,
  HandHelping,
  FileText,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

const PIPELINE = [
  { icon: MessageSquare, label: "Customer Message" },
  { icon: Brain, label: "AI Analysis" },
  { icon: UserCircle2, label: "Customer Context" },
  { icon: ShieldAlert, label: "Escalation Intelligence" },
  { icon: Gauge, label: "Risk Score" },
  { icon: Activity, label: "Solve / Adapt / Escalate" },
  { icon: HandHelping, label: "Human Handoff" },
  { icon: FileText, label: "AI Summary" },
  { icon: ClipboardCheck, label: "Recommended Action" },
  { icon: CheckCircle2, label: "Resolution" },
];

const SURFACES = [
  {
    to: "/demo",
    icon: Activity,
    title: "Demo",
    desc: "Watch a live case escalate from SOLVE to ADAPT to ESCALATE in real time, or jump between preset scenarios.",
  },
  {
    to: "/queue",
    icon: Inbox,
    title: "Escalation Queue",
    desc: "Every case ranked by risk, priority, and SLA — filterable and ready for triage.",
  },
  {
    to: "/workspace",
    icon: Users,
    title: "Agent Workspace",
    desc: "Full case context, AI handoff summary, and AI-assisted actions for the receiving agent.",
  },
  {
    to: "/audit",
    icon: ScrollText,
    title: "Audit Log",
    desc: "Every decision, factor, and human override — fully explainable and traceable.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.18),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              Intelligent Customer Escalation &amp; Resolution
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
              Know when to <span className="text-solve">solve</span>.
              <br />
              Know when to <span className="text-adapt">adapt</span>.
              <br />
              Know when to <span className="text-escalate">escalate</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              EscalAIte is an AI-powered customer-resolution and escalation intelligence
              platform. Most support AI is optimized to keep answering — EscalAIte is
              optimized to decide whether continuing with AI is actually the best decision
              for this customer right now.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  Launch Demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/queue">View Escalation Queue</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Decision model */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["SOLVE", "ADAPT", "ESCALATE"] as const).map((d) => (
            <div key={d} className="rounded-xl border border-border bg-card p-6">
              <DecisionBadge decision={d} size="lg" />
              <p className="mt-4 text-sm text-muted-foreground">{DECISION_META[d].description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-y border-border bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-center">The core resolution flow</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            Every customer message runs through the full pipeline before EscalAIte ever
            hands off to a human.
          </p>
          <div className="mt-10 flex flex-wrap items-stretch justify-center gap-2">
            {PIPELINE.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex w-32 flex-col items-center gap-2 rounded-lg border border-border bg-card px-3 py-4 text-center">
                  <step.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium leading-tight">{step.label}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 signals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Beyond sentiment: 11 escalation signals</h2>
            <p className="mt-3 text-muted-foreground">
              EscalAIte evaluates eleven independent signals every time a customer message
              arrives, then calculates a single Escalation Risk score from 0–100.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {ELEVEN_SIGNALS.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Escalation Risk thresholds</h3>
            <div className="mt-4 space-y-3">
              {[
                { range: "0 – 39", label: "SOLVE", color: "solve" },
                { range: "40 – 69", label: "ADAPT", color: "adapt" },
                { range: "70 – 84", label: "HIGH RISK", color: "escalate" },
                { range: "85 – 100", label: "ESCALATE", color: "critical" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                  <span className="text-sm font-mono text-muted-foreground">{row.range}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: `hsl(var(--${row.color}))` }}
                  >
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Every decision comes with a full explanation of why it was made.
            </p>
          </div>
        </div>
      </section>

      {/* Surfaces */}
      <section className="border-t border-border bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-center">Explore the product</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold group-hover:text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
        <p className="text-xl sm:text-2xl font-medium leading-relaxed">
          Most customer-support AI is optimized to answer.
          <br />
          <span className="text-primary">EscalAIte is optimized to resolve.</span>
        </p>
        <p className="mt-6 text-muted-foreground">
          When automation helps, it solves. When the current strategy fails, it adapts.
          And when continuing with AI is no longer the best option, it knows when to stop.
        </p>
      </section>
    </Layout>
  );
}
