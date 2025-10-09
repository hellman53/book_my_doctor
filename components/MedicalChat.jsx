"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  saveUserMessage,
  getUserChatHistory,
  subscribeToChat,
  initializeUserChat,
  getChatSessions,
  createNewChatSession,
} from "@/lib/firebase-chat";
import {
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
  Send,
  MessageSquare,
  Plus,
  Calendar,
  Clock as ClockIcon,
  Trash2,
  MoreVertical,
} from "lucide-react";

// Dummy doctor data (unchanged)
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
    specialization: "Dermatologist",
    experience: "8 years",
    hospital: "Skin Care Center, Bangalore",
    rating: 5,
    reviews: 156,
    contact: "+91 94567 89012",
    availability: "Available Today",
    consultationFee: "₹600",
  },
  {
    name: "Amit Patel",
    specialization: "Orthopedist",
    experience: "15 years",
    hospital: "Bone & Joint Clinic, Chennai",
    rating: 4,
    reviews: 203,
    contact: "+91 97865 43210",
    availability: "Available Tomorrow",
    consultationFee: "₹1000",
  },
  {
    name: "Neha Gupta",
    specialization: "Pediatrician",
    experience: "9 years",
    hospital: "Kids Care Hospital, Hyderabad",
    rating: 5,
    reviews: 187,
    contact: "+91 93456 78901",
    availability: "Available Today",
    consultationFee: "₹500",
  },
  {
    name: "Rajesh Kumar",
    specialization: "General Physician",
    experience: "11 years",
    hospital: "City Health Clinic, Kolkata",
    rating: 4,
    reviews: 142,
    contact: "+91 96789 01234",
    availability: "Available Today",
    consultationFee: "₹400",
  },
];

const getRandomDoctor = () =>
  dummyDoctors[Math.floor(Math.random() * dummyDoctors.length)];

const getDoctorBySpecialization = (messageContent) => {
  const text = messageContent.toLowerCase();
  const map = [
    {
      keywords: [
        "heart",
        "cardio",
        "blood pressure",
        "chest pain",
        "palpitations",
      ],
      specialization: "Cardiologist",
    },
    {
      keywords: [
        "brain",
        "headache",
        "neurology",
        "migraine",
        "seizure",
        "dizziness",
      ],
      specialization: "Neurologist",
    },
    {
      keywords: ["skin", "rash", "acne", "dermatology", "itching", "allergy"],
      specialization: "Dermatologist",
    },
    {
      keywords: [
        "bone",
        "joint",
        "fracture",
        "ortho",
        "back pain",
        "arthritis",
      ],
      specialization: "Orthopedist",
    },
    {
      keywords: ["child", "pediatric", "baby", "kids", "children", "infant"],
      specialization: "Pediatrician",
    },
    {
      keywords: ["fever", "cold", "cough", "general", "health", "symptoms"],
      specialization: "General Physician",
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

// Quick Replies Array
const quickReplies = [
  "I have fever and cough",
  "Headache and dizziness",
  "Skin rash and itching",
  "Chest pain and breathing difficulty",
  "Stomach pain and nausea",
];

// Faster animation variants
const sidebarVariants = {
  open: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.15,
      ease: "easeOut"
    }
  },
  closed: { 
    x: -300, 
    opacity: 0,
    transition: { 
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

const messageVariants = {
  initial: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.1 }
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.15 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

const floatingButtonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.1 } }
};

export default function MedicalChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showNewChatButton, setShowNewChatButton] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isLoaded } = useUser();
  const endRef = useRef(null);
  const containerRef = useRef(null);

  // Start new chat function (unchanged)
  const startNewChat = async () => {
    console.log("Starting new chat...");

    const welcomeMessage = {
      role: "assistant",
      content:
        "Hello! I'm your AI medical assistant. Please describe your symptoms, and I'll help connect you with the right specialist.",
      time: new Date(),
    };

    setMessages([welcomeMessage]);
    setCurrentChatId(null);

    if (user) {
      try {
        console.log("Creating new chat session for user:", user.id);
        const sessionId = await createNewChatSession(user.id);
        console.log("New session created with ID:", sessionId);

        if (sessionId) {
          setCurrentChatId(sessionId);
          await saveUserMessage(user.id, sessionId, welcomeMessage);

          const sessions = await getChatSessions(user.id);
          console.log("Updated sessions:", sessions);
          setChatSessions(sessions);
        } else {
          console.error("Failed to create new session");
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Error starting new chat:", error);
        setMessages([welcomeMessage]);
      }
    } else {
      console.log("User not signed in, starting local chat only");
      setMessages([welcomeMessage]);
    }
  };

  // Load chat function (unchanged)
  const loadChat = async (chatId) => {
    if (user && chatId) {
      try {
        console.log("Loading chat:", chatId);
        const history = await getUserChatHistory(user.id, chatId);
        console.log("Loaded history:", history);

        if (history.length === 0) {
          console.log(
            "No messages found in this chat, starting new chat instead"
          );
          await startNewChat();
          return;
        }

        const formattedMessages = history.map((msg) => ({
          role: msg.role,
          content: msg.content,
          time: msg.timestamp?.toDate() || new Date(msg.createdAt),
          doctor: msg.doctor || null,
        }));

        setMessages(formattedMessages);
        setCurrentChatId(chatId);

        if (window.innerWidth < 1024) {
          setShowSidebar(false);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    }
  };

  // Format date for display (unchanged)
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";

    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get chat preview from messages (unchanged)
  const getChatPreview = (messages) => {
    if (!messages || messages.length === 0) return "New conversation";

    const userMessage = messages.find((msg) => msg.role === "user");
    if (userMessage) {
      return userMessage.content.length > 35
        ? userMessage.content.substring(0, 35) + "..."
        : userMessage.content;
    }

    const assistantMessage = messages.find((msg) => msg.role === "assistant");
    if (assistantMessage) {
      return (
        "Assistant: " +
        (assistantMessage.content.substring(0, 30) + "..." ||
          "New conversation")
      );
    }

    return "New conversation";
  };

  // Get message count for display - FIXED VERSION (unchanged)
  const getMessageCount = (session) => {
    if (session.messageCount !== undefined) {
      return session.messageCount;
    }
    return session.messages?.length || 0;
  };

  // Clear chat history (placeholder function) (unchanged)
  const clearChatHistory = async () => {
    if (
      confirm(
        "Are you sure you want to clear all chat history? This action cannot be undone."
      )
    ) {
      console.log("Clear history functionality to be implemented");
    }
  };

  // Load chat history and set up real-time listener (unchanged)
  useEffect(() => {
    if (!isLoaded) return;

    const initializeChat = async () => {
      if (user) {
        await initializeUserChat(user.id);

        const sessions = await getChatSessions(user.id);
        console.log("Initial sessions loaded:", sessions);
        setChatSessions(sessions);

        if (sessions.length > 0) {
          const recentChat = sessions[0];
          setCurrentChatId(recentChat.id);
          const history = await getUserChatHistory(user.id, recentChat.id);

          if (history.length > 0) {
            const formattedMessages = history.map((msg) => ({
              role: msg.role,
              content: msg.content,
              time: msg.timestamp?.toDate() || new Date(msg.createdAt),
              doctor: msg.doctor || null,
            }));
            setMessages(formattedMessages);
          } else {
            await startNewChat();
          }
        } else {
          await startNewChat();
        }
      } else {
        const welcomeMessage = {
          role: "assistant",
          content:
            "Hello! I'm your AI medical assistant. Please describe your symptoms, and I'll help connect you with the right specialist.",
          time: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    };

    initializeChat();
  }, [user, isLoaded]);

  // Set up real-time listener when currentChatId changes (unchanged)
  useEffect(() => {
    if (user && currentChatId && currentChatId !== "new-session") {
      const unsubscribe = subscribeToChat(
        user.id,
        currentChatId,
        (chatMessages) => {
          const formattedMessages = chatMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            time: msg.timestamp?.toDate() || new Date(msg.createdAt),
            doctor: msg.doctor || null,
          }));
          setMessages(formattedMessages);
        }
      );

      return () => unsubscribe();
    }
  }, [user, currentChatId]);

  // Hide new chat button when scrolling in messages (unchanged)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;
      setShowScrollBtn(!atBottom);

      if (container.scrollTop > 100) {
        setShowNewChatButton(false);
      } else {
        setShowNewChatButton(true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // sendMessage function (unchanged)
  async function sendMessage(e) {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      content: input.trim(),
      time: new Date(),
    };

    if (user) {
      if (!currentChatId) {
        const sessionId = await createNewChatSession(user.id);
        setCurrentChatId(sessionId);
        await saveUserMessage(user.id, sessionId, userMsg);
      } else {
        await saveUserMessage(user.id, currentChatId, userMsg);
      }
    }

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
      const doctor = getDoctorBySpecialization(userMsg.content);

      const assistantMsg = {
        role: "assistant",
        content:
          data?.text ||
          "I understand your concerns. Based on your symptoms, here's a specialist who can help you:",
        time: new Date(),
        doctor,
      };

      if (user && currentChatId) {
        await saveUserMessage(user.id, currentChatId, assistantMsg);

        const sessions = await getChatSessions(user.id);
        setChatSessions(sessions);
      } else {
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request. Here's a doctor who might be able to help:",
        time: new Date(),
        doctor: getRandomDoctor(),
      };

      if (user && currentChatId) {
        await saveUserMessage(user.id, currentChatId, errorMsg);
      } else {
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`${
        isFullScreen ? "fixed inset-0 mt-[80px]" : "h-screen mt-[30px]"
      } bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`${
          isFullScreen ? "h-full" : "h-full max-w-7xl mx-auto"
        } flex bg-white/90 backdrop-blur-lg shadow-2xl relative`}
      >
        {/* Enhanced Sidebar with faster animations */}
        <AnimatePresence mode="wait">
          {showSidebar && user && (
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`${
                sidebarCollapsed ? "w-20" : "w-80"
              } border-r border-gray-200 bg-white flex flex-col transition-all duration-150`}
            >
              {/* Enhanced Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <h2 className="text-lg font-semibold text-gray-800">
                      Chat History
                    </h2>
                  )}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={startNewChat}
                      className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group relative"
                      title="New Chat"
                    >
                      <Plus className="h-5 w-5 text-emerald-600" />
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          New Chat
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={sidebarCollapsed ? "Expand" : "Collapse"}
                    >
                      <ChevronDown
                        className={`h-4 w-4 text-gray-600 transition-transform duration-150 ${
                          sidebarCollapsed ? "-rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Chat Sessions List */}
              <div className="flex-1 overflow-y-auto">
                {chatSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                    <MessageSquare className="h-12 w-12 mb-4 text-gray-300" />
                    <p className="text-center text-sm">No chat history yet</p>
                    <p className="text-center text-xs mt-1">
                      Start a new conversation
                    </p>
                    <button
                      onClick={startNewChat}
                      className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                    >
                      Start New Chat
                    </button>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {chatSessions.map((session) => (
                      <motion.button
                        key={session.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => loadChat(session.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-150 group ${
                          currentChatId === session.id
                            ? "bg-emerald-50 border border-emerald-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {!sidebarCollapsed && (
                            <>
                              <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                  currentChatId === session.id
                                    ? "bg-emerald-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {getChatPreview(session.messages)}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    {formatDate(session.lastActivity)}
                                  </div>
                                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                    {getMessageCount(session)} messages
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                          {sidebarCollapsed && (
                            <div className="w-full flex justify-center">
                              <MessageSquare
                                className={`h-5 w-5 ${
                                  currentChatId === session.id
                                    ? "text-emerald-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Sidebar Footer */}
              <div className="p-4 border-t border-gray-200">
                {!sidebarCollapsed ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.firstName?.[0] || user?.username?.[0] || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.firstName || user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Active now
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.firstName?.[0] || user?.username?.[0] || "U"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-3 sm:py-3 flex items-center justify-between border-b border-emerald-500/30">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors lg:hidden"
                title="Toggle Sidebar"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {user && (
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors hidden lg:block"
                  title="Toggle Sidebar"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Stethoscope className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">
                  AI Medical Assistant
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  {user
                    ? `Welcome, ${user.firstName || user.username || "User"}`
                    : "Powered by Healthcare AI"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {showNewChatButton && (
                  <motion.button
                    variants={floatingButtonVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={startNewChat}
                    className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Chat</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={containerRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 relative bg-gradient-to-b from-white to-gray-50/50"
          >
            {/* Floating New Chat Button for Mobile */}
            <AnimatePresence>
              {showNewChatButton && (
                <motion.button
                  variants={floatingButtonVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClick={startNewChat}
                  className="sm:hidden fixed top-20 right-4 z-30 bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
                  title="New Chat"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
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
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex space-x-2 sm:space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                        <div className="bg-white border border-emerald-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg max-w-2xl">
                          <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                            {m.content}
                          </p>
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <span className="text-xs text-emerald-600 font-medium">
                              AI Assistant
                            </span>
                            <span className="text-xs text-gray-400">
                              {time}
                            </span>
                          </div>
                        </div>

                        {m.doctor && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                            className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-5 shadow-lg max-w-2xl hover:shadow-xl transition-all duration-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold text-sm sm:text-lg">
                                    {m.doctor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                    Dr. {m.doctor.name}
                                  </h3>
                                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium w-fit">
                                      {m.doctor.specialization}
                                    </span>
                                    <span className="flex items-center text-xs text-gray-600">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {m.doctor.experience}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-left sm:text-right">
                                <div className="text-lg font-bold text-emerald-600">
                                  {m.doctor.consultationFee}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Consultation
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-emerald-500 flex-shrink-0" />
                                    <span className="truncate text-xs sm:text-sm">
                                      {m.doctor.hospital}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-1 text-emerald-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">
                                      {m.doctor.contact}
                                    </span>
                                  </div>
                                </div>

                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit">
                                  {m.doctor.availability}
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-emerald-100 gap-3">
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                        i < m.doctor.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({m.doctor.reviews} reviews)
                                  </span>
                                </div>

                                <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto">
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
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex justify-end space-x-2 sm:space-x-3"
                  >
                    <div className="flex-1 max-w-2xl">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
                        <p className="leading-relaxed text-sm sm:text-base">
                          {m.content}
                        </p>
                        <div className="flex items-center justify-between mt-1 sm:mt-2">
                          <span className="text-xs text-emerald-100">You</span>
                          <span className="text-xs text-emerald-200">
                            {time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
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
                transition={{ duration: 0.1 }}
                className="flex space-x-2 sm:space-x-3"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
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
              transition={{ duration: 0.15 }}
              className="px-4 sm:px-6 pb-3"
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setInput(reply)}
                    className="px-3 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs sm:text-sm font-medium hover:bg-emerald-50 transition-all duration-150 shadow-sm"
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
                transition={{ duration: 0.1 }}
                onClick={scrollToBottom}
                className="absolute bottom-20 right-4 sm:bottom-24 sm:right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-110 z-10"
                title="Scroll to latest"
              >
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Input Form - WhatsApp Style */}
          <form
            onSubmit={sendMessage}
            className="p-3 sm:p-4 bg-white border-t border-gray-200/60"
          >
            <div className="flex items-end space-x-2 sm:space-x-3 max-w-4xl mx-auto">
              {/* Input Container */}
              <div className="flex-1 flex items-end bg-gray-100 rounded-3xl px-4 py-2 sm:px-4 sm:py-3 transition-all duration-150 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-sm sm:text-base resize-none max-h-32 py-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                {/* Clear Button */}
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 ml-2"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>

              {/* WhatsApp Style Send Button */}
              <motion.button
                type="submit"
                disabled={!input.trim()}
                whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                transition={{ duration: 0.1 }}
                className={`
                  flex-shrink-0 p-3 rounded-full transition-all duration-150
                  ${
                    input.trim()
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg cursor-pointer"
                      : "bg-gray-300 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <Send className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.button>
            </div>

            <div className="text-center mt-3">
              <p className="text-xs text-gray-500 px-2">
                {user
                  ? "Your conversations are saved and secure. For emergencies, please contact local emergency services."
                  : "Sign in to save your chat history. For emergencies, please contact local emergency services."}
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}