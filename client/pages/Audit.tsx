import { AUDIT_LOG, CASE_TIMELINE } from "@/lib/resolveai";
import { Layout } from "@/components/resolveai/Layout";
import { DecisionBadge } from "@/components/resolveai/DecisionBadge";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Audit() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Every decision, its factors, and any human override — fully traceable.
        </p>

        {/* Case timeline */}
        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Visual Case Timeline
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {CASE_TIMELINE.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium">
                  {step}
                </span>
                {i < CASE_TIMELINE.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Log table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Conversation</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Decision Factors</th>
                <th className="px-4 py-3">AI Confidence</th>
                <th className="px-4 py-3">Recommended Action</th>
                <th className="px-4 py-3">Human Override</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOG.map((e) => (
                <tr key={e.id} className="border-b border-border/60 last:border-0 align-top">
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {e.timestamp}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{e.conversation}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{e.risk}</td>
                  <td className="px-4 py-3">
                    <DecisionBadge decision={e.decision} size="sm" />
                  </td>
                  <td className="px-4 py-3 max-w-[220px] text-muted-foreground">{e.factors}</td>
                  <td className="px-4 py-3">{e.aiConfidence}%</td>
                  <td className="px-4 py-3 max-w-[240px] text-muted-foreground">{e.recommendedAction}</td>
                  <td className="px-4 py-3">
                    {e.humanOverride ? (
                      <div className="flex items-start gap-1.5 text-xs text-adapt">
                        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>{e.overrideReason}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
