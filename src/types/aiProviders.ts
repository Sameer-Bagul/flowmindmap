
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
