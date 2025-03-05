
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Bot, Cloud, Server } from "lucide-react";
import { toast } from "sonner";
import { calculatePositionsForMindmap } from "@/utils/layoutUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerateMindmapModalProps {
  onGenerate: (nodes: any[], edges: any[]) => void;
}

type AIProvider = 'lmstudio' | 'ollama' | 'gemini' | 'grok';

interface AIProviderConfig {
  label: string;
  icon: React.ReactNode;
  defaultUrl: string;
  modelOptions: Array<{value: string, label: string}>;
}

export const GenerateMindmapModal: React.FC<GenerateMindmapModalProps> = ({ onGenerate }) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  
  // AI provider state
  const [aiProvider, setAIProvider] = useState<AIProvider>('lmstudio');
  const [serverUrl, setServerUrl] = useState("http://192.168.1.8:1234");
  const [selectedModel, setSelectedModel] = useState("deepseek-r1-distill-qwen-7b");
  const [apiKey, setApiKey] = useState("");

  const aiProviders: Record<AIProvider, AIProviderConfig> = {
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

  const handleAIProviderChange = (value: AIProvider) => {
    setAIProvider(value);
    setServerUrl(aiProviders[value].defaultUrl);
    setSelectedModel(aiProviders[value].modelOptions[0].value);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!serverUrl.trim()) {
      toast.error("Please enter the server URL");
      return;
    }

    try {
      setLoading(true);
      
      const prompt = `Create a comprehensive and structured mindmap about "${topic}". ${additionalContext ? `Additional context: ${additionalContext}` : ""}
      
The response should be valid JSON matching this structure:
{
  "nodes": [
    {
      "id": "chapter-1", 
      "type": "chapter", 
      "data": {"label": "Main Topic", "type": "chapter", "content": "Main topic description"}
    },
    {
      "id": "main-topic-1",
      "type": "main-topic",
      "data": {"label": "Subtopic 1", "type": "main-topic", "content": "Description of subtopic 1"}
    }
  ],
  "edges": [
    {
      "id": "edge-1-2",
      "source": "chapter-1",
      "target": "main-topic-1",
      "animated": true
    }
  ]
}

IMPORTANT: Do not include position information in the nodes, as the layout will be calculated automatically.

The mindmap should include:
- 1 chapter node as the main topic
- 4-6 main-topic nodes for key subtopics
- 6-12 sub-topic nodes for details

Ensure each node has a meaningful label and content. Create logical connections between nodes that form a coherent knowledge structure.`;

      let response;
      let result;

      switch (aiProvider) {
        case 'lmstudio':
          response = await fetch(serverUrl + "/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: [
                {
                  role: "system",
                  content: "You are a helpful AI assistant that creates detailed mindmaps in JSON format."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 4000
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Error connecting to LM Studio: ${response.statusText}`);
          }
          
          result = await response.json();
          break;

        case 'ollama':
          response = await fetch(serverUrl + "/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: [
                {
                  role: "system",
                  content: "You are a helpful AI assistant that creates detailed mindmaps in JSON format."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 4000
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Error connecting to Ollama: ${response.statusText}`);
          }
          
          result = await response.json();
          break;

        case 'gemini':
          if (!apiKey) {
            throw new Error("API key is required for Gemini");
          }
          
          response = await fetch(`${serverUrl}/v1beta/models/${selectedModel}:generateContent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `You are a helpful AI assistant that creates detailed mindmaps in JSON format. ${prompt}`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000
              }
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Error connecting to Gemini API: ${response.statusText}`);
          }
          
          const geminiResult = await response.json();
          result = {
            choices: [
              {
                message: {
                  content: geminiResult.candidates[0].content.parts[0].text
                }
              }
            ]
          };
          break;

        case 'grok':
          if (!apiKey) {
            throw new Error("API key is required for Grok API");
          }
          
          response = await fetch(`${serverUrl}/v1/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: [
                {
                  role: "system",
                  content: "You are a helpful AI assistant that creates detailed mindmaps in JSON format."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 4000
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Error connecting to Grok API: ${response.statusText}`);
          }
          
          result = await response.json();
          break;
      }
      
      // Extract the content from the response
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error(`No content returned from ${aiProviders[aiProvider].label}`);
      }

      // Extract the JSON from the content (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                         content.match(/```\n([\s\S]*?)\n```/) || 
                         content.match(/{[\s\S]*}/);
      
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      
      try {
        // Parse the JSON
        const mindmapData = JSON.parse(jsonString.replace(/```/g, '').trim());
        
        if (!mindmapData.nodes || !mindmapData.edges) {
          throw new Error("Invalid mindmap data format");
        }

        // Calculate positions for the nodes
        const positionedNodes = calculatePositionsForMindmap(mindmapData.nodes);
        
        // Apply the generated mindmap
        onGenerate(positionedNodes, mindmapData.edges);
        toast.success("Mindmap generated successfully!");
        setOpen(false);
        setTopic("");
        setAdditionalContext("");
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.log("Raw content:", content);
        throw new Error("Failed to parse LLM response as valid JSON");
      }
    } catch (error: any) {
      console.error("Error generating mindmap:", error);
      toast.error(`Failed to generate mindmap: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 justify-start" onClick={() => setOpen(true)}>
          <Sparkles className="h-4 w-4" />
          Generate Mindmap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Mindmap with AI</DialogTitle>
          <DialogDescription>
            Enter a topic to generate a complete mindmap structure using AI.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ai-provider">AI Provider</Label>
            <Select value={aiProvider} onValueChange={(value: AIProvider) => handleAIProviderChange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(aiProviders).map(([key, provider]) => (
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
              placeholder={aiProviders[aiProvider].defaultUrl}
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {aiProvider === 'lmstudio' && "Make sure LM Studio is running with API server enabled"}
              {aiProvider === 'ollama' && "Make sure Ollama is running locally"}
              {(aiProvider === 'gemini' || aiProvider === 'grok') && "API endpoint for cloud service"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="model">Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {aiProviders[aiProvider].modelOptions.map(model => (
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
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Required for {aiProviders[aiProvider].label} API
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Machine Learning, History of Rome, Climate Change"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="context">Additional Context (optional)</Label>
            <Textarea
              id="context"
              placeholder="Add any specific requirements or focus areas"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
