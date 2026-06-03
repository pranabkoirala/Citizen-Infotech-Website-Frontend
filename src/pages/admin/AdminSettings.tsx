import { useState } from "react";
import { PALETTES, DESIGNS, LOGO_VARIANTS, useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Check, Loader2, Database, AlertTriangle, Image, Palette } from "lucide-react";
import { seedApi, type SeedResult } from "@/lib/api";

const AdminSettings = () => {
  const { palette, mode, design, logoVariant, saving, error, setPalette, setMode, setDesign, setLogoVariant } = useTheme();

  // Seed state
  const [seedMode, setSeedMode] = useState<"upsert" | "replace">("upsert");
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSeed = async () => {
    setShowConfirm(false);
    setSeedLoading(true);
    setSeedResult(null);
    setSeedError(null);
    try {
      const result = await seedApi.run(seedMode);
      setSeedResult(result);
    } catch (err: unknown) {
      setSeedError(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Theme & Settings</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Changes here update the public site for every visitor.
      </p>
      {saving && (
        <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" />
          Saving theme...
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Theme save failed: {error}. Make sure you are logged in as admin.
        </p>
      )}

      {/* Logo */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Logo</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOGO_VARIANTS.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setLogoVariant(variant.id, true)}
              className={`flex flex-col gap-4 rounded-lg border p-4 text-left transition-all ${
                logoVariant === variant.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <span className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
                  {variant.id === "png" ? <Image size={16} /> : <Palette size={16} />}
                </span>
                <span>
                  <span className={`block text-sm ${logoVariant === variant.id ? "font-medium text-foreground" : "text-foreground/90"}`}>
                    {variant.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {variant.description}
                  </span>
                </span>
                {logoVariant === variant.id && <Check size={14} className="ml-auto shrink-0 text-primary" />}
              </span>

              <span className="flex h-16 items-center rounded-lg border border-border bg-background px-4">
                {variant.id === "png" ? (
                  <img src="/citizen-infotech-logo.png" alt="" className="h-11 w-auto object-contain" />
                ) : (
                  <span className="theme-logo" aria-hidden="true" />
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Mode */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Appearance Mode</h2>
        <div className="flex gap-3">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m, true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 text-sm transition-all ${
                mode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {m === "light" ? <Sun size={16} /> : <Moon size={16} />}
              <span className="capitalize">{m}</span>
              {mode === m && <Check size={14} />}
            </button>
          ))}
        </div>
      </section>

      {/* Palette */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Color Palette</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id, true)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-all ${
                palette === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <span className="h-10 w-10 rounded-full ring-2 ring-border" style={{ backgroundColor: p.accent }} />
              <span className={palette === p.id ? "font-medium text-foreground" : "text-muted-foreground"}>{p.label}</span>
              {palette === p.id && <Check size={12} className="text-primary" />}
            </button>
          ))}
        </div>
      </section>

      {/* Design */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Design Style</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DESIGNS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDesign(d.id, true)}
              className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all ${
                design === d.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <span className={`text-sm ${design === d.id ? "font-medium text-foreground" : "text-foreground/90"}`}>{d.label}</span>
              <span className="text-xs text-muted-foreground">{d.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Database Seeding */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Database size={18} className="text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Database Seeding</h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Populate the database with default content — team members, projects, services, and site settings from the seed file.
        </p>

        {/* Mode selector */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Seed Mode
          </label>
          <div className="flex gap-3">
            {(["upsert", "replace"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSeedMode(m)}
                className={`flex flex-1 flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all ${
                  seedMode === m
                    ? m === "replace"
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className={`text-sm font-medium ${seedMode === m ? "text-foreground" : "text-muted-foreground"}`}>
                  {m === "upsert" ? "Merge (Upsert)" : "Replace"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {m === "upsert"
                    ? "Add missing records, update existing ones"
                    : "Delete all existing data and re-insert from seed"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Confirmation dialog */}
        {showConfirm && (
          <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
              <AlertTriangle size={16} />
              {seedMode === "replace"
                ? "This will DELETE all existing team, projects, and services data before re-inserting."
                : "This will merge seed data into the database. Existing records matched by name/title will be updated."}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSeed}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Yes, run seed
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Run button */}
        {!showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={seedLoading}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {seedLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database size={16} />
                Run Seed Data
              </>
            )}
          </button>
        )}

        {/* Error */}
        {seedError && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            Seed failed: {seedError}
          </p>
        )}

        {/* Success result */}
        {seedResult && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="mb-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Seed completed ({seedResult.mode} mode)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["settings", "services", "projects", "team"] as const).map((key) => {
                const val = seedResult[key];
                const label =
                  "created" in val
                    ? `${val.created} new, ${val.updated} updated`
                    : `${val.updated} updated`;
                return (
                  <div key={key} className="rounded-md border border-border bg-background p-2 text-center">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{key}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminSettings;
