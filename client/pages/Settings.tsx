import { useState } from "react";
import { Layout } from "@/components/resolveai/Layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [compact, setCompact] = useState(false);
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage safe workspace preferences for the EscalAIte demo.</p>
        <div className="mt-8 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Profile preferences</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary/50 p-4"><div className="text-xs text-muted-foreground">Name</div><div className="mt-1 text-sm font-medium">Pugalarasi S</div></div>
              <div className="rounded-lg bg-secondary/50 p-4"><div className="text-xs text-muted-foreground">Role</div><div className="mt-1 text-sm font-medium">Administrator</div></div>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Appearance</h2>
            <label className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <span><span className="block text-sm font-medium">Compact workspace density</span><span className="block text-xs text-muted-foreground">Use tighter spacing in operational tables.</span></span>
              <input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} className="h-4 w-4 accent-primary" />
            </label>
            <Button className="mt-4" onClick={() => setSaved(true)}>{saved && <Check className="mr-2 h-4 w-4" />} {saved ? "Saved" : "Save preferences"}</Button>
          </section>
          <p className="text-xs text-muted-foreground">Passwords, authentication tokens, API keys, and private credentials are not displayed or managed in this demo.</p>
        </div>
      </div>
    </Layout>
  );
}
