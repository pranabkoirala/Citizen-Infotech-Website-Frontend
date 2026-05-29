import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { settingsApi } from "@/lib/api";

export type ColorPalette = "ocean" | "sunset" | "forest" | "midnight";
export type Mode = "dark" | "light";
export type Design = "modern" | "brutalist" | "pastel" | "terminal";
export type LogoVariant = "theme-svg" | "png";

interface ThemeContextType {
  palette: ColorPalette;
  mode: Mode;
  design: Design;
  logoVariant: LogoVariant;
  saving: boolean;
  error: string | null;
  setPalette: (p: ColorPalette, persist?: boolean) => void;
  setMode: (m: Mode, persist?: boolean) => void;
  setDesign: (d: Design, persist?: boolean) => void;
  setLogoVariant: (v: LogoVariant, persist?: boolean) => void;
  toggleMode: (persist?: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export const PALETTES: { id: ColorPalette; label: string; accent: string }[] = [
  { id: "ocean", label: "Ocean", accent: "#0ea5e9" },
  { id: "sunset", label: "Sunset", accent: "#f97316" },
  { id: "forest", label: "Forest", accent: "#22c55e" },
  { id: "midnight", label: "Midnight", accent: "#a78bfa" },
];

export const DESIGNS: { id: Design; label: string; description: string }[] = [
  { id: "modern", label: "Modern", description: "Glassy, animated, gradient" },
  { id: "brutalist", label: "Brutalist", description: "Editorial, sharp, serif" },
  { id: "pastel", label: "Pastel", description: "Soft, rounded, friendly" },
  { id: "terminal", label: "Terminal", description: "Mono, neon, retro" },
];

export const LOGO_VARIANTS: { id: LogoVariant; label: string; description: string }[] = [
  { id: "theme-svg", label: "Theme-aware SVG", description: "Logo recolors automatically with the selected theme" },
  { id: "png", label: "Original PNG", description: "Use the uploaded full-color PNG logo" },
];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [palette, setPaletteState] = useState<ColorPalette>(() =>
    (localStorage.getItem("ci-palette") as ColorPalette) || "ocean"
  );
  const [mode, setModeState] = useState<Mode>(() =>
    (localStorage.getItem("ci-mode") as Mode) || "dark"
  );
  const [design, setDesignState] = useState<Design>(() =>
    (localStorage.getItem("ci-design") as Design) || "modern"
  );
  const [logoVariant, setLogoVariantState] = useState<LogoVariant>(() =>
    (localStorage.getItem("ci-logo-variant") as LogoVariant) || "theme-svg"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull theme from server on mount so all visitors see admin-chosen theme.
  useEffect(() => {
    settingsApi.get().then((s) => {
      if (s?.palette) { setPaletteState(s.palette as ColorPalette); localStorage.setItem("ci-palette", s.palette); }
      if (s?.mode) { setModeState(s.mode as Mode); localStorage.setItem("ci-mode", s.mode); }
      if (s?.design) { setDesignState(s.design as Design); localStorage.setItem("ci-design", s.design); }
      if (s?.logo_variant === "png" || s?.logo_variant === "theme-svg") {
        setLogoVariantState(s.logo_variant);
        localStorage.setItem("ci-logo-variant", s.logo_variant);
      }
    }).catch(() => { /* keep local fallback */ });
  }, []);

  const persistRemote = async (data: Partial<{ palette: string; mode: string; design: string; logo_variant: string; logo_style: string }>) => {
    setSaving(true);
    setError(null);
    try {
      await settingsApi.update(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Theme save failed");
    } finally {
      setSaving(false);
    }
  };

  const setPalette = (p: ColorPalette, persist = false) => {
    setPaletteState(p);
    localStorage.setItem("ci-palette", p);
    if (persist) persistRemote({ palette: p });
  };

  const setMode = (m: Mode, persist = false) => {
    setModeState(m);
    localStorage.setItem("ci-mode", m);
    if (persist) persistRemote({ mode: m });
  };

  const setDesign = (d: Design, persist = false) => {
    setDesignState(d);
    localStorage.setItem("ci-design", d);
    if (persist) persistRemote({ design: d });
  };

  const setLogoVariant = (v: LogoVariant, persist = false) => {
    setLogoVariantState(v);
    localStorage.setItem("ci-logo-variant", v);
    if (persist) persistRemote({ logo_variant: v });
  };

  const toggleMode = (persist = false) => setMode(mode === "dark" ? "light" : "dark", persist);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-palette", palette);
    root.setAttribute("data-mode", mode);
    root.setAttribute("data-design", design);
  }, [palette, mode, design]);

  return (
    <ThemeContext.Provider value={{ palette, mode, design, logoVariant, saving, error, setPalette, setMode, setDesign, setLogoVariant, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
