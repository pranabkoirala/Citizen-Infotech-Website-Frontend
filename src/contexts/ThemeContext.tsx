import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { settingsApi } from "@/lib/api";

export type ColorPalette = "ocean" | "sunset" | "forest" | "midnight";
export type Mode = "dark" | "light";
export type Design = "modern" | "brutalist" | "pastel" | "terminal";

interface ThemeContextType {
  palette: ColorPalette;
  mode: Mode;
  design: Design;
  saving: boolean;
  error: string | null;
  setPalette: (p: ColorPalette) => void;
  setMode: (m: Mode) => void;
  setDesign: (d: Design) => void;
  toggleMode: () => void;
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull theme from server on mount so all visitors see admin-chosen theme.
  useEffect(() => {
    settingsApi.get().then((s) => {
      if (s?.palette) { setPaletteState(s.palette as ColorPalette); localStorage.setItem("ci-palette", s.palette); }
      if (s?.mode) { setModeState(s.mode as Mode); localStorage.setItem("ci-mode", s.mode); }
      if (s?.design) { setDesignState(s.design as Design); localStorage.setItem("ci-design", s.design); }
    }).catch(() => { /* keep local fallback */ });
  }, []);

  const persistRemote = async (data: Partial<{ palette: string; mode: string; design: string }>) => {
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

  const setPalette = (p: ColorPalette) => {
    setPaletteState(p);
    localStorage.setItem("ci-palette", p);
    persistRemote({ palette: p });
  };

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem("ci-mode", m);
    persistRemote({ mode: m });
  };

  const setDesign = (d: Design) => {
    setDesignState(d);
    localStorage.setItem("ci-design", d);
    persistRemote({ design: d });
  };

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-palette", palette);
    root.setAttribute("data-mode", mode);
    root.setAttribute("data-design", design);
  }, [palette, mode, design]);

  return (
    <ThemeContext.Provider value={{ palette, mode, design, saving, error, setPalette, setMode, setDesign, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
