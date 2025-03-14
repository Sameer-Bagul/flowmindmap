
import { ReactNode } from "react";

export type AIProvider = 'lmstudio' | 'ollama' | 'gemini' | 'grok';

export interface AIProviderConfig {
  label: string;
  icon: ReactNode;
  defaultUrl: string;
  modelOptions: Array<{value: string, label: string}>;
}

export interface AIProviderFormState {
  serverUrl: string;
  selectedModel: string;
  apiKey: string;
}

// Add localStorage keys for consistent storage access
export const AI_PROVIDER_STORAGE_KEYS = {
  PROVIDER: 'mindmap-ai-provider',
  SERVER_URL: 'mindmap-server-url',
  SELECTED_MODEL: 'mindmap-selected-model',
  API_KEY: 'mindmap-api-key',
};
