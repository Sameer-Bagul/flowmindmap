
import { AIProvider } from "@/types/aiProviders";
import { AI_PROVIDERS } from "@/constants/aiProviders";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIProviderFormProps {
  aiProvider: AIProvider;
  serverUrl: string;
  selectedModel: string;
  apiKey: string;
  onAIProviderChange: (value: AIProvider) => void;
  onServerUrlChange: (value: string) => void;
  onSelectedModelChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
}

export const AIProviderForm: React.FC<AIProviderFormProps> = ({
  aiProvider,
  serverUrl,
  selectedModel,
  apiKey,
  onAIProviderChange,
  onServerUrlChange,
  onSelectedModelChange,
  onApiKeyChange
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="ai-provider">AI Provider</Label>
        <Select value={aiProvider} onValueChange={(value: AIProvider) => onAIProviderChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select AI provider" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  {provider.icon}
                  {provider.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="server-url">Server URL</Label>
        <Input
          id="server-url"
          placeholder={AI_PROVIDERS[aiProvider].defaultUrl}
          value={serverUrl}
          onChange={(e) => onServerUrlChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {aiProvider === 'lmstudio' && "Make sure LM Studio is running with API server enabled"}
          {aiProvider === 'ollama' && "Make sure Ollama is running locally"}
          {(aiProvider === 'gemini' || aiProvider === 'grok') && "API endpoint for cloud service"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="model">Model</Label>
        <Select value={selectedModel} onValueChange={onSelectedModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {AI_PROVIDERS[aiProvider].modelOptions.map(model => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(aiProvider === 'gemini' || aiProvider === 'grok') && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Required for {AI_PROVIDERS[aiProvider].label} API
          </p>
        </div>
      )}
    </>
  );
};
