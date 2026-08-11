import { Decision, DECISION_META } from "@/lib/resolveai";
import { cn } from "@/lib/utils";

export function DecisionBadge({
  decision,
  size = "md",
}: {
  decision: Decision;
  size?: "sm" | "md" | "lg";
}) {
  const meta = DECISION_META[decision];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide border",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-base",
      )}
      style={{
        backgroundColor: `hsl(var(--${meta.color}) / 0.15)`,
        color: `hsl(var(--${meta.color}))`,
        borderColor: `hsl(var(--${meta.color}) / 0.35)`,
      }}
    >
      <span>{meta.badge}</span>
      {meta.label}
    </span>
  );
}
