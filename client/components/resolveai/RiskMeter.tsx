import { useEffect, useState } from "react";

function riskColorVar(risk: number) {
  if (risk >= 85) return "--critical";
  if (risk >= 70) return "--escalate";
  if (risk >= 40) return "--adapt";
  return "--solve";
}

export function RiskMeter({
  risk,
  size = 128,
  label = "Escalation Risk",
}: {
  risk: number;
  size?: number;
  label?: string;
}) {
  const [display, setDisplay] = useState(risk);

  useEffect(() => {
    const start = display;
    const delta = risk - start;
    if (delta === 0) return;
    const duration = 600;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      setDisplay(Math.round(start + delta * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [risk]);

  const colorVar = riskColorVar(display);
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - display / 100);

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={8}
            fill="none"
            stroke="hsl(var(--border))"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            stroke={`hsl(var(${colorVar}))`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke 300ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums" style={{ color: `hsl(var(${colorVar}))` }}>
            {display}
          </span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
}
