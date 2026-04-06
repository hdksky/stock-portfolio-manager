import { create } from "zustand";

export type ColorScheme = "red-up" | "green-up";

interface SettingsState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const STORAGE_KEY = "pnl_color_scheme";
const VALID_SCHEMES: ColorScheme[] = ["red-up", "green-up"];

function loadColorScheme(): ColorScheme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return VALID_SCHEMES.includes(stored as ColorScheme) ? (stored as ColorScheme) : "red-up";
}

export const useSettingsStore = create<SettingsState>((set) => ({
  colorScheme: loadColorScheme(),
  setColorScheme: (scheme) => {
    localStorage.setItem(STORAGE_KEY, scheme);
    set({ colorScheme: scheme });
  },
}));
