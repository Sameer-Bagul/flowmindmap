
"use client";

import { useState, useEffect } from "react";
import { AIProvider, AIProviderFormState, AI_PROVIDER_STORAGE_KEYS } from "@/types/aiProviders";
import { AI_PROVIDERS } from "@/constants/aiProviders";

export function useAIProviderForm() {
  const [aiProvider, setAIProvider] = useState<AIProvider>('lmstudio');
  const [formState, setFormState] = useState<AIProviderFormState>({
    serverUrl: AI_PROVIDERS.lmstudio.defaultUrl,
    selectedModel: AI_PROVIDERS.lmstudio.modelOptions[0].value,
    apiKey: ""
  });

  // Load saved settings from localStorage on initial mount
  useEffect(() => {
    try {
      const savedProvider = localStorage.getItem(AI_PROVIDER_STORAGE_KEYS.PROVIDER) as AIProvider | null;
      const savedServerUrl = localStorage.getItem(AI_PROVIDER_STORAGE_KEYS.SERVER_URL);
      const savedSelectedModel = localStorage.getItem(AI_PROVIDER_STORAGE_KEYS.SELECTED_MODEL);
      const savedApiKey = localStorage.getItem(AI_PROVIDER_STORAGE_KEYS.API_KEY);
      
      if (savedProvider && AI_PROVIDERS[savedProvider]) {
        setAIProvider(savedProvider);
      }
      
      setFormState(prev => ({
        serverUrl: savedServerUrl || AI_PROVIDERS[aiProvider].defaultUrl,
        selectedModel: savedSelectedModel || AI_PROVIDERS[aiProvider].modelOptions[0].value,
        apiKey: savedApiKey || ""
      }));
    } catch (error) {
      console.error("Error loading AI provider settings:", error);
    }
  }, []);

  const handleAIProviderChange = (value: AIProvider) => {
    setAIProvider(value);
    setFormState({
      serverUrl: AI_PROVIDERS[value].defaultUrl,
      selectedModel: AI_PROVIDERS[value].modelOptions[0].value,
      apiKey: ""
    });
    
    // Save to localStorage
    localStorage.setItem(AI_PROVIDER_STORAGE_KEYS.PROVIDER, value);
    localStorage.setItem(AI_PROVIDER_STORAGE_KEYS.SERVER_URL, AI_PROVIDERS[value].defaultUrl);
    localStorage.setItem(AI_PROVIDER_STORAGE_KEYS.SELECTED_MODEL, AI_PROVIDERS[value].modelOptions[0].value);
    localStorage.removeItem(AI_PROVIDER_STORAGE_KEYS.API_KEY);
  };

  const updateFormField = (field: keyof AIProviderFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Save to localStorage
    localStorage.setItem(
      field === 'serverUrl' 
        ? AI_PROVIDER_STORAGE_KEYS.SERVER_URL 
        : field === 'selectedModel'
          ? AI_PROVIDER_STORAGE_KEYS.SELECTED_MODEL
          : AI_PROVIDER_STORAGE_KEYS.API_KEY, 
      value
    );
  };

  return {
    aiProvider,
    formState,
    handleAIProviderChange,
    updateFormField
  };
}
