"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("🤖 Bot is thinking...");
  const chatEndRef = useRef(null);

  const loadingPhrases = [
    "💡 Searching for advice...",
    "🤖 Bot is thinking...",
    "⌛ Analyzing your symptoms...",
    "🩺 Preparing recommendations...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        setLoadingText(loadingPhrases[index % loadingPhrases.length]);
        index++;
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingText]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };
    const botLoadingMessage = { role: "bot", text: loadingText, time: "" };

    setMessages((prev) => [...prev, userMessage, botLoadingMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "bot",
          text: data.reply || "❌ Failed to get response.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "bot",
          text: "❌ Failed to get response.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-6">
        <div className="w-full h-full flex flex-col bg-white shadow-2xl rounded-2xl">
          <div className="p-4 md:p-6 border-b border-gray-200 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700">
              🧑‍⚕️ MediMeet
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const isDoctor = (msg.text || "").includes("💡 Suggested Doctor");

              return (
                <div
                  key={i}
                  className={`mb-3 flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 md:px-4 py-2 rounded-2xl shadow-md whitespace-pre-wrap max-w-[75%] md:max-w-[70%] ${
                      isUser
                        ? "bg-blue-500 text-white"
                        : isDoctor
                        ? "bg-green-100 text-green-900 border-l-4 border-green-400"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>
                      {msg.role === "bot" && msg.text === loadingText
                        ? loadingText
                        : msg.text}
                    </p>
                    {msg.time && (
                      <span className="text-xs text-gray-500 mt-1 block text-right">
                        {msg.time}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef}></div>
          </div>

          <div className="p-3 md:p-4 border-t border-gray-200 flex items-center gap-2 md:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about health..."
              className="flex-1 border border-gray-300 rounded-full px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className={`bg-blue-600 text-white px-4 md:px-5 py-2 rounded-full shadow-md hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Typing..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
