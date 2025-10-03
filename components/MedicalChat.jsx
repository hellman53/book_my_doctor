"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  User, 
  Bot, 
  Stethoscope, 
  Star, 
  MapPin, 
  Phone, 
  Clock,
  ChevronDown,
  X,
  Minimize,
  Maximize,
  MessageCircle
} from "lucide-react";

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
    availability: "Available Today",
    consultationFee: "₹800",
  },
  {
    name: "Rohit Verma",
    specialization: "Neurologist",
    experience: "10 years",
    hospital: "Sunrise Hospital, Mumbai",
    rating: 4,
    reviews: 98,
    contact: "+91 91234 56789",
    availability: "Available Tomorrow",
    consultationFee: "₹1200",
  },
  {
    name: "Priya Singh",
    specialization: "General Physician",
    experience: "8 years",
    hospital: "City Care Clinic, Bangalore",
    rating: 5,
    reviews: 210,
    contact: "+91 99887 66554",
    availability: "Available Today",
    consultationFee: "₹500",
  },
  {
    name: "Amit Patel",
    specialization: "Dermatologist",
    experience: "9 years",
    hospital: "SkinCare Hospital, Ahmedabad",
    rating: 4,
    reviews: 75,
    contact: "+91 98765 12345",
    availability: "Available Today",
    consultationFee: "₹700",
  },
  {
    name: "Sonal Mehta",
    specialization: "Pediatrician",
    experience: "11 years",
    hospital: "Happy Kids Clinic, Pune",
    rating: 5,
    reviews: 140,
    contact: "+91 91234 87654",
    availability: "Available Tomorrow",
    consultationFee: "₹600",
  },
  {
    name: "Vikram Rao",
    specialization: "Orthopedic Surgeon",
    experience: "15 years",
    hospital: "Bone & Joint Hospital, Hyderabad",
    rating: 5,
    reviews: 178,
    contact: "+91 98765 33445",
    availability: "Available Today",
    consultationFee: "₹1500",
  },
  {
    name: "Neha Kapoor",
    specialization: "Gynecologist",
    experience: "13 years",
    hospital: "Women's Care, Delhi",
    rating: 4,
    reviews: 120,
    contact: "+91 99887 11223",
    availability: "Available Today",
    consultationFee: "₹900",
  },
  {
    name: "Rahul Jain",
    specialization: "ENT Specialist",
    experience: "7 years",
    hospital: "City ENT Clinic, Jaipur",
    rating: 5,
    reviews: 90,
    contact: "+91 91234 44556",
    availability: "Available Tomorrow",
    consultationFee: "₹550",
  },
  {
    name: "Meera Iyer",
    specialization: "Ophthalmologist",
    experience: "10 years",
    hospital: "Vision Plus, Chennai",
    rating: 5,
    reviews: 110,
    contact: "+91 98765 55667",
    availability: "Available Today",
    consultationFee: "₹750",
  },
  {
    name: "Karan Malhotra",
    specialization: "Psychiatrist",
    experience: "12 years",
    hospital: "MindCare Hospital, Bangalore",
    rating: 4,
    reviews: 85,
    contact: "+91 91234 77889",
    availability: "Available Tomorrow",
    consultationFee: "₹1100",
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
      keywords: ["heart", "cardio", "blood pressure", "chest pain"],
      specialization: "Cardiologist",
    },
    {
      keywords: ["brain", "headache", "neurology", "migraine", "seizure"],
      specialization: "Neurologist",
    },
    {
      keywords: ["skin", "rash", "acne", "derma", "allergy"],
      specialization: "Dermatologist",
    },
    {
      keywords: ["child", "pediatric", "kids", "baby", "infant"],
      specialization: "Pediatrician",
    },
    {
      keywords: ["bone", "joint", "fracture", "orthopedic", "back pain"],
      specialization: "Orthopedic Surgeon",
    },
    {
      keywords: ["eye", "vision", "eye pain", "blur", "cataract"],
      specialization: "Ophthalmologist",
    },
    {
      keywords: ["ear", "nose", "throat", "ENT", "sinus"],
      specialization: "ENT Specialist",
    },
    {
      keywords: ["mental", "psychiatry", "depression", "anxiety", "stress"],
      specialization: "Psychiatrist",
    },
    {
      keywords: ["general", "fever", "cough", "cold", "viral"],
      specialization: "General Physician",
    },
    {
      keywords: ["women", "pregnancy", "gynecologist", "period", "pcos"],
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
  const [isFullScreen, setIsFullScreen] = useState(true);
  const endRef = useRef(null);
  const containerRef = useRef(null);

  // Welcome message
  useEffect(() => {
    const welcomeMessage = {
      role: "assistant",
      content: "Hello! I'm your AI medical assistant. Please describe your symptoms, and I'll help connect you with the right specialist.",
      time: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
      role: "user", 
      content: input.trim(), 
      time: new Date() 
    };
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
        content: data?.text || "I understand your concerns. Based on your symptoms, here's a specialist who can help you:",
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
          content: "I apologize, but I'm having trouble processing your request. Here's a doctor who might be able to help:",
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
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      setShowScrollBtn(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const quickReplies = [
    "I have fever and cough",
    "Headache and dizziness",
    "Skin rash and itching",
    "Chest pain and breathing difficulty",
    "Stomach pain and nausea"
  ];

  return (
    <div className={`${isFullScreen ? 'fixed inset-0' : 'h-screen'} bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${isFullScreen ? 'h-full' : 'h-full max-w-6xl mx-auto'} flex flex-col bg-white/90 backdrop-blur-lg shadow-2xl relative`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Medical Assistant</h1>
              <p className="text-emerald-100 text-sm">Powered by Healthcare AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={isFullScreen ? "Minimize" : "Maximize"}
            >
              {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={containerRef}
          className="flex-1 p-6 overflow-y-auto space-y-6 relative bg-gradient-to-b from-white to-gray-50/50"
        >
          <AnimatePresence>
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-3 shadow-lg max-w-2xl">
                        <p className="text-gray-800 leading-relaxed">{m.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-emerald-600 font-medium">AI Assistant</span>
                          <span className="text-xs text-gray-400">{time}</span>
                        </div>
                      </div>

                      {m.doctor && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-lg max-w-2xl hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                  {m.doctor.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  Dr. {m.doctor.name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    {m.doctor.specialization}
                                  </span>
                                  <span className="flex items-center text-xs text-gray-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {m.doctor.experience}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-600">
                                {m.doctor.consultationFee}
                              </div>
                              <div className="text-xs text-gray-500">Consultation</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-emerald-500" />
                                  {m.doctor.hospital}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1 text-emerald-500" />
                                  {m.doctor.contact}
                                </div>
                              </div>
                              
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                {m.doctor.availability}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < m.doctor.rating 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-2">
                                  ({m.doctor.reviews} reviews)
                                </span>
                              </div>
                              
                              <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Book Appointment
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex justify-end space-x-3"
                >
                  <div className="flex-1 max-w-2xl">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl px-4 py-3 shadow-lg">
                      <p className="leading-relaxed">{m.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-emerald-100">You</span>
                        <span className="text-xs text-emerald-200">{time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex space-x-3"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-3"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {quickReplies.map((reply, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInput(reply)}
                  className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-50 transition-all duration-200 shadow-sm"
                >
                  {reply}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToBottom}
              className="absolute bottom-24 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Scroll to latest"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
          className="p-6 bg-white border-t border-gray-200/60"
        >
          <div className="flex space-x-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms or health concerns..."
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </motion.button>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              Your conversations are private and secure. For emergencies, please contact local emergency services.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}