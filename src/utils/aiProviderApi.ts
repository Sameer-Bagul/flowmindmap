
"use client";

import { AIProvider } from "@/types/aiProviders";
import { toast } from "sonner";

type AIRequestParams = {
  aiProvider: AIProvider;
  serverUrl: string;
  selectedModel: string;
  apiKey: string;
  prompt: string;
};

export async function callAIProvider({
  aiProvider,
  serverUrl,
  selectedModel,
  apiKey,
  prompt
}: AIRequestParams) {
  // Validate inputs
  if (!serverUrl || !serverUrl.trim()) {
    throw new Error("Server URL is required");
  }
  
  if (!selectedModel || !selectedModel.trim()) {
    throw new Error("Model selection is required");
  }
  
  // For providers that require API keys
  if ((aiProvider === 'gemini' || aiProvider === 'grok') && (!apiKey || !apiKey.trim())) {
    throw new Error(`API key is required for ${aiProvider === 'gemini' ? 'Gemini' : 'Grok'}`);
  }
  
  let response;
  let result;

  try {
    // Clean the URL (remove trailing slashes)
    const cleanServerUrl = serverUrl.trim().replace(/\/+$/, "");
    
    switch (aiProvider) {
      case 'lmstudio':
        response = await fetch(cleanServerUrl + "/v1/chat/completions", {
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
          throw new Error(`Error connecting to LM Studio: ${response.status} ${response.statusText}`);
        }
        
        result = await response.json();
        break;

      case 'ollama':
        response = await fetch(cleanServerUrl + "/api/chat", {
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
          throw new Error(`Error connecting to Ollama: ${response.status} ${response.statusText}`);
        }
        
        result = await response.json();
        break;

      case 'gemini':
        response = await fetch(`${cleanServerUrl}/v1beta/models/${selectedModel}:generateContent`, {
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
          throw new Error(`Error connecting to Gemini API: ${response.status} ${response.statusText}`);
        }
        
        const geminiResult = await response.json();
        
        // Check for error responses from Gemini
        if (geminiResult.error) {
          throw new Error(`Gemini API error: ${geminiResult.error.message || JSON.stringify(geminiResult.error)}`);
        }
        
        // Ensure we have valid content
        if (!geminiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("Invalid response format from Gemini API");
        }
        
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
        response = await fetch(`${cleanServerUrl}/v1/chat/completions`, {
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
          throw new Error(`Error connecting to Grok API: ${response.status} ${response.statusText}`);
        }
        
        result = await response.json();
        break;

      default:
        throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }
  } catch (error: any) {
    console.error(`Error calling ${aiProvider} API:`, error);
    // Add more context to network errors
    if (error.message?.includes('Failed to fetch')) {
      throw new Error(`Network error connecting to ${aiProvider}. Please check your connection and server URL.`);
    }
    throw error;
  }
  
  // Extract the content from the response
  const content = result.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error(`No content returned from the ${aiProvider} provider`);
  }

  return content;
}

export function parseAIResponse(content: string) {
  // Extract the JSON from the content (it might be wrapped in markdown code blocks)
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                    content.match(/```\n([\s\S]*?)\n```/) || 
                    content.match(/{[\s\S]*}/);
  
  const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
  
  try {
    // Parse the JSON
    const mindmapData = JSON.parse(jsonString.replace(/```/g, '').trim());
    
    if (!mindmapData.nodes || !mindmapData.edges) {
      throw new Error("Invalid mindmap data format - missing nodes or edges");
    }

    return mindmapData;
  } catch (parseError) {
    console.error("JSON parsing error:", parseError);
    console.log("Raw content:", content);
    throw new Error("Failed to parse AI response as valid JSON. The AI may have returned an incorrect format.");
  }
}
