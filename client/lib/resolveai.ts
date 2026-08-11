export type Decision = "SOLVE" | "ADAPT" | "ESCALATE" | "IMMEDIATE_ESCALATION";

export function decisionFromRisk(risk: number): Decision {
  if (risk >= 85) return "ESCALATE";
  if (risk >= 70) return "ESCALATE";
  if (risk >= 40) return "ADAPT";
  return "SOLVE";
}

export const DECISION_META: Record<
  Decision,
  { label: string; color: string; badge: string; description: string }
> = {
  SOLVE: {
    label: "SOLVE",
    color: "solve",
    badge: "🟢",
    description: "AI continues resolving the issue autonomously.",
  },
  ADAPT: {
    label: "ADAPT",
    color: "adapt",
    badge: "🟡",
    description: "AI changes strategy — current approach is failing.",
  },
  ESCALATE: {
    label: "ESCALATE",
    color: "escalate",
    badge: "🔴",
    description: "Automated support stops; case is handed to a human.",
  },
  IMMEDIATE_ESCALATION: {
    label: "IMMEDIATE ESCALATION",
    color: "critical",
    badge: "🚨",
    description: "Critical issue detected — bypass queue, alert a human now.",
  },
};

export interface RiskFactor {
  label: string;
  points: number;
}

export interface CustomerContext {
  name: string;
  id: string;
  tier: "Standard" | "Plus" | "Enterprise";
  accountAgeYears: number;
  ltv: string;
  previousTickets: number;
  openTickets: number;
  previousEscalations: number;
  slaRemaining: string;
  channel: "Chat" | "Email" | "Phone";
  issueHistory: string[];
}

export interface Metrics {
  frustration: number;
  frustrationTrend: "STABLE" | "INCREASING" | "RAPIDLY INCREASING";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  aiConfidence: number;
  slaRisk: "LOW" | "MEDIUM" | "HIGH";
  previousContacts: number;
  failedAttempts: number;
  priority: "STANDARD" | "PLUS" | "ENTERPRISE";
}

export interface Prediction {
  currentRisk: number;
  predictedRisk: number;
  label: string;
  reason: string;
}

export interface WhatIf {
  continueAi: number;
  adaptive: number;
  human: number;
  recommended: "Continue AI" | "Adaptive Response" | "Human Intervention";
}

export interface HandoffSummary {
  issue: string;
  whatAiTried: string[];
  whyAiStopped: string;
  recommendedAction: string;
  sla: string;
}

export interface Scenario {
  id: string;
  tag: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  customerMessage: string;
  aiResponse: string;
  risk: number;
  decision: Decision;
  factors: RiskFactor[];
  customer: CustomerContext;
  metrics: Metrics;
  prediction: Prediction;
  whatIf: WhatIf;
  handoff?: HandoffSummary;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "low",
    tag: "LOW",
    title: "Simple account request",
    customerMessage: "How can I change my email address?",
    aiResponse:
      "You can update your email under Settings → Account. I've sent a verification link to confirm the change.",
    risk: 20,
    decision: "SOLVE",
    factors: [
      { label: "Issue Severity", points: 6 },
      { label: "Conversation Repetition", points: 0 },
      { label: "Customer Priority", points: 4 },
      { label: "AI Confidence (high, reduces risk)", points: 10 },
    ],
    customer: {
      name: "Meera Nair",
      id: "CUS-10234",
      tier: "Standard",
      accountAgeYears: 1.2,
      ltv: "$420",
      previousTickets: 2,
      openTickets: 0,
      previousEscalations: 0,
      slaRemaining: "23:40:00",
      channel: "Chat",
      issueHistory: ["Password reset (resolved)"],
    },
    metrics: {
      frustration: 8,
      frustrationTrend: "STABLE",
      severity: "LOW",
      aiConfidence: 96,
      slaRisk: "LOW",
      previousContacts: 1,
      failedAttempts: 0,
      priority: "STANDARD",
    },
    prediction: {
      currentRisk: 20,
      predictedRisk: 22,
      label: "LOW PROBABILITY OF ESCALATION",
      reason: "Routine self-service request with a clear, high-confidence resolution path.",
    },
    whatIf: { continueAi: 4, adaptive: 3, human: 2, recommended: "Continue AI" },
  },
  {
    id: "medium",
    tag: "MEDIUM",
    title: "Delayed order",
    customerMessage: "My order is delayed again. Can you tell me when it will arrive?",
    aiResponse:
      "Your order is currently with the carrier and running 2 days behind schedule. Updated delivery estimate: Thursday.",
    risk: 58,
    decision: "ADAPT",
    factors: [
      { label: "Frustration Trend", points: 14 },
      { label: "Repeated Contacts", points: 12 },
      { label: "Issue Severity", points: 10 },
      { label: "SLA Risk", points: 12 },
      { label: "Customer Priority", points: 10 },
    ],
    customer: {
      name: "Daniel Cho",
      id: "CUS-88213",
      tier: "Plus",
      accountAgeYears: 2.4,
      ltv: "$1,860",
      previousTickets: 5,
      openTickets: 1,
      previousEscalations: 0,
      slaRemaining: "06:12:00",
      channel: "Email",
      issueHistory: ["Delayed order (this is contact #2)"],
    },
    metrics: {
      frustration: 47,
      frustrationTrend: "INCREASING",
      severity: "MEDIUM",
      aiConfidence: 71,
      slaRisk: "MEDIUM",
      previousContacts: 2,
      failedAttempts: 1,
      priority: "PLUS",
    },
    prediction: {
      currentRisk: 58,
      predictedRisk: 74,
      label: "MODERATE PROBABILITY OF ESCALATION",
      reason: "Customer has repeated the same request and previous resolution attempts failed.",
    },
    whatIf: { continueAi: 62, adaptive: 31, human: 18, recommended: "Adaptive Response" },
  },
  {
    id: "high",
    tag: "HIGH",
    title: "Payment deducted, order missing",
    customerMessage:
      "I've contacted support three times. My payment was deducted and nobody has fixed this.",
    aiResponse:
      "I understand this is frustrating. I've re-verified your payment and I'm escalating this for priority review.",
    risk: 91,
    decision: "ESCALATE",
    factors: [
      { label: "Frustration Trend", points: 24 },
      { label: "Repeated Contacts", points: 19 },
      { label: "Issue Severity", points: 18 },
      { label: "Low AI Confidence", points: 15 },
      { label: "SLA Risk", points: 10 },
      { label: "Customer Priority", points: 5 },
    ],
    customer: {
      name: "Rahul Sharma",
      id: "CUS-40417",
      tier: "Enterprise",
      accountAgeYears: 4.1,
      ltv: "$48,200",
      previousTickets: 11,
      openTickets: 1,
      previousEscalations: 1,
      slaRemaining: "01:24:36",
      channel: "Phone",
      issueHistory: [
        "Payment verification (unresolved)",
        "Order retry (failed)",
        "Refund instructions (unresolved)",
      ],
    },
    metrics: {
      frustration: 89,
      frustrationTrend: "RAPIDLY INCREASING",
      severity: "HIGH",
      aiConfidence: 46,
      slaRisk: "HIGH",
      previousContacts: 3,
      failedAttempts: 3,
      priority: "ENTERPRISE",
    },
    prediction: {
      currentRisk: 68,
      predictedRisk: 82,
      label: "HIGH PROBABILITY OF ESCALATION",
      reason: "Customer has repeated the same request and previous resolution attempts failed.",
    },
    whatIf: { continueAi: 87, adaptive: 48, human: 21, recommended: "Human Intervention" },
    handoff: {
      issue: "Payment deducted but order not created",
      whatAiTried: ["Payment verification", "Order retry", "Refund instructions"],
      whyAiStopped: "Repeated resolution failures combined with high frustration and low confidence.",
      recommendedAction: "Verify payment transaction and initiate recovery.",
      sla: "01:24:36 remaining",
    },
  },
  {
    id: "critical",
    tag: "CRITICAL",
    title: "Unauthorized transaction",
    customerMessage: "There is an unauthorized transaction on my account.",
    aiResponse:
      "This looks like a potential security incident. I'm freezing further automated actions and alerting the fraud & escalation team immediately.",
    risk: 96,
    decision: "IMMEDIATE_ESCALATION",
    factors: [
      { label: "Business Impact / Fraud Risk", points: 30 },
      { label: "Issue Severity", points: 25 },
      { label: "Time Sensitivity", points: 20 },
      { label: "Customer Priority", points: 12 },
      { label: "AI Confidence (insufficient for action)", points: 9 },
    ],
    customer: {
      name: "Priya Patel",
      id: "CUS-77590",
      tier: "Enterprise",
      accountAgeYears: 6.8,
      ltv: "$112,400",
      previousTickets: 3,
      openTickets: 0,
      previousEscalations: 0,
      slaRemaining: "00:14:52",
      channel: "Phone",
      issueHistory: ["No prior fraud reports"],
    },
    metrics: {
      frustration: 74,
      frustrationTrend: "RAPIDLY INCREASING",
      severity: "CRITICAL",
      aiConfidence: 38,
      slaRisk: "HIGH",
      previousContacts: 1,
      failedAttempts: 0,
      priority: "ENTERPRISE",
    },
    prediction: {
      currentRisk: 96,
      predictedRisk: 96,
      label: "IMMEDIATE ESCALATION REQUIRED",
      reason: "Suspected fraud / unauthorized transaction — outside AI's authority to resolve.",
    },
    whatIf: { continueAi: 94, adaptive: 66, human: 8, recommended: "Human Intervention" },
    handoff: {
      issue: "Unauthorized transaction reported by customer",
      whatAiTried: ["Account activity check", "Automated fraud flag"],
      whyAiStopped: "Suspected fraud requires human security review; outside AI authority.",
      recommendedAction: "Route to fraud & security team; freeze card and open investigation.",
      sla: "00:14:52 remaining",
    },
  },
];

export interface TimelineStep {
  id: number;
  actor: "customer" | "ai" | "system";
  title: string;
  description: string;
  risk: number;
  frustration: number;
  decision?: Decision;
}

export const GUIDED_DEMO_TIMELINE: TimelineStep[] = [
  {
    id: 1,
    actor: "customer",
    title: "Customer message",
    description:
      "\"I've contacted support three times. My payment was deducted and nobody has fixed this.\"",
    risk: 42,
    frustration: 55,
  },
  {
    id: 2,
    actor: "ai",
    title: "AI analysis",
    description: "Intent: billing dispute. Sentiment: negative. Initial risk calculated from 11 signals.",
    risk: 42,
    frustration: 55,
    decision: "SOLVE",
  },
  {
    id: 3,
    actor: "ai",
    title: "AI response & resolution attempt",
    description: "AI re-verifies the payment and offers a standard resolution path.",
    risk: 42,
    frustration: 55,
    decision: "SOLVE",
  },
  {
    id: 4,
    actor: "system",
    title: "Resolution attempt fails",
    description: "Payment re-verification does not resolve the missing order. Frustration rises.",
    risk: 61,
    frustration: 71,
  },
  {
    id: 5,
    actor: "system",
    title: "Risk increases — strategy change required",
    description: "Failed attempt + rising frustration push the case past the ADAPT threshold.",
    risk: 61,
    frustration: 71,
    decision: "ADAPT",
  },
  {
    id: 6,
    actor: "ai",
    title: "AI adapts strategy",
    description: "AI switches from self-service scripts to a manual refund investigation offer.",
    risk: 78,
    frustration: 80,
    decision: "ADAPT",
  },
  {
    id: 7,
    actor: "customer",
    title: "Another customer message",
    description: "\"This is the third time — just give me my money back or send someone who can fix it.\"",
    risk: 78,
    frustration: 86,
    decision: "ADAPT",
  },
  {
    id: 8,
    actor: "system",
    title: "Risk crosses 85 — ESCALATE",
    description: "Repeated contacts, rapidly increasing frustration, and low AI confidence push risk to 91.",
    risk: 91,
    frustration: 89,
    decision: "ESCALATE",
  },
  {
    id: 9,
    actor: "system",
    title: "AI stops automated resolution",
    description: "ResolveAI halts further automated attempts to avoid compounding customer frustration.",
    risk: 91,
    frustration: 89,
    decision: "ESCALATE",
  },
  {
    id: 10,
    actor: "system",
    title: "Human escalation created",
    description: "A CRITICAL priority case is created and routed to the enterprise support queue.",
    risk: 91,
    frustration: 89,
    decision: "ESCALATE",
  },
  {
    id: 11,
    actor: "ai",
    title: "Agent handoff summary generated",
    description: "AI compiles a full case summary and recommended action for the receiving agent.",
    risk: 91,
    frustration: 89,
    decision: "ESCALATE",
  },
];

export const GUIDED_DEMO_SCENARIO = SCENARIOS.find((s) => s.id === "high")!;

export interface AuditEvent {
  id: string;
  timestamp: string;
  conversation: string;
  risk: number;
  decision: Decision;
  factors: string;
  aiConfidence: number;
  recommendedAction: string;
  humanOverride: boolean;
  overrideReason?: string;
}

export const AUDIT_LOG: AuditEvent[] = [
  {
    id: "AUD-1042",
    timestamp: "2025-06-02 09:14:02",
    conversation: "CUS-40417 · Rahul Sharma",
    risk: 91,
    decision: "ESCALATE",
    factors: "Frustration trend, repeated contacts, low confidence",
    aiConfidence: 46,
    recommendedAction: "Verify payment transaction and initiate recovery.",
    humanOverride: false,
  },
  {
    id: "AUD-1041",
    timestamp: "2025-06-02 08:52:41",
    conversation: "CUS-77590 · Priya Patel",
    risk: 96,
    decision: "IMMEDIATE_ESCALATION",
    factors: "Fraud risk, time sensitivity, severity",
    aiConfidence: 38,
    recommendedAction: "Route to fraud & security team.",
    humanOverride: false,
  },
  {
    id: "AUD-1039",
    timestamp: "2025-06-01 17:03:19",
    conversation: "CUS-88213 · Daniel Cho",
    risk: 58,
    decision: "ADAPT",
    factors: "SLA risk, repeated contacts",
    aiConfidence: 71,
    recommendedAction: "Offer proactive shipping update + goodwill credit.",
    humanOverride: false,
  },
  {
    id: "AUD-1036",
    timestamp: "2025-06-01 11:47:55",
    conversation: "CUS-10234 · Meera Nair",
    risk: 20,
    decision: "SOLVE",
    factors: "Low severity, high AI confidence",
    aiConfidence: 96,
    recommendedAction: "None — resolved automatically.",
    humanOverride: false,
  },
  {
    id: "AUD-1028",
    timestamp: "2025-05-30 14:21:07",
    conversation: "CUS-51820 · Wei Zhang",
    risk: 88,
    decision: "ESCALATE",
    factors: "SLA breach risk, business impact",
    aiConfidence: 52,
    recommendedAction: "Prioritize enterprise SLA recovery.",
    humanOverride: true,
    overrideReason: "Agent confirmed root cause already fixed — continued with AI resolution.",
  },
];

export const CASE_TIMELINE = [
  "Customer contacted support",
  "AI started",
  "Resolution attempt",
  "Attempt failed",
  "Frustration increased",
  "Risk increased",
  "ADAPT",
  "ESCALATE",
  "Human accepted",
  "Resolved",
];

export const ELEVEN_SIGNALS = [
  "Customer frustration",
  "Frustration trend",
  "Previous contacts",
  "Failed resolution attempts",
  "Issue severity",
  "Customer priority",
  "SLA breach risk",
  "AI confidence",
  "Conversation repetition",
  "Time sensitivity",
  "Business impact",
];
