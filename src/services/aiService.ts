import { GoogleGenAI, Type } from "@google/genai";
import { Disc, Throw, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generatePersonalizedTip = async (disc: Disc, profile: UserProfile, maxDistance: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional disc golf coach. Provide a short, personalized 1-2 sentence tip for a player throwing a ${disc.brand} ${disc.model} (Speed: ${disc.speed}, Glide: ${disc.glide}, Turn: ${disc.turn}, Fade: ${disc.fade}). The player's max distance with this disc is ${maxDistance} ${profile.unit} and their overall power tier is ${profile.powerTier} (1=Beginner, 6=Pro).`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating tip:", error);
    return null;
  }
};

export const generateDailyTip = async (profile: UserProfile) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional disc golf coach. Provide a short daily tip (2-3 sentences) for a player with power tier ${profile.powerTier} (1=Beginner, 6=Pro). Focus on form, distance, or strategy.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating daily tip:", error);
    return null;
  }
};

export interface FieldSessionThrow {
  title: string;
  description: string;
  targetDistance: number;
}

export const generateFieldSession = async (disc: Disc, profile: UserProfile, maxDistance: number): Promise<FieldSessionThrow[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional disc golf coach. Suggest 3 specific practice throws for a field session using a ${disc.brand} ${disc.model} (Speed: ${disc.speed}, Glide: ${disc.glide}, Turn: ${disc.turn}, Fade: ${disc.fade}). The player's max distance with this disc is ${maxDistance} ${profile.unit}. Return a JSON array of objects with 'title' (string), 'description' (string), and 'targetDistance' (number).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              targetDistance: { type: Type.NUMBER },
            },
            required: ["title", "description", "targetDistance"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating field session:", error);
    return [];
  }
};

export interface BagRecommendation {
  brand: string;
  model: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  reason: string;
}

export const generateBagRecommendations = async (profile: UserProfile, discs: Disc[]): Promise<BagRecommendation[]> => {
  try {
    const bagContext = discs.map(d => `${d.brand} ${d.model} (${d.speed}, ${d.glide}, ${d.turn}, ${d.fade})`).join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional disc golf coach. Analyze this player's bag and recommend 3-5 discs to add to fill gaps. 
      Player power tier: ${profile.powerTier} (1=Beginner, 6=Pro). 
      Current bag: ${bagContext || "Empty"}.
      Return a JSON array of objects with 'brand' (string), 'model' (string), 'speed' (number), 'glide' (number), 'turn' (number), 'fade' (number), and 'reason' (string explaining why it fits their bag and power level).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING },
              model: { type: Type.STRING },
              speed: { type: Type.NUMBER },
              glide: { type: Type.NUMBER },
              turn: { type: Type.NUMBER },
              fade: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ["brand", "model", "speed", "glide", "turn", "fade", "reason"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating bag recommendations:", error);
    return [];
  }
};

export interface Tutorial {
  title: string;
  duration: string;
  category: string;
  url: string;
}

export const generateTutorials = async (powerTier: number): Promise<Tutorial[]> => {
  try {
    const level = powerTier <= 2 ? "beginner" : powerTier <= 4 ? "intermediate" : "advanced";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search YouTube for 3 highly-rated, working video tutorials for disc golf for an ${level} player (power tier ${powerTier} out of 6). Focus on form, distance, or strategy appropriate for their level. Return a JSON array of objects with 'title' (string), 'duration' (string, e.g., '12 min'), 'category' (string, e.g., 'Form', 'Distance', 'Strategy'), and 'url' (string, the full youtube URL).`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              duration: { type: Type.STRING },
              category: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ["title", "duration", "category", "url"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating tutorials:", error);
    return [];
  }
};
