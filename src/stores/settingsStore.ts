import { create } from "zustand";

export type ColorScheme = "red-up" | "green-up";

interface SettingsState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const STORAGE_KEY = "pnl_color_scheme";

export const useSettingsStore = create<SettingsState>((set) => ({
  colorScheme: (localStorage.getItem(STORAGE_KEY) as ColorScheme) || "red-up",
  setColorScheme: (scheme) => {
    localStorage.setItem(STORAGE_KEY, scheme);
    set({ colorScheme: scheme });
  },
}));
