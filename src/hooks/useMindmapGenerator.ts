
import { useState } from "react";
import { AIProvider } from "@/types/aiProviders";
import { callAIProvider, parseAIResponse } from "@/utils/aiProviderApi";
import { calculatePositionsForMindmap } from "@/utils/layoutUtils";
import { toast } from "sonner";

export function useMindmapGenerator(
  onGenerate: (nodes: any[], edges: any[]) => void,
  onClose: () => void
) {
  const [loading, setLoading] = useState(false);
  
  const generateMindmap = async (
    topic: string,
    additionalContext: string,
    aiProvider: AIProvider,
    serverUrl: string,
    selectedModel: string,
    apiKey: string
  ) => {
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
      
      const prompt = `Create a mindmap about "${topic}". ${additionalContext ? `Additional context: ${additionalContext}` : ""}
      
Return valid JSON matching this structure:
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
      "id": "edge-1",
      "source": "chapter-1",
      "target": "main-topic-1",
      "animated": true
    }
  ]
}

Include:
- 1 chapter node as the main topic
- 2-4 main-topic nodes for key subtopics
- 3-6 sub-topic nodes for details

Use simple, short labels and content for each node.`;

      const content = await callAIProvider({
        aiProvider,
        serverUrl,
        selectedModel,
        apiKey,
        prompt
      });
      
      let mindmapData;
      try {
        mindmapData = parseAIResponse(content);
        
        // Validate the structure
        if (!mindmapData.nodes || !Array.isArray(mindmapData.nodes) || 
            !mindmapData.edges || !Array.isArray(mindmapData.edges)) {
          throw new Error("Invalid mindmap structure");
        }
        
        // Calculate positions for the nodes
        const positionedNodes = calculatePositionsForMindmap(mindmapData.nodes);
        
        // Apply the generated mindmap
        onGenerate(positionedNodes, mindmapData.edges);
        toast.success("Mindmap generated successfully!");
        onClose();
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        console.error("Raw response:", content);
        toast.error("Failed to parse AI response. Try again or use simpler prompt.");
      }
      
    } catch (error: any) {
      console.error("Error generating mindmap:", error);
      toast.error(`Failed to generate mindmap: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateMindmap
  };
}
