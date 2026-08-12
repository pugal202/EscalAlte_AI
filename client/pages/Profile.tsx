import { Layout } from "@/components/resolveai/Layout";
import { getDemoRole } from "@/lib/demo-auth";
import { ShieldCheck, UserCircle2 } from "lucide-react";

export default function Profile() {
  const role = getDemoRole();
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your public demo profile and workspace role.</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Pugalarasi S</h2>
              <p className="text-sm text-muted-foreground">Product Creator / Administrator</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Application" value="EscalAIte" />
            <Info label="Current role" value={role === "ADMIN" ? "Administrator" : role === "AGENT" ? "Support Agent" : "Customer"} />
            <Info label="Subtitle" value="Intelligent Customer Escalation & Resolution" />
            <Info label="Account visibility" value="Demo profile" />
          </div>
          <div className="mt-6 flex gap-3 rounded-lg border border-solve/30 bg-solve/10 p-4 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-solve" />
            <span className="text-muted-foreground">Private credentials, contact details, tokens, and API keys are never displayed in this profile.</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-secondary/50 p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-sm font-medium">{value}</div></div>;
}
