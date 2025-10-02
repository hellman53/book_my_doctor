import React, { useState, useEffect } from "react";
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
  Sparkles
} from "lucide-react";

export default function AboutUs() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "60-Second Booking",
      description: "Book appointments in under a minute"
    },
    {
      icon: <UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Verified Doctors",
      description: "100% verified medical professionals"
    },
    {
      icon: <Shield className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "Secure Platform",
      description: "Your data is always protected"
    },
    {
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
      title: "24/7 Available",
      description: "Round-the-clock support"
    }
  ];

  const stats = [
    { number: "50K+", label: "Patients", icon: <Users className="h-4 w-4" /> },
    { number: "2K+", label: "Doctors", icon: <Stethoscope className="h-4 w-4" /> },
    { number: "25+", label: "Cities", icon: <MapPin className="h-4 w-4" /> },
    { number: "4.9", label: "Rating", icon: <Star className="h-4 w-4" /> }
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "Select city → Choose doctor → Pick time → Confirm. Done in 60 seconds!"
    },
    {
      question: "Are doctors verified?",
      answer: "Yes! Every doctor is thoroughly verified for qualifications and experience."
    },
    {
      question: "Can I cancel my appointment?",
      answer: "Cancel or reschedule anytime up to 2 hours before your appointment."
    },
    {
      question: "Any booking fees?",
      answer: "Zero booking fees. You only pay the doctor's consultation fee."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Background Elements - Hidden on mobile */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden sm:block">
        <div className="absolute top-1/4 left-4 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-8 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 bg-emerald-200 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 sm:w-5 sm:h-5 bg-emerald-300 rounded-full opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Revolutionizing Healthcare
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Healthcare
              <span className="block bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mt-2">
                Made Simple
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Connecting you with trusted doctors in your city. 
              <span className="text-emerald-600 font-semibold"> Fast. Secure. Reliable.</span>
            </p>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-md sm:max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                  style={{transitionDelay: `${index * 150}ms`}}
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-emerald-100">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-2 sm:mb-3">
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <button className="w-full sm:w-auto group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Find Doctors Near You
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto group border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                How It Works
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{transitionDelay: `${index * 150}ms`}}
              >
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why <span className="text-emerald-600">BookMyDoc?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We're on a mission to make quality healthcare accessible to everyone. 
              No more long waits, confusing processes, or uncertainty about doctor credentials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-emerald-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Trusted Platform</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Every doctor is verified and rated by real patients.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-emerald-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Instant Booking</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Book appointments in seconds, not hours.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-emerald-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Patient First</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Your health and convenience are our top priority.</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
                <div className="text-center">
                  <Star className="h-8 w-8 sm:h-10 sm:h-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 fill-current" />
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">4.9/5</div>
                  <div className="text-emerald-100 text-sm sm:text-base">Average Patient Rating</div>
                  <div className="flex justify-center mt-2 sm:mt-3">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 fill-current mx-0.5" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Got Questions?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-white to-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:scale-105"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center group"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-left pr-2">
                    {faq.question}
                  </span>
                  <div className="bg-emerald-100 group-hover:bg-emerald-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                    {openFaq === index ? (
                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 group-hover:text-white transition-colors" />
                    ) : (
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
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
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of patients who've transformed their healthcare experience with BookMyDoc
          </p>
          <button className="bg-white text-emerald-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Find Your Doctor Today
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @media (max-width: 640px) {
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        }
      `}</style>
    </div>
  );
}