"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  VenusAndMars, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Clock,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OnboardingPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFormData({
            fullName: data.fullName || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: data.email || user.primaryEmailAddress?.emailAddress || '',
            phoneNumber: data.phoneNumber || '',
            gender: data.gender || ''
          });
        } else {
          // If user document doesn't exist, use Clerk data
          setFormData({
            fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || '',
            phoneNumber: '',
            gender: ''
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchUserData();
    }
  }, [user, isLoaded]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to complete onboarding");
      return;
    }

    // Validation
    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!formData.gender) {
      toast.error("Please select your gender");
      return;
    }

    if (formData.phoneNumber.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setSubmitting(true);

    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber.trim(),
        gender: formData.gender,
        onboardingCompleted: true,
        updatedAt: new Date()
      });

      toast.success("Profile completed successfully!");
      setTimeout(() => {
        router.push("/doctors");
      }, 1500);

    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "200+ Expert Doctors",
      description: "Connect with verified healthcare professionals"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Book appointments anytime, anywhere"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your health data is completely confidential"
    }
  ];

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
              <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
                🎉 Welcome to BookMyDoc
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Just a few more details to personalize your healthcare experience and connect you with the right doctors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Features */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Why Complete Your Profile?
                </h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700">
                      Profile Completion
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      60%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2">
                    Complete this form to reach 100%
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Full Name - Read Only */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-900">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        readOnly
                        className="pl-11 bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Name fetched from your account
                    </p>
                  </div>

                  {/* Email - Read Only */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <svg 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="pl-11 bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Email fetched from your account
                    </p>
                  </div>

                  {/* Phone Number - Editable */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-900">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your 10-digit phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="pl-11"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll use this for appointment reminders and important updates
                    </p>
                  </div>

                  {/* Gender - Editable */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-900">
                      Gender *
                    </Label>
                    <div className="relative">
                      <VenusAndMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger className="pl-11">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-gray-500">
                      Helps us provide personalized healthcare recommendations
                    </p>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">
                          Your Privacy Matters
                        </h4>
                        <p className="text-blue-700 text-xs">
                          All your health information is encrypted and protected. We never share your 
                          personal data without your explicit consent, in compliance with healthcare privacy regulations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting || !formData.phoneNumber || !formData.gender}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving Your Profile...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Complete Profile & Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>

                  {/* Skip for now (optional) */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => router.push("/doctors")}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                      Skip for now, I'll complete later →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;