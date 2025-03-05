
import { useState } from "react";
import { AIProvider, AIProviderFormState } from "@/types/aiProviders";
import { AI_PROVIDERS } from "@/constants/aiProviders";

export function useAIProviderForm() {
  const [aiProvider, setAIProvider] = useState<AIProvider>('lmstudio');
  const [formState, setFormState] = useState<AIProviderFormState>({
    serverUrl: AI_PROVIDERS.lmstudio.defaultUrl,
    selectedModel: AI_PROVIDERS.lmstudio.modelOptions[0].value,
    apiKey: ""
  });

  const handleAIProviderChange = (value: AIProvider) => {
    setAIProvider(value);
    setFormState({
      serverUrl: AI_PROVIDERS[value].defaultUrl,
      selectedModel: AI_PROVIDERS[value].modelOptions[0].value,
      apiKey: ""
    });
  };

  const updateFormField = (field: keyof AIProviderFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    aiProvider,
    formState,
    handleAIProviderChange,
    updateFormField
  };
}
