import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });
    }

    const systemInstruction = `You are "Élégance Paris AI Concierge", a world-class luxury Parisian travel specialist, art historian, and VIP concierge.
Your role:
- Provide refined, articulate, and deeply insightful travel advice, insider secrets, gastronomic pairings, architectural history, and itinerary recommendations for Paris.
- Incorporate specific arrondissements, French etiquette tips, metro lines, peak hours to avoid crowds, and hidden gems (e.g. secret view alleys, historic cafes, artisan patisseries).
- Maintain an elegant, warm, and sophisticated tone.
- Format responses clearly using markdown headings, bullet points, and bold text.`;

    const chatHistory = Array.isArray(history)
      ? history.map((msg: { role: string; content: string }) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }))
      : [];

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error in concierge:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Concierge API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate concierge response" },
      { status: 500 }
    );
  }
}
