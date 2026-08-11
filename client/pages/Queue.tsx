import { useMemo, useState } from "react";
import { Layout } from "@/components/resolveai/Layout";
import { Link } from "react-router-dom";
import { SCENARIOS } from "@/lib/resolveai";
import { DecisionBadge } from "@/components/resolveai/DecisionBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "Unassigned" | "Assigned" | "In Progress" | "Resolved";

interface QueueRow {
  id: string;
  scenarioId: string;
  customer: string;
  issue: string;
  risk: number;
  priority: string;
  severity: string;
  frustration: number;
  sla: string;
  slaAtRisk: boolean;
  status: Status;
  agent: string | null;
}

const AGENTS = ["Ananya Rao", "Jordan Lee", "Sam Okafor"];

function buildRows(): QueueRow[] {
  return SCENARIOS.map((s, i) => ({
    id: `CASE-${1000 + i}`,
    scenarioId: s.id,
    customer: s.customer.name,
    issue: s.title,
    risk: s.risk,
    priority: s.metrics.priority,
    severity: s.metrics.severity,
    frustration: s.metrics.frustration,
    sla: s.customer.slaRemaining,
    slaAtRisk: s.metrics.slaRisk !== "LOW",
    status: s.risk >= 85 ? "Unassigned" : s.risk >= 40 ? "Assigned" : "Resolved",
    agent: s.risk >= 85 ? null : s.risk >= 40 ? AGENTS[i % AGENTS.length] : AGENTS[i % AGENTS.length],
  }));
}

const FILTERS = ["All", "Critical", "High", "Medium", "Unassigned", "SLA At Risk"] as const;

export default function Queue() {
  const [rows, setRows] = useState<QueueRow[]>(buildRows);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      switch (filter) {
        case "All":
          return true;
        case "Critical":
          return r.risk >= 85;
        case "High":
          return r.risk >= 70 && r.risk < 85;
        case "Medium":
          return r.risk >= 40 && r.risk < 70;
        case "Unassigned":
          return r.status === "Unassigned";
        case "SLA At Risk":
          return r.slaAtRisk;
        default:
          return true;
      }
    });
  }, [rows, filter]);

  const updateRow = (id: string, patch: Partial<QueueRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold">Escalation Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Every open case ranked by risk, priority, and SLA.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                filter === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Frustration</th>
                <th className="px-4 py-3">SLA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[220px]">{r.issue}</td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono font-bold"
                      style={{
                        color:
                          r.risk >= 85
                            ? "hsl(var(--critical))"
                            : r.risk >= 70
                              ? "hsl(var(--escalate))"
                              : r.risk >= 40
                                ? "hsl(var(--adapt))"
                                : "hsl(var(--solve))",
                      }}
                    >
                      {r.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.priority}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.severity}</td>
                  <td className="px-4 py-3">{r.frustration}%</td>
                  <td
                    className={cn(
                      "px-4 py-3 font-mono whitespace-nowrap",
                      r.slaAtRisk && "text-escalate",
                    )}
                  >
                    {r.sla}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{r.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {r.agent ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      {r.status === "Unassigned" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateRow(r.id, { status: "Assigned", agent: AGENTS[0] })}
                        >
                          Assign
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateRow(r.id, {
                              agent: AGENTS[(AGENTS.indexOf(r.agent ?? AGENTS[0]) + 1) % AGENTS.length],
                            })
                          }
                        >
                          Reassign
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/workspace/${r.scenarioId}`}>Open</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRow(r.id, { status: "Resolved" })}
                      >
                        Resolve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                    No cases match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
