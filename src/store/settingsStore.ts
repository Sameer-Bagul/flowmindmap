import { create } from 'zustand';

interface SettingsState {
  // Background color feature removed, only theme handling remains
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));