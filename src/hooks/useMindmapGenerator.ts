
import { useState } from "react";
import { AIProvider } from "@/types/aiProviders";
import { callAIProvider, parseAIResponse } from "@/utils/aiProviderApi";
import { calculatePositionsForMindmap } from "@/utils/layoutUtils";
import { toast } from "sonner";
import { AI_PROVIDERS } from "@/constants/aiProviders";

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

      // Call the AI provider
      const content = await callAIProvider({
        aiProvider,
        serverUrl,
        selectedModel,
        apiKey,
        prompt
      });
      
      // Parse the response
      const mindmapData = parseAIResponse(content);
      
      // Calculate positions for the nodes
      const positionedNodes = calculatePositionsForMindmap(mindmapData.nodes);
      
      // Apply the generated mindmap
      onGenerate(positionedNodes, mindmapData.edges);
      toast.success("Mindmap generated successfully!");
      onClose();
      
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
