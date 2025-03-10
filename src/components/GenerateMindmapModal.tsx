
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
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { calculatePositionsForMindmap } from "@/utils/layoutUtils";

interface GenerateMindmapModalProps {
  onGenerate: (nodes: any[], edges: any[]) => void;
}

export const GenerateMindmapModal: React.FC<GenerateMindmapModalProps> = ({ onGenerate }) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [serverUrl, setServerUrl] = useState("http://192.168.1.8:1234");
  const [loading, setLoading] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!serverUrl.trim()) {
      toast.error("Please enter the LM Studio server URL");
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

      const response = await fetch(serverUrl + "/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-qwen-7b",
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

      const result = await response.json();
      
      // Extract the content from the response
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("No content returned from LM Studio");
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
            Enter a topic to generate a complete mindmap structure using a local LLM.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="server">LM Studio Server URL</Label>
            <Input
              id="server"
              placeholder="http://localhost:1234"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Make sure LM Studio is running with API server enabled
            </p>
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
