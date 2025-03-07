
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

    default:
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
  }
  
  // Extract the content from the response
  const content = result.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error(`No content returned from the AI provider`);
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
      throw new Error("Invalid mindmap data format");
    }

    return mindmapData;
  } catch (parseError) {
    console.error("JSON parsing error:", parseError);
    console.log("Raw content:", content);
    throw new Error("Failed to parse AI response as valid JSON");
  }
}
