
import { Bot, Cloud, Server, Sparkles } from "lucide-react";
import { AIProvider, AIProviderConfig } from "@/types/aiProviders";

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  lmstudio: {
    label: "LM Studio",
    icon: <Server className="h-4 w-4" />,
    defaultUrl: "http://192.168.1.8:1234",
    modelOptions: [
      { value: "deepseek-r1-distill-qwen-7b", label: "Deepseek R1 Distill QWen 7B" },
      { value: "llama3-8b", label: "Llama 3 8B" },
      { value: "mistral-7b", label: "Mistral 7B" }
    ]
  },
  ollama: {
    label: "Ollama",
    icon: <Bot className="h-4 w-4" />,
    defaultUrl: "http://localhost:11434",
    modelOptions: [
      { value: "llama3:8b", label: "Llama 3 8B" },
      { value: "mistral:7b", label: "Mistral 7B" },
      { value: "gemma:7b", label: "Gemma 7B" }
    ]
  },
  gemini: {
    label: "Google Gemini",
    icon: <Cloud className="h-4 w-4" />,
    defaultUrl: "https://generativelanguage.googleapis.com",
    modelOptions: [
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
      { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" }
    ]
  },
  grok: {
    label: "Grok API",
    icon: <Sparkles className="h-4 w-4" />,
    defaultUrl: "https://api.grok.x",
    modelOptions: [
      { value: "grok-1", label: "Grok-1" }
    ]
  }
};
