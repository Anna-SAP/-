import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the client
// In a real implementation, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    input_translation: {
      type: Type.STRING,
      description: "If the input text is NOT in Simplified Chinese, provide a 'Xin Da Ya' (faithful, expressive, elegant) translation here. If it is already in Chinese, return null.",
      nullable: true
    },
    headline: { type: Type.STRING, description: "A very short, punchy, Takahashi-style headline in Simplified Chinese (max 6 chars)." },
    subheadline: { type: Type.STRING, description: "A one-sentence summary of the essence in Simplified Chinese." },
    core_concept: {
      type: Type.OBJECT,
      properties: {
        principle: { type: Type.STRING, description: "The first principle or underlying logic in Simplified Chinese." },
        explanation: { type: Type.STRING, description: "Brief explanation of the principle in Simplified Chinese." },
      },
      required: ["principle", "explanation"],
    },
    emotional_atmosphere: {
      type: Type.OBJECT,
      properties: {
        keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 emotive keywords in Simplified Chinese." },
        description: { type: Type.STRING, description: "The mood and vibe analysis in Simplified Chinese." },
      },
      required: ["keywords", "description"],
    },
    structural_analysis: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 bullet points analyzing the structure or composition in Simplified Chinese.",
    },
    metaphor: { type: Type.STRING, description: "A creative metaphor or analogy for the content in Simplified Chinese." },
    narrative_arc: { type: Type.STRING, description: "A short story or narrative interpretation in Simplified Chinese." },
    scenarios: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Scenario title in Simplified Chinese" },
          description: { type: Type.STRING, description: "Scenario description in Simplified Chinese" },
        },
        required: ["title", "description"],
      },
      description: "2 creative application scenarios or extension ideas in Simplified Chinese.",
    },
    counter_perspective: { type: Type.STRING, description: "An inverse or devil's advocate viewpoint in Simplified Chinese." },
    visual_suggestions: {
        type: Type.ARRAY,
        items: {type: Type.STRING},
        description: "3 specific prompts or ideas for visuals/illustrations based on this content in Simplified Chinese."
    }
  },
  required: [
    "headline",
    "subheadline",
    "core_concept",
    "emotional_atmosphere",
    "structural_analysis",
    "metaphor",
    "narrative_arc",
    "scenarios",
    "counter_perspective",
    "visual_suggestions"
  ],
};

export const analyzeContent = async (
  text: string,
  imageBase64: string | null,
  videoLink: string
): Promise<AnalysisResult> => {
  try {
    const modelId = "gemini-2.5-flash";
    
    const promptText = `
      You are a Master UX Designer and Philosopher. 
      Your task is to deeply interpret the user's input (Text, Image, or Video Context) using First Principles Thinking.
      
      Input Text: "${text}"
      Input Video Context: "${videoLink}"
      
      Analyze this content to uncover:
      1. The hidden structure and core concept.
      2. The emotion and atmosphere.
      3. A strong metaphor.
      4. A narrative arc.
      5. Potential creative scenarios.
      
      CRITICAL INSTRUCTION:
      The output MUST be in Simplified Chinese (简体中文).
      Even if the input is in English or any other language, you MUST interpret and output the result in Simplified Chinese.
      
      TRANSLATION INSTRUCTION:
      Check if the "Input Text" is in Simplified Chinese. 
      If it is NOT (e.g., English, Japanese, etc.), provide a high-quality translation in the 'input_translation' field following the principle of 'Xin Da Ya' (Faithfulness, Expressiveness, and Elegance).
      If the input is already Simplified Chinese, set 'input_translation' to null.

      Output ONLY valid JSON matching the schema provided.
    `;

    const parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      // Strip header if present (e.g., "data:image/png;base64,")
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming jpeg/png for simplicity in this demo context
          data: cleanBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7, // Balanced creativity
      },
    });

    if (!response.text) {
        throw new Error("No response text generated.");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};