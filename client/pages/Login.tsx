import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EscalAIteLogo } from "@/components/resolveai/Layout";
import { DemoRole, setDemoRole } from "@/lib/demo-auth";

const ROLES: { value: DemoRole; label: string; description: string }[] = [
  { value: "ADMIN", label: "Administrator", description: "Manage decisions, queues, and workspace" },
  { value: "AGENT", label: "Support Agent", description: "Review and resolve customer cases" },
  { value: "CUSTOMER", label: "Customer", description: "View your resolution experience" },
];

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<DemoRole>("ADMIN");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setDemoRole(role);
    navigate(role === "CUSTOMER" ? "/" : "/workspace/high");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <EscalAIteLogo />
          <div className="mt-4 text-2xl font-bold tracking-tight">Escal<span className="text-primary">AI</span>te</div>
          <p className="mt-1 text-sm text-muted-foreground">Intelligent Customer Escalation &amp; Resolution</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Know when to solve.<br />Know when to adapt.<br />Know when to escalate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl">
          <h1 className="text-lg font-semibold">Sign in to EscalAIte</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose a role to enter the secure demo environment.</p>
          <div className="mt-5 space-y-2">
            {ROLES.map((item) => (
              <label key={item.value} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${role === item.value ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/60"}`}>
                <input type="radio" name="role" value={item.value} checked={role === item.value} onChange={() => setRole(item.value)} className="mt-1 accent-primary" />
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.description}</span>
                </span>
              </label>
            ))}
          </div>
          <Button type="submit" className="mt-6 w-full">Continue as {ROLES.find((r) => r.value === role)?.label}</Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">Demo access uses role selection only. No personal credentials are collected.</p>
        </form>
      </div>
    </div>
  );
}
