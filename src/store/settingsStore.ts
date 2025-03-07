
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIProvider } from '@/types/aiProviders';

interface SettingsState {
  aiProvider: AIProvider;
  serverUrl: string;
  selectedModel: string;
  apiKey: string;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAIProvider: (provider: AIProvider) => void;
  setServerUrl: (url: string) => void;
  setSelectedModel: (model: string) => void;
  setApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      aiProvider: 'lmstudio' as AIProvider,
      serverUrl: 'http://localhost:1234',
      selectedModel: 'llama3',
      apiKey: '',
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      setAIProvider: (aiProvider) => set({ aiProvider }),
      setServerUrl: (serverUrl) => set({ serverUrl }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setApiKey: (apiKey) => set({ apiKey }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
