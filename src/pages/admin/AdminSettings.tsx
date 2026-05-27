import { PALETTES, DESIGNS, useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Check, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const { palette, mode, design, saving, error, setPalette, setMode, setDesign } = useTheme();

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
      <section className="rounded-xl border border-border bg-card p-6">
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
    </div>
  );
};

export default AdminSettings;
