import { GoogleGenerativeAI } from "@google/generative-ai";

const dummyDoctors = [
  { name: "Dr. Ayesha Khan", specialty: "General Physician", contact: "9876543210" },
  { name: "Dr. Rajesh Singh", specialty: "Cardiologist", contact: "9123456780" },
  { name: "Dr. Meera Joshi", specialty: "Dermatologist", contact: "9988776655" },
  { name: "Dr. Vivek Sharma", specialty: "Neurologist", contact: "9112233445" },
];

export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    if (!message) {
      return new Response(JSON.stringify({ error: "Message required" }), { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY missing!");
      return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Use a valid model, e.g., gemini-1.5
    let advice;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
      const result = await model.generateContent(message);
      advice = result?.response?.text?.() || "Sorry, I could not generate advice.";
    } catch (error) {
      console.error("Gemini API failed, using fallback:", error);
      advice = "🤖 Sorry, I could not fetch AI advice at the moment. Here's some general guidance.";
    }

    // Suggest a random doctor
    const suggestedDoctor = dummyDoctors[Math.floor(Math.random() * dummyDoctors.length)];

    const reply = `${advice}\n\n💡 Suggested Doctor:\nName: ${suggestedDoctor.name}\nSpecialty: ${suggestedDoctor.specialty}\nContact: ${suggestedDoctor.contact}`;

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong!" }), { status: 500 });
  }
}
