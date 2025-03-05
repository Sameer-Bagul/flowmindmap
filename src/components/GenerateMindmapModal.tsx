
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
import { Loader2, Sparkles } from "lucide-react";
import { AIProviderForm } from "./mindmap/AIProviderForm";
import { TopicForm } from "./mindmap/TopicForm";
import { useAIProviderForm } from "@/hooks/useAIProviderForm";
import { useMindmapGenerator } from "@/hooks/useMindmapGenerator";

interface GenerateMindmapModalProps {
  onGenerate: (nodes: any[], edges: any[]) => void;
}

export const GenerateMindmapModal: React.FC<GenerateMindmapModalProps> = ({ onGenerate }) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  
  const { 
    aiProvider, 
    formState, 
    handleAIProviderChange,
    updateFormField
  } = useAIProviderForm();

  const {
    loading,
    generateMindmap
  } = useMindmapGenerator(onGenerate, () => {
    setOpen(false);
    setTopic("");
    setAdditionalContext("");
  });

  const handleGenerate = () => {
    generateMindmap(
      topic,
      additionalContext,
      aiProvider,
      formState.serverUrl,
      formState.selectedModel,
      formState.apiKey
    );
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
          <AIProviderForm
            aiProvider={aiProvider}
            serverUrl={formState.serverUrl}
            selectedModel={formState.selectedModel}
            apiKey={formState.apiKey}
            onAIProviderChange={handleAIProviderChange}
            onServerUrlChange={(value) => updateFormField('serverUrl', value)}
            onSelectedModelChange={(value) => updateFormField('selectedModel', value)}
            onApiKeyChange={(value) => updateFormField('apiKey', value)}
          />
          
          <TopicForm
            topic={topic}
            additionalContext={additionalContext}
            onTopicChange={setTopic}
            onAdditionalContextChange={setAdditionalContext}
          />
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
