import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const getGeminiClient = () => {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables. Falling back to simulated multimodal intelligence.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};
