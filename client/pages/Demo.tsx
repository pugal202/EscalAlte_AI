import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/resolveai/Layout";
import { RiskMeter } from "@/components/resolveai/RiskMeter";
import { DecisionBadge } from "@/components/resolveai/DecisionBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GUIDED_DEMO_TIMELINE,
  GUIDED_DEMO_SCENARIO,
  SCENARIOS,
  Decision,
  Scenario,
} from "@/lib/resolveai";
import { Play, Pause, SkipForward, RotateCcw, Bot, User, Cpu, AlertTriangle } from "lucide-react";

type View = "guided" | "scenario";

export default function Demo() {
  const [view, setView] = useState<View>("guided");
  const [scenarioId, setScenarioId] = useState<string>("high");

  // Guided demo state
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setStepIndex((i) => {
          if (i >= GUIDED_DEMO_TIMELINE.length - 1) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, 1700);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing]);

  const currentStep = stepIndex >= 0 ? GUIDED_DEMO_TIMELINE[stepIndex] : null;
  const lastDecision: Decision | undefined = useMemo(() => {
    for (let i = stepIndex; i >= 0; i--) {
      const d = GUIDED_DEMO_TIMELINE[i].decision;
      if (d) return d;
    }
    return undefined;
  }, [stepIndex]);

  const risk = currentStep?.risk ?? 0;
  const frustration = currentStep?.frustration ?? 0;
  const escalated = lastDecision === "ESCALATE";

  const activeScenario: Scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hackathon Demo</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Watch a case move from SOLVE to ADAPT to ESCALATE, or jump straight to any
              preset scenario.
            </p>
          </div>
          <div className="flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setView("guided")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                view === "guided" ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
            >
              Guided Demo
            </button>
            <button
              onClick={() => setView("scenario")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                view === "scenario" ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
            >
              Scenario Library
            </button>
          </div>
        </div>

        {view === "guided" ? (
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  if (stepIndex < 0) setStepIndex(0);
                  setPlaying(true);
                }}
                disabled={playing || stepIndex >= GUIDED_DEMO_TIMELINE.length - 1}
                className="gap-2"
              >
                <Play className="h-4 w-4" /> Start Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => setPlaying(false)}
                disabled={!playing}
                className="gap-2"
              >
                <Pause className="h-4 w-4" /> Pause
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPlaying(false);
                  setStepIndex((i) => Math.min(i + 1, GUIDED_DEMO_TIMELINE.length - 1));
                }}
                disabled={stepIndex >= GUIDED_DEMO_TIMELINE.length - 1}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" /> Next Step
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setPlaying(false);
                  setStepIndex(-1);
                }}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <span className="ml-auto text-xs text-muted-foreground">
                Step {Math.max(stepIndex + 1, 0)} / {GUIDED_DEMO_TIMELINE.length}
              </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              {/* Conversation / timeline */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Conversation & Analysis Timeline
                </h2>
                {stepIndex < 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">
                    Press <strong>Start Demo</strong> to begin the scripted escalation scenario.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {GUIDED_DEMO_TIMELINE.slice(0, stepIndex + 1).map((step) => (
                      <div key={step.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                        {step.actor === "system" ? (
                          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                            <Cpu className="h-3.5 w-3.5 shrink-0" />
                            <span>{step.description}</span>
                            {step.decision && <DecisionBadge decision={step.decision} size="sm" />}
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "flex gap-2 max-w-[85%]",
                              step.actor === "ai" && "ml-auto flex-row-reverse",
                            )}
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                              {step.actor === "ai" ? (
                                <Bot className="h-4 w-4 text-primary" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2 text-sm",
                                step.actor === "ai"
                                  ? "bg-primary/15 text-foreground rounded-tr-sm"
                                  : "bg-secondary text-foreground rounded-tl-sm",
                              )}
                            >
                              {step.description}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live risk panel */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
                  <RiskMeter risk={risk} size={140} />
                  <div className="mt-4">
                    {lastDecision ? (
                      <DecisionBadge decision={lastDecision} size="lg" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Awaiting first message…</span>
                    )}
                  </div>
                  <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <div className="font-bold text-adapt">{frustration}%</div>
                      <div className="text-muted-foreground">Frustration</div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <div className="font-bold">{GUIDED_DEMO_SCENARIO.metrics.previousContacts}</div>
                      <div className="text-muted-foreground">Prev. Contacts</div>
                    </div>
                  </div>
                </div>

                {escalated && (
                  <div className="rounded-xl border border-escalate/40 bg-escalate/10 p-5 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 text-escalate font-semibold text-sm">
                      <AlertTriangle className="h-4 w-4" /> HUMAN INTERVENTION REQUIRED
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {GUIDED_DEMO_SCENARIO.handoff?.whyAiStopped}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {escalated && <ScenarioDetail scenario={GUIDED_DEMO_SCENARIO} />}
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenarioId(s.id)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-left text-sm transition-colors",
                    scenarioId === s.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <div className="font-semibold">{s.tag}</div>
                  <div className="text-xs text-muted-foreground">Risk {s.risk}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {activeScenario.title}
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2 text-sm">
                      {activeScenario.customerMessage}
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-2 max-w-[85%] ml-auto">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-2 text-sm">
                      {activeScenario.aiResponse}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
                <RiskMeter risk={activeScenario.risk} size={140} />
                <div className="mt-4">
                  <DecisionBadge decision={activeScenario.decision} size="lg" />
                </div>
              </div>
            </div>

            <ScenarioDetail scenario={activeScenario} />
          </div>
        )}
      </div>
    </Layout>
  );
}

function ScenarioDetail({ scenario }: { scenario: Scenario }) {
  const m = scenario.metrics;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* Live metrics */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Live Escalation Signals
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Metric label="Frustration" value={`${m.frustration}%`} />
          <Metric label="Frustration Trend" value={m.frustrationTrend} />
          <Metric label="Issue Severity" value={m.severity} />
          <Metric label="AI Confidence" value={`${m.aiConfidence}%`} />
          <Metric label="SLA Risk" value={m.slaRisk} />
          <Metric label="Previous Contacts" value={String(m.previousContacts)} />
          <Metric label="Failed Attempts" value={String(m.failedAttempts)} />
          <Metric label="Customer Priority" value={m.priority} />
        </div>
      </div>

      {/* Explainability */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Why did ResolveAI make this decision?
        </h3>
        <div className="mt-4 space-y-2">
          {scenario.factors.map((f) => (
            <div key={f.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{f.label}</span>
              <span className="font-mono font-semibold">+{f.points}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
            <span>TOTAL</span>
            <span className="font-mono">{scenario.risk}</span>
          </div>
        </div>
      </div>

      {/* Prediction */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Escalation Prediction
        </h3>
        <div className="mt-4 flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{scenario.prediction.currentRisk}%</div>
            <div className="text-xs text-muted-foreground">Current Risk</div>
          </div>
          <div className="text-muted-foreground">→</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-escalate">{scenario.prediction.predictedRisk}%</div>
            <div className="text-xs text-muted-foreground">Predicted Risk</div>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold">{scenario.prediction.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{scenario.prediction.reason}</p>
      </div>

      {/* What-if simulator */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          What happens next?
        </h3>
        <div className="mt-4 space-y-3">
          {[
            { label: "Continue AI", value: scenario.whatIf.continueAi },
            { label: "Adaptive Response", value: scenario.whatIf.adaptive },
            { label: "Human Intervention", value: scenario.whatIf.human },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span
                  className={cn(
                    row.label === scenario.whatIf.recommended && "font-bold text-primary",
                  )}
                >
                  {row.label}
                  {row.label === scenario.whatIf.recommended && "  ★ RECOMMENDED"}
                </span>
                <span className="font-mono">{row.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    row.label === scenario.whatIf.recommended ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                  style={{ width: `${row.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human handoff */}
      {scenario.handoff && (
        <div className="lg:col-span-2 rounded-xl border border-escalate/40 bg-escalate/5 p-5">
          <div className="flex items-center gap-2 text-escalate font-semibold text-sm">
            <AlertTriangle className="h-4 w-4" /> AI Handoff Summary
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Customer" value={scenario.customer.name} />
              <Field label="Issue" value={scenario.handoff.issue} />
              <Field label="Frustration" value={`${scenario.metrics.frustration}%`} />
              <Field label="Escalation Risk" value={`${scenario.risk}%`} />
              <Field label="AI Confidence" value={`${scenario.metrics.aiConfidence}%`} />
            </div>
            <div>
              <div className="mb-2">
                <div className="text-xs text-muted-foreground">What AI Tried</div>
                <ul className="mt-1 list-disc list-inside text-sm">
                  {scenario.handoff.whatAiTried.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <Field label="Why AI Stopped" value={scenario.handoff.whyAiStopped} />
              <Field label="Recommended Action" value={scenario.handoff.recommendedAction} />
              <Field label="SLA" value={scenario.handoff.sla} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
