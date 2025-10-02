"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Dummy doctor data
const dummyDoctors = [
  {
    name: "Anjali Sharma",
    specialization: "Cardiologist",
    experience: "12 years",
    hospital: "Green City Hospital, Delhi",
    rating: 5,
    reviews: 128,
    contact: "+91 98765 43210",
  },
  {
    name: "Rohit Verma",
    specialization: "Neurologist",
    experience: "10 years",
    hospital: "Sunrise Hospital, Mumbai",
    rating: 4,
    reviews: 98,
    contact: "+91 91234 56789",
  },
  {
    name: "Priya Singh",
    specialization: "General Physician",
    experience: "8 years",
    hospital: "City Care Clinic, Bangalore",
    rating: 5,
    reviews: 210,
    contact: "+91 99887 66554",
  },
  {
    name: "Amit Patel",
    specialization: "Dermatologist",
    experience: "9 years",
    hospital: "SkinCare Hospital, Ahmedabad",
    rating: 4,
    reviews: 75,
    contact: "+91 98765 12345",
  },
  {
    name: "Sonal Mehta",
    specialization: "Pediatrician",
    experience: "11 years",
    hospital: "Happy Kids Clinic, Pune",
    rating: 5,
    reviews: 140,
    contact: "+91 91234 87654",
  },
  {
    name: "Vikram Rao",
    specialization: "Orthopedic Surgeon",
    experience: "15 years",
    hospital: "Bone & Joint Hospital, Hyderabad",
    rating: 5,
    reviews: 178,
    contact: "+91 98765 33445",
  },
  {
    name: "Neha Kapoor",
    specialization: "Gynecologist",
    experience: "13 years",
    hospital: "Women's Care, Delhi",
    rating: 4,
    reviews: 120,
    contact: "+91 99887 11223",
  },
  {
    name: "Rahul Jain",
    specialization: "ENT Specialist",
    experience: "7 years",
    hospital: "City ENT Clinic, Jaipur",
    rating: 5,
    reviews: 90,
    contact: "+91 91234 44556",
  },
  {
    name: "Meera Iyer",
    specialization: "Ophthalmologist",
    experience: "10 years",
    hospital: "Vision Plus, Chennai",
    rating: 5,
    reviews: 110,
    contact: "+91 98765 55667",
  },
  {
    name: "Karan Malhotra",
    specialization: "Psychiatrist",
    experience: "12 years",
    hospital: "MindCare Hospital, Bangalore",
    rating: 4,
    reviews: 85,
    contact: "+91 91234 77889",
  },
];

// Function to pick a random doctor (fallback)
const getRandomDoctor = () =>
  dummyDoctors[Math.floor(Math.random() * dummyDoctors.length)];

// Function to select doctor based on user symptoms keywords
const getDoctorBySpecialization = (messageContent) => {
  const text = messageContent.toLowerCase();

  const specializationMap = [
    {
      keywords: ["heart", "cardio", "blood pressure"],
      specialization: "Cardiologist",
    },
    {
      keywords: ["brain", "headache", "neurology", "migraine"],
      specialization: "Neurologist",
    },
    {
      keywords: ["skin", "rash", "acne", "derma"],
      specialization: "Dermatologist",
    },
    {
      keywords: ["child", "pediatric", "kids"],
      specialization: "Pediatrician",
    },
    {
      keywords: ["bone", "joint", "fracture", "orthopedic"],
      specialization: "Orthopedic Surgeon",
    },
    {
      keywords: ["eye", "vision", "eye pain"],
      specialization: "Ophthalmologist",
    },
    {
      keywords: ["ear", "nose", "throat", "ENT"],
      specialization: "ENT Specialist",
    },
    {
      keywords: ["mental", "psychiatry", "depression", "anxiety"],
      specialization: "Psychiatrist",
    },
    {
      keywords: ["general", "fever", "cough", "cold"],
      specialization: "General Physician",
    },
    {
      keywords: ["women", "pregnancy", "gynecologist"],
      specialization: "Gynecologist",
    },
  ];

  for (const { keywords, specialization } of specializationMap) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        const doctor = dummyDoctors.find(
          (d) => d.specialization === specialization
        );
        if (doctor) return doctor;
      }
    }
  }

  return (
    dummyDoctors.find((d) => d.specialization === "General Physician") ||
    getRandomDoctor()
  );
};

export default function MedicalChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const endRef = useRef(null);
  const containerRef = useRef(null);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input.trim(), time: new Date() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();

      // Assign doctor based on user's input keywords
      const doctorSuggestion = getDoctorBySpecialization(userMsg.content);

      const assistantMsg = {
        role: "assistant",
        content: data?.text || "⚠️ No response.",
        time: new Date(),
        doctor: doctorSuggestion,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error contacting server.",
          time: new Date(),
          doctor: getRandomDoctor(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setShowScrollBtn(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-green-50 to-green-100 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto flex flex-col h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 font-semibold text-lg rounded-t-2xl">
          🩺 AI Medical Assistant
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          className="flex-1 p-6 overflow-y-auto space-y-5 relative"
        >
          {messages.length === 0 && (
            <div className="text-gray-500 text-center mt-20">
              💬 Describe your symptoms to begin...
            </div>
          )}

          {messages.map((m, i) => {
            const time = m.time
              ? new Date(m.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            if (m.role === "assistant") {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start space-y-2"
                >
                  <div className="bg-green-50 border border-green-200 text-gray-900 px-4 py-3 rounded-2xl shadow max-w-lg">
                    {m.content}
                    {time && (
                      <span className="text-gray-400 text-xs ml-2">{time}</span>
                    )}
                  </div>

                  {m.doctor && (
                    <div className="bg-white border border-green-300 rounded-xl px-4 py-3 shadow-md max-w-lg hover:shadow-lg hover:scale-105 transition transform">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                          {m.doctor.name[0]}
                        </div>
                        <div>
                          <div className="text-green-700 font-semibold text-md">
                            Dr. {m.doctor.name}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {m.doctor.specialization}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {m.doctor.experience} experience
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-gray-600 text-sm">
                        {m.doctor.hospital}
                      </div>
                      <div className="mt-1 flex items-center text-yellow-500 space-x-1 text-sm">
                        {Array.from({ length: m.doctor.rating }, (_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                        <span className="text-gray-500 ml-2">
                          ({m.doctor.reviews} reviews)
                        </span>
                      </div>
                      <div className="mt-2 text-green-600 text-sm font-medium">
                        Contact: {m.doctor.contact}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end flex-col items-end space-y-1"
              >
                <div className="bg-green-600 text-white px-4 py-3 rounded-2xl shadow max-w-lg">
                  {m.content}
                  {time && (
                    <span className="text-gray-200 text-xs ml-2">{time}</span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-gray-400 italic">
              <span>Assistant is typing</span>
              <span className="animate-pulse">...</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() =>
              endRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute bottom-24 right-6 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
            title="Scroll to latest"
          >
            ⬇️
          </button>
        )}

        {/* Input form */}
        <form
          onSubmit={sendMessage}
          className="flex p-4 border-t border-gray-200 bg-green-50 rounded-b-2xl"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms..."
            className="flex-1 px-4 py-2 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-3 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}
