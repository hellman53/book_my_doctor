import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Users,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Star,
  Stethoscope,
  Zap,
  ArrowRight,
  CheckCircle,
  Calendar,
  UserCheck,
  Award,
  Sparkles,
  Play,
  Globe,
  TrendingUp,
  ShieldCheck,
  Brain,
  Activity,
  Target,
  Rocket,
  Laptop,
  Smartphone,
  Video,
  MessageCircle,
  ThumbsUp,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FloatingActionButton from "@/components/HomeComponent/FloatingActionButton";

export default function AboutUs() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const featuresScrollRef = useRef(null);
  const statsScrollRef = useRef(null);
  const processScrollRef = useRef(null);
  const techScrollRef = useRef(null);
  const route = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <Zap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
      title: "60-Second Booking",
      description:
        "Book appointments in under a minute with our streamlined process",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
      title: "Verified Doctors",
      description:
        "100% verified medical professionals with proven credentials",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
      title: "Secure Platform",
      description: "Military-grade encryption for your medical data",
      gradient: "from-violet-500 to-violet-600",
    },
    {
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
      title: "24/7 Available",
      description: "Round-the-clock support and appointment scheduling",
      gradient: "from-emerald-500 to-blue-500",
    },
    {
      icon: <Video className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
      title: "Virtual Consultations",
      description: "HD video calls with doctors from anywhere",
      gradient: "from-blue-500 to-violet-500",
    },
    {
      icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
      title: "AI-Powered Matching",
      description: "Smart algorithm finds your perfect doctor match",
      gradient: "from-violet-500 to-emerald-500",
    },
  ];

  const stats = [
    {
      number: "2000+",
      label: "Happy Patients",
      icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />,
      color: "emerald",
    },
    {
      number: "300+",
      label: "Expert Doctors",
      icon: <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />,
      color: "blue",
    },
    {
      number: "10+",
      label: "Cities Covered",
      icon: <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />,
      color: "violet",
    },
    {
      number: "4.9/5",
      label: "Patient Rating",
      icon: <Star className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />,
      color: "emerald",
    },
    {
      number: "24/7",
      label: "Support",
      icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />,
      color: "blue",
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: <Activity className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />,
      color: "violet",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Select & Search",
      description: "Choose your city and find the perfect doctor",
      icon: (
        <Target className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
      ),
      color: "emerald",
    },
    {
      step: "02",
      title: "Book Instantly",
      description: "Pick your time slot and confirm in seconds",
      icon: (
        <Rocket className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
      ),
      color: "blue",
    },
    {
      step: "03",
      title: "Connect & Consult",
      description: "Virtual or in-person consultation as you prefer",
      icon: (
        <Video className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
      ),
      color: "violet",
    },
    {
      step: "04",
      title: "Follow Up",
      description: "Easy prescription access and follow-up scheduling",
      icon: (
        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
      ),
      color: "emerald",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content:
        "BookMyDoc saved me hours of waiting time. The virtual consultation was so convenient!",
      rating: 5,
      image: "👩‍💼",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content:
        "As a doctor, I appreciate how this platform connects me with patients who need my expertise.",
      rating: 5,
      image: "👨‍⚕️",
    },
    {
      name: "Priya Sharma",
      role: "Working Professional",
      content:
        "Being able to book appointments during my lunch break has been life-changing!",
      rating: 5,
      image: "👩‍🎓",
    },
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Simply select your city, choose from verified doctors, pick your preferred time slot, and confirm. The entire process takes less than 60 seconds!",
    },
    {
      question: "Are all doctors properly verified?",
      answer:
        "Yes! Every doctor undergoes a rigorous 5-step verification process including license validation, qualification checks, and background verification.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Absolutely! You can cancel or reschedule anytime up to 2 hours before your appointment without any charges.",
    },
    {
      question: "Is there any booking fee?",
      answer:
        "Zero booking fees. You only pay the doctor's consultation fee directly after your appointment.",
    },
    {
      question: "How do virtual consultations work?",
      answer:
        "After booking, you'll receive a secure video link. Join at your appointment time for a private HD video consultation with your doctor.",
    },
    {
      question: "What if I need emergency care?",
      answer:
        "For medical emergencies, please contact your local emergency services immediately. We're designed for non-emergency consultations.",
    },
  ];

  const technologies = [
    {
      name: "React & Next.js",
      description: "Lightning fast frontend",
      icon: <Laptop className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
    },
    {
      name: "Firebase",
      description: "Secure real-time database",
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
    },
    {
      name: "WebRTC",
      description: "HD video calling",
      icon: <Video className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
    },
    {
      name: "AI/ML",
      description: "Smart doctor matching",
      icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />,
    },
  ];

  return (
    <div className="mt-10 w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <FloatingActionButton />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-4 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-300 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-8 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 bg-blue-200 rounded-full opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-violet-400 rounded-full opacity-25 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 sm:w-5 sm:h-5 bg-emerald-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 rounded-full opacity-25 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 pb-6 sm:py-20">
        <div className="container mx-auto max-w-12xl">
          <div
            className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg animate-pulse">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              🚀 The Future of Healthcare is Here
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Healthcare
              {/* <span className=" block bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 bg-clip-text text-transparent mt-2 sm:mt-4 animate-gradient">
                Reimagined
              </span> */}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed px-2">
              Experience healthcare that's{" "}
              <span className="font-bold text-emerald-600">faster</span>,{" "}
              <span className="font-bold text-blue-600">smarter</span>, and{" "}
              <span className="font-bold text-violet-600">more personal</span>{" "}
              than ever before
            </p>

            {/* Animated Stats Grid - Horizontal Scroll on Mobile */}
            <div className="relative mb-6 sm:mb-8 lg:mb-12">
              <div
                className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide"
                ref={statsScrollRef}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-36 sm:w-auto bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    } border-${stat.color}-100 hover:border-${stat.color}-300`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}
                    >
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll buttons for mobile */}
              <div className="lg:hidden flex justify-center gap-2 mt-4">
                <button
                  onClick={() => scrollLeft(statsScrollRef)}
                  className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => scrollRight(statsScrollRef)}
                  className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
              <button
                onClick={() => route.push("/doctors")}
                className="w-full sm:w-auto group bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
              >
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
                Start Your Journey
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "_blank"
                  )
                }
                className="w-full sm:w-auto group bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section - Horizontal Scroll on Mobile */}
      <section className="py-12 lg:pt-4 sm:pt-4 sm:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-12xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Why We're{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Different
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-2">
              We've rebuilt healthcare from the ground up with cutting-edge
              technology and patient-first design
            </p>
          </div>

          <div className="relative">
            <div
              className="flex lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide"
              ref={featuresScrollRef}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-80 sm:w-96 lg:w-auto group bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border border-gray-200 hover:border-emerald-300 transition-all duration-500 hover:scale-105 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Scroll buttons for mobile */}
            <div className="lg:hidden flex justify-center gap-3 mt-4">
              <button
                onClick={() => scrollLeft(featuresScrollRef)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => scrollRight(featuresScrollRef)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Horizontal Scroll on Mobile */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-violet-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-12xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-2">
              Your journey to better health starts here. Simple, fast, and
              secure.
            </p>
          </div>

          <div className="relative">
            <div
              className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide"
              ref={processScrollRef}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 sm:w-96 lg:w-auto relative"
                >
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                    <div
                      className={`bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{step.icon}</div>
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-300 mb-3 sm:mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Scroll buttons for mobile */}
            <div className="lg:hidden flex justify-center gap-3 mt-4">
              <button
                onClick={() => scrollLeft(processScrollRef)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => scrollRight(processScrollRef)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack - Horizontal Scroll on Mobile */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-12xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Powered by{" "}
              <span className="bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text text-transparent">
                Innovation
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-2">
              Built with the latest technology to ensure security, speed, and
              reliability
            </p>
          </div>

          <div className="relative">
            <div
              className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide"
              ref={techScrollRef}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 sm:w-96 lg:w-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-105 group"
                >
                  <div className="bg-gradient-to-br from-gray-600 to-gray-700 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{tech.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {tech.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Scroll buttons for mobile */}
            <div className="lg:hidden flex justify-center gap-3 mt-4">
              <button
                onClick={() => scrollLeft(techScrollRef)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => scrollRight(techScrollRef)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-violet-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl sm:max-w-5xl lg:max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              See what our community has to say
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                {testimonials[activeTestimonial].image}
              </div>
              <div className="flex justify-center mb-3 sm:mb-4">
                {[...Array(testimonials[activeTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400 fill-current mx-0.5"
                    />
                  )
                )}
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 italic mb-4 sm:mb-6 px-2">
                "{testimonials[activeTestimonial].content}"
              </p>
              <div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index
                      ? "bg-emerald-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:scale-105 group"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-left flex justify-between items-center group-hover:bg-white/50 rounded-xl sm:rounded-2xl"
                >
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-left pr-4 sm:pr-8 flex-1">
                    {faq.question}
                  </span>
                  <div className="bg-emerald-100 group-hover:bg-emerald-500 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                    {openFaq === index ? (
                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-emerald-600 group-hover:text-white transition-colors" />
                    ) : (
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-emerald-600 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-emerald-100 ">
        {/* bg-gradient-to-br from-purple-600 to-violet-700 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-700 mb-4 sm:mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-emerald-600/90 mb-6 sm:mb-8 max-w-2xl sm:max-w-3xl mx-auto px-2">
            Join over 100,000 patients who've discovered a better way to access
            quality healthcare
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button onClick={()=> route.push("/")} className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3">
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
              Get Started Now
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
            </button>
            <button onClick={()=>route.push("/doctors")} className="w-full sm:w-auto bg-transparent border-2 border-emerald-600 text-emerald-600 hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              View All Doctors
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(-5px) rotate(240deg);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient {
          background: linear-gradient(
            -45deg,
            #10b981,
            #3b82f6,
            #8b5cf6,
            #10b981
          );
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        }

        @media (max-width: 475px) {
          .xs\\:text-4xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
