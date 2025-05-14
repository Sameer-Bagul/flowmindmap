
import { useState } from 'react';
import { callAIProvider, parseAIResponse } from "@/utils/aiProviderApi";
import { AIProvider } from "@/types/aiProviders";
import { toast } from "sonner";

export function useMindmapGenerator(
  onGenerate: (nodes: any[], edges: any[]) => void, 
  onComplete?: () => void
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
      toast.error("Please enter a topic for your mindmap");
      return;
    }

    setLoading(true);
    
    // Construct the prompt for the AI
    const contextPart = additionalContext ? 
      `\n\nAdditional context: ${additionalContext}` : '';
    
    const prompt = `Create a detailed mindmap about "${topic}".${contextPart}

    Return ONLY valid JSON with this exact structure:
    {
      "nodes": [
        {
          "id": "node-1", // unique ID for each node
          "type": "textNode", // keep this as "textNode" for all nodes
          "data": {
            "title": "Main Topic", // short title
            "content": "Extended description or notes can go here" // optional detailed content
          },
          "position": { "x": 0, "y": 0 } // will be adjusted by layout
        },
        // more nodes...
      ],
      "edges": [
        {
          "id": "edge-1-2", // unique ID for each edge
          "source": "node-1", // ID of source node
          "target": "node-2" // ID of target node
        },
        // more edges...
      ]
    }`;

    try {
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

      // Pass the generated mindmap data to the callback
      onGenerate(mindmapData.nodes, mindmapData.edges);
      toast.success("Mindmap generated successfully");
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      toast.error(`Failed to generate mindmap: ${error.message}`);
      console.error("Error generating mindmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, generateMindmap };
}
