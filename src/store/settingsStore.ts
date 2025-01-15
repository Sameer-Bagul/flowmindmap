import { create } from 'zustand';

interface SettingsState {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  backgroundColor: '#1e1e1e', // Default dark background
  setBackgroundColor: (color) => set({ backgroundColor: color }),
}));