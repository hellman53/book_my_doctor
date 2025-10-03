"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const getRandomDoctor = () =>
  dummyDoctors[Math.floor(Math.random() * dummyDoctors.length)];

const getDoctorBySpecialization = (messageContent) => {
  const text = messageContent.toLowerCase();
  const map = [
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
  for (const { keywords, specialization } of map) {
    for (const kw of keywords)
      if (text.includes(kw))
        return (
          dummyDoctors.find((d) => d.specialization === specialization) ||
          getRandomDoctor()
        );
  }
  return (
    dummyDoctors.find((d) => d.specialization === "General Physician") ||
    getRandomDoctor()
  );
};

const quickSymptoms = [
  "Fever",
  "Headache",
  "Skin Rash",
  "Joint Pain",
  "Eye Pain",
  "Pregnancy",
];

export default function MedicalChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      const doctor = getDoctorBySpecialization(userMsg.content);
      const assistantMsg = {
        role: "assistant",
        content: data?.text || "⚠️ No response.",
        time: new Date(),
        doctor,
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-16 flex justify-center">
      <motion.div className="w-full mt-15 flex flex-col h-[80vh] sm:h-[85vh] md:h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="bg-green-600 text-white px-6 py-4 font-semibold text-lg sm:text-xl rounded-t-2xl text-center">
          🩺 AI Medical Assistant
        </div>

        <div className="flex-1 p-4 sm:p-6 space-y-4 relative overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-gray-500 text-center mt-20 text-sm sm:text-base">
              💬 Describe your symptoms to begin...
            </div>
          )}

          <AnimatePresence>
            {messages.map((m, i) => {
              const time = m.time
                ? new Date(m.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              if (m.role === "assistant")
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex flex-col items-start space-y-2"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-gray-900 px-4 py-3 rounded-2xl shadow max-w-full sm:max-w-md break-words">
                      {m.content}{" "}
                      {time && (
                        <span className="text-gray-400 text-xs ml-2">
                          {time}
                        </span>
                      )}
                    </div>
                    {m.doctor && (
                      <motion.div
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                        className="bg-white border border-green-300 rounded-xl px-4 py-3 shadow-md max-w-full sm:max-w-md transition transform break-words"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                            {m.doctor.name[0]}
                          </div>
                          <div>
                            <div className="text-green-700 font-semibold text-md sm:text-lg">
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
                        <div className="mt-2 text-gray-600 text-sm sm:text-base">
                          {m.doctor.hospital}
                        </div>
                        <div className="mt-1 flex items-center text-yellow-500 space-x-1 text-sm sm:text-base">
                          {Array.from({ length: m.doctor.rating }, (_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                          <span className="text-gray-500 ml-2">
                            ({m.doctor.reviews} reviews)
                          </span>
                        </div>
                        <div className="mt-2 text-green-600 text-sm sm:text-base font-medium">
                          Contact: {m.doctor.contact}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-end flex-col items-end space-y-1"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-2xl shadow max-w-full sm:max-w-md break-words">
                    {m.content}{" "}
                    {time && (
                      <span className="text-gray-200 text-xs ml-2">{time}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-gray-400 italic text-sm sm:text-base"
            >
              <span>Assistant is typing</span>
              <span className="animate-pulse">⠋⠙⠹</span>
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 p-2 sm:p-4 border-t border-gray-200 bg-green-50">
          {quickSymptoms.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(s);
                sendMessage();
              }}
              className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-300 transition"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex p-3 sm:p-4 border-t border-gray-200 bg-green-50"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms..."
            className="flex-1 px-4 py-2 sm:py-3 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-3 px-4 sm:px-5 py-2 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-sm sm:text-base"
          >
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}
