import { GoogleGenAI } from "@google/genai";
import { getAuth } from "@clerk/nextjs/server";

const ai = new GoogleGenAI({});

const SYSTEM_PROMPT = `
You are a medical assistant chatbot.
Rules:
- Give very short, practical suggestions (2–4 sentences max).
- Do NOT provide definitive diagnosis.
- Do NOT include any doctor recommendation or consultation suggestion in the response.
`;

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages must be a non-empty array" }),
        { status: 400 }
      );
    }

    // Format conversation text for prompt
    const convoText = messages
      .map(m => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n\n");

    const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${convoText}\n\nAssistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const reply = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "⚠️ No response.";

    return new Response(JSON.stringify({ text: reply }), { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}