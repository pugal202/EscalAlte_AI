import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/resolveai/Layout";
import { DecisionBadge } from "@/components/resolveai/DecisionBadge";
import { RiskMeter } from "@/components/resolveai/RiskMeter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SCENARIOS } from "@/lib/resolveai";
import { Sparkles } from "lucide-react";

const AI_ASSIST: Record<string, string> = {
  "Summarize Case":
    "Enterprise customer contacted support three times about a deducted payment with no order created. Two prior AI resolution attempts (payment re-verification, order retry) failed to resolve the issue, and frustration has risen sharply.",
  "Recommend Next Action":
    "Verify the payment transaction against the payment processor's ledger, manually create or refund the order, and proactively notify the customer within the next 30 minutes given the SLA window.",
  "Generate Customer Response":
    "\"Hi, I'm really sorry for the trouble this has caused. I've personally taken over your case and I'm verifying your payment right now — I'll have an update for you within the hour.\"",
  "Explain Escalation":
    "Risk crossed the 85-point ESCALATE threshold because of rapidly increasing frustration (+24), three repeated contacts (+19), high issue severity (+18), and low AI confidence (+15) in the current resolution path.",
};

export default function Workspace() {
  const { id = "high" } = useParams();
  const scenario = SCENARIOS.find((s) => s.id === id) ?? SCENARIOS.find((s) => s.id === "high")!;

  const [status, setStatus] = useState<"Unassigned" | "Accepted" | "In Progress" | "Resolved">(
    scenario.risk >= 85 ? "Unassigned" : "In Progress",
  );
  const [notes, setNotes] = useState<string[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [messages, setMessages] = useState<{ from: "customer" | "agent"; text: string }[]>([
    { from: "customer", text: scenario.customerMessage },
    { from: "agent", text: scenario.aiResponse },
  ]);
  const [messageDraft, setMessageDraft] = useState("");
  const [aiPanel, setAiPanel] = useState<string | null>(null);
  const [override, setOverride] = useState<string | null>(null);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Agent Workspace</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Case {scenario.customer.id} · {scenario.customer.name}
            </p>
          </div>
          <div className="flex gap-2">
            {SCENARIOS.map((s) => (
              <Link
                key={s.id}
                to={`/workspace/${s.id}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  s.id === scenario.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {s.tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Conversation */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Conversation
              </h2>
              <div className="mt-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      m.from === "agent"
                        ? "ml-auto bg-primary/15 rounded-tr-sm"
                        : "bg-secondary rounded-tl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Textarea
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  placeholder="Send a message to the customer…"
                  className="min-h-[44px]"
                />
                <Button
                  onClick={() => {
                    if (!messageDraft.trim()) return;
                    setMessages((prev) => [...prev, { from: "agent", text: messageDraft }]);
                    setMessageDraft("");
                  }}
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Handoff summary */}
            {scenario.handoff && (
              <div className="rounded-xl border border-escalate/40 bg-escalate/5 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-escalate">
                  AI Handoff Summary
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                  <div><span className="text-muted-foreground">Issue: </span>{scenario.handoff.issue}</div>
                  <div><span className="text-muted-foreground">SLA: </span>{scenario.handoff.sla}</div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">What AI tried: </span>
                    {scenario.handoff.whatAiTried.join(", ")}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Why AI stopped: </span>
                    {scenario.handoff.whyAiStopped}
                  </div>
                  <div className="sm:col-span-2 font-medium">
                    <span className="text-muted-foreground font-normal">Recommended action: </span>
                    {scenario.handoff.recommendedAction}
                  </div>
                </div>
              </div>
            )}

            {/* AI assistance */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI Assistance
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.keys(AI_ASSIST).map((label) => (
                  <Button key={label} size="sm" variant="outline" onClick={() => setAiPanel(label)}>
                    {label}
                  </Button>
                ))}
              </div>
              {aiPanel && (
                <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-sm">
                  <div className="text-xs font-semibold text-primary mb-1">{aiPanel}</div>
                  {AI_ASSIST[aiPanel]}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </h2>
              <div className="mt-3 space-y-2">
                {notes.map((n, i) => (
                  <div key={i} className="rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                    {n}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add an internal note…"
                  className="min-h-[44px]"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!noteDraft.trim()) return;
                    setNotes((prev) => [...prev, noteDraft]);
                    setNoteDraft("");
                  }}
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
              <RiskMeter risk={scenario.risk} size={120} />
              <div className="mt-3"><DecisionBadge decision={scenario.decision} /></div>
              <span className="mt-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {status}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2 text-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Customer Context
              </h3>
              <Row label="Name" value={scenario.customer.name} />
              <Row label="Customer ID" value={scenario.customer.id} />
              <Row label="Tier" value={scenario.customer.tier} />
              <Row label="Account Age" value={`${scenario.customer.accountAgeYears} yrs`} />
              <Row label="LTV" value={scenario.customer.ltv} />
              <Row label="Previous Tickets" value={String(scenario.customer.previousTickets)} />
              <Row label="Open Tickets" value={String(scenario.customer.openTickets)} />
              <Row label="Previous Escalations" value={String(scenario.customer.previousEscalations)} />
              <Row label="SLA Remaining" value={scenario.customer.slaRemaining} />
              <Row label="Channel" value={scenario.customer.channel} />
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Agent Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => setStatus("Accepted")}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus("In Progress")}>Assign</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus("In Progress")}>Reassign</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus("Resolved")}>Resolve</Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Human Override
              </h3>
              {override ? (
                <p className="text-sm text-solve">{override}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setOverride(
                        scenario.decision === "SOLVE"
                          ? "Overridden to ESCALATE by agent."
                          : "Overridden to Continue AI by agent.",
                      )
                    }
                  >
                    {scenario.decision === "SOLVE" ? "Override → Escalate" : "Override → Continue AI"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
