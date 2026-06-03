import { Sun, Moon, Palette, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTheme, PALETTES, DESIGNS } from "@/contexts/ThemeContext";

type ThemeSwitcherProps = {
  allowThemeControls?: boolean;
  persistChanges?: boolean;
};

const ThemeSwitcher = ({ allowThemeControls = false, persistChanges = false }: ThemeSwitcherProps) => {
  const { palette, mode, design, setPalette, setDesign, toggleMode } = useTheme();
  const [open, setOpen] = useState<null | "palette" | "design">(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      {/* Mode toggle */}
      <button
        onClick={() => toggleMode(persistChanges)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Toggle light/dark mode"
      >
        <AnimatePresence mode="wait">
          {mode === "dark" ? (
            <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Moon size={16} />
            </motion.div>
          ) : (
            <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sun size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {allowThemeControls && (
        <>
          {/* Design picker */}
          <button
            onClick={() => setOpen(open === "design" ? null : "design")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Choose design style"
          >
            <Layers size={16} />
          </button>

          {/* Palette picker */}
          <button
            onClick={() => setOpen(open === "palette" ? null : "palette")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Choose color palette"
          >
            <Palette size={16} />
          </button>
        </>
      )}

      <AnimatePresence>
        {allowThemeControls && open === "palette" && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 min-w-[180px] rounded-lg border border-border bg-card p-2 shadow-lg"
          >
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Color Palette</p>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPalette(p.id, persistChanges); setOpen(null); }}
                className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary ${
                  palette === p.id ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                <span className="h-3 w-3 rounded-full ring-1 ring-border" style={{ backgroundColor: p.accent }} />
                {p.label}
                {palette === p.id && <span className="ml-auto text-xs text-primary">✓</span>}
              </button>
            ))}
          </motion.div>
        )}

        {allowThemeControls && open === "design" && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 min-w-[220px] rounded-lg border border-border bg-card p-2 shadow-lg"
          >
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Design Style</p>
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => { setDesign(d.id, persistChanges); setOpen(null); }}
                className={`flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-secondary ${
                  design === d.id ? "bg-secondary/50" : ""
                }`}
              >
                <span className={`flex w-full items-center text-sm ${design === d.id ? "text-foreground font-medium" : "text-foreground/90"}`}>
                  {d.label}
                  {design === d.id && <span className="ml-auto text-xs text-primary">✓</span>}
                </span>
                <span className="text-xs text-muted-foreground">{d.description}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
