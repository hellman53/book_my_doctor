"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs";

// import { db } from "../app/firebase/config";
// import { collection, addDoc } from "firebase/firestore";

import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Stethoscope,
  Star,
  Calendar,
  Video,
  Grid2X2,
  Users,
  Clock,
  Shield,
  PlayCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pricing from "@/components/pricingEX";
import { creditBenefits, features, testimonials } from "@/lib/data";
import "./homePage.css"
import DoctorForm from "@/pages/DoctorForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Hero = () => {
  const { user, isLoaded } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { number: "5000+", label: "Happy Patients", icon: <Users className="w-4 h-4" /> },
    { number: "200+", label: "Expert Doctors", icon: <Star className="w-4 h-4" /> },
    { number: "24/7", label: "Available", icon: <Clock className="w-4 h-4" /> },
    { number: "50+", label: "Specialties", icon: <Shield className="w-4 h-4" /> }
  ];

  const features = [
    { icon: <Video className="w-5 h-5" />, text: "Video Consultations" },
    { icon: <Calendar className="w-5 h-5" />, text: "Easy Booking" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure & Private" }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 overflow-hidden mt-8 xl:mt-8">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            
            {/* Left Content - Text & CTA */}
            <div className="text-center lg:text-left space-y-8 lg:space-y-10">
              
              {/* Welcome Message for Logged-in Users */}
              {user && isLoaded && (
                <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200 shadow-sm mb-8">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">
                    👋 Welcome back, {user.firstName || 'there'}!
                  </span>
                </div>
              )}

              {/* Main Badge */}
              {/* <div className="inline-flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <Badge className="bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-white">
                    🚀 Next-Gen Healthcare
                  </Badge>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Trusted by thousands</span>
                </div>
              </div> */}

              {/* Main Heading */}
              <div className="space-y-4 lg:space-y-6">
                {/* Dynamic Typing Text */}
                {/* <div className="h-20 lg:h-24 flex items-center justify-center lg:justify-start">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    <span className="block text-gray-900">
                      <Typewriter
                        words={[
                          "Healthcare Revolutionized",
                          "Doctors at Your Fingertips",
                          "Wellness Made Simple",
                          "Your Health, Our Priority"
                        ]}
                        loop={true}
                        cursor
                        cursorStyle="|"
                        typeSpeed={80}
                        deleteSpeed={50}
                        delaySpeed={2500}
                      />
                    </span>
                  </h1>
                </div> */}

                {/* Static Heading with Gradient */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                    {isMobile ? "BookMyDoc" : "Experience Healthcare Like Never Before"}
                  </span>
                </h2>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with top doctors, book instant appointments, and manage your health journey 
                seamlessly—all in one secure platform designed for modern healthcare needs.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm"
                  >
                    <div className="text-emerald-600">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl active:scale-95 py-6 px-8 group/btn min-w-[200px]"
                >
                  <Link href="/doctors" className="flex items-center justify-center gap-3">
                    <span className="text-lg">Find Doctors Now</span>
                    <ArrowRight className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl hover:bg-white hover:border-emerald-500 hover:text-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 py-6 px-8 group/btn min-w-[200px]"
                >
                  <Link href="/about" className="flex items-center justify-center gap-3">
                    <PlayCircle className="h-5 w-5" />
                    <span className="text-lg">How It Works</span>
                  </Link>
                </Button>
              </div>

              {/* Stats Grid - Desktop Only */}
              {!isMobile && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center lg:text-left p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                        <div className="text-emerald-600">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          {stat.number}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Content - Image & Visual Elements */}
            {!isMobile && (
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative">
                  {/* Floating Card 1 */}
                  <div className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50 transform rotate-3 z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Instant Booking</div>
                        <div className="text-sm text-gray-600">24/7 Available</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 2 */}
                  <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50 transform -rotate-2 z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Video Consult</div>
                        <div className="text-sm text-gray-600">Anywhere, Anytime</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Image */}
                  <div className="relative h-[600px] rounded-3xl overflow-hidden  group">
                    <Image
                      src="/hero3.jpg"
                      alt="Modern healthcare platform showing doctor consultation"
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-blue-500/5"></div> */}
                    
                    {/* Animated Border */}
                    {/* <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div> */}
                  </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full blur-3xl opacity-10"></div>
              </div>
            )}

            {/* Mobile Only Stats & Features */}
            {isMobile && (
              <div className="space-y-6">
                {/* Stats Grid for Mobile */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm"
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="text-emerald-600">
                          {stat.icon}
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          {stat.number}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile CTA Enhancement */}
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl p-6 text-white text-center shadow-2xl">
                  <h3 className="text-xl font-bold mb-2">Start Your Health Journey Today</h3>
                  <p className="text-emerald-100 text-sm mb-4">
                    Join thousands of happy patients using BookMyDoc
                  </p>
                  <Button
                    asChild
                    className="bg-white text-emerald-600 hover:bg-gray-100 font-bold rounded-xl py-3 px-6 shadow-lg"
                  >
                    <Link href="/onboarding" className="flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Desktop Only */}
      {!isMobile && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};


// Fixed icon components with unique names


const StethoscopeIcon = ({ className }) => <div className={className}>🩺</div>;
const HeartIcon = ({ className }) => <div className={className}>❤️</div>;
const BrainIcon = ({ className }) => <div className={className}>🧠</div>;
const EyeIcon = ({ className }) => <div className={className}>👁️</div>;
const BabyIcon = ({ className }) => <div className={className}>👶</div>;
const BoneIcon = ({ className }) => <div className={className}>🦴</div>;

const specialties = [
  {
    icon: StethoscopeIcon,
    title: "General Medicine",
    description: "Comprehensive healthcare for common conditions and preventive care",
    doctors: "2,500+ doctors",
  },
  {
    icon: HeartIcon,
    title: "Cardiology",
    description: "Heart and cardiovascular system specialists across India",
    doctors: "450+ doctors",
  },
  {
    icon: BrainIcon,
    title: "Neurology",
    description: "Brain, spine, and nervous system expert consultations",
    doctors: "320+ doctors",
  },
  {
    icon: EyeIcon,
    title: "Ophthalmology",
    description: "Eye care specialists for vision and eye health",
    doctors: "280+ doctors",
  },
  {
    icon: BabyIcon,
    title: "Pediatrics",
    description: "Specialized care for infants, children, and adolescents",
    doctors: "380+ doctors",
  },
  {
    icon: BoneIcon,
    title: "Orthopedics",
    description: "Bone, joint, and musculoskeletal system specialists",
    doctors: "420+ doctors",
  },
];

const Services = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              🏥 Medical Specialties
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Find Your Perfect
            <span className="block mt-2">Healthcare Specialist</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with certified doctors across multiple specialties, available for 
            <span className="font-semibold text-gray-800"> in-person consultations </span>
            and 
            <span className="font-semibold text-gray-800"> virtual visits</span>
          </p>
        </div>

        {/* Mobile Horizontal Scroll View */}
        <div className="block lg:hidden">
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 space-x-4 hide-scrollbar snap-x snap-mandatory">
              {specialties.map((specialty, index) => {
                const IconComponent = specialty.icon;
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 snap-center bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="p-6">
                      {/* Icon with Green & Blue Gradient */}
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-blue-500 p-0.5">
                          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                            <IconComponent className="h-7 w-7 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                        {specialty.title}
                      </h3>
                      
                      <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 line-clamp-2">
                        {specialty.description}
                      </p>

                      {/* Doctors Count */}
                      <div className="text-center mb-4">
                        <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          {specialty.doctors}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 active:scale-95 text-sm shadow-lg">
                        View Doctors
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Indicator for Mobile */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">Swipe for more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 z-10">
                  <div className="mb-6">
                    <div className="relative inline-flex">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-blue-500 p-0.5">
                        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-2xl">
                          <IconComponent className="h-8 w-8 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {specialty.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {specialty.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                    <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {specialty.doctors}
                    </span>
                    <button className="group/btn flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95">
                      <span>View Doctors</span>
                      <svg 
                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* CTA Section - Different for mobile and desktop */}
        <div className="text-center mt-16">
          {/* Mobile CTA */}
          <div className="block lg:hidden">
            <button className="w-full max-w-sm mx-auto py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95">
              Browse All Specialties
            </button>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Can't find what you're looking for?
                </h3>
                <p className="text-gray-600">
                  Browse our complete directory of healthcare professionals
                </p>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap">
                View All Specialties
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for mobile features */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};


const featuredDoctors = [
  {
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    experience: "15 years",
    rating: 4.9,
    reviews: 324,
    location: "Mumbai, Maharashtra",
    image: "/professional-indian-female-doctor.jpg",
    consultationFee: "₹800",
    virtualAvailable: true,
    nextAvailable: "Today, 3:00 PM",
  },
  {
    name: "Dr. Rajesh Kumar",
    specialty: "Neurologist",
    experience: "12 years",
    rating: 4.8,
    reviews: 256,
    location: "Delhi, NCR",
    image: "/indian-male-doctor.png",
    consultationFee: "₹1,200",
    virtualAvailable: true,
    nextAvailable: "Tomorrow, 10:00 AM",
  },
  {
    name: "Dr. Anita Patel",
    specialty: "Pediatrician",
    experience: "18 years",
    rating: 4.9,
    reviews: 412,
    location: "Bangalore, Karnataka",
    image: "/professional-indian-female-pediatrician.jpg",
    consultationFee: "₹600",
    virtualAvailable: true,
    nextAvailable: "Today, 5:30 PM",
  },
  {
    name: "Dr. Sanjay Verma",
    specialty: "Orthopedic",
    experience: "14 years",
    rating: 4.7,
    reviews: 189,
    location: "Chennai, Tamil Nadu",
    image: "/indian-male-doctor-2.jpg",
    consultationFee: "₹900",
    virtualAvailable: true,
    nextAvailable: "Today, 6:00 PM",
  },
  {
    name: "Dr. Meera Reddy",
    specialty: "Dermatologist",
    experience: "11 years",
    rating: 4.8,
    reviews: 278,
    location: "Hyderabad, Telangana",
    image: "/professional-indian-female-doctor-2.jpg",
    consultationFee: "₹750",
    virtualAvailable: true,
    nextAvailable: "Tomorrow, 11:00 AM",
  },
];

const FeaturedDoctors = () => {
  // Show only first 3 doctors initially
  const displayedDoctors = featuredDoctors.slice(0, 3);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 text-emerald-700">
              👨‍⚕️ Top Healthcare Professionals
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Meet Our
            <span className="block mt-2">Expert Doctors</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Highly rated healthcare professionals trusted by thousands of patients 
            across India
          </p>
        </div>

        {/* Doctors Cards - Show only 3 on laptop, horizontal scroll on mobile */}
        <div className="flex overflow-x-auto pb-8 lg:overflow-visible lg:grid lg:grid-cols-3 lg:gap-8 hide-scrollbar snap-x snap-mandatory">
          {displayedDoctors.map((doctor, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 lg:w-full lg:max-w-none snap-center bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 group mx-4 lg:mx-0"
            >
              {/* Doctor Image with Gradient Border */}
              <div className="relative p-6 pb-0">
                <div className="relative mx-auto w-36 h-36">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-300 to-blue-400 rounded-full p-1 transform group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full bg-white rounded-full p-1">
                      <img
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Online Status Indicator */}
                  {doctor.virtualAvailable && (
                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6 pt-4">
                {/* Name and Specialty */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {doctor.specialty}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {doctor.experience} experience
                  </p>
                </div>

                {/* Rating and Location */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-semibold text-gray-900">{doctor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ({doctor.reviews} reviews)
                      </span>
                    </div>
                    {doctor.virtualAvailable && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></span>
                        Virtual Available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span className="truncate">{doctor.location}</span>
                  </div>
                </div>

                {/* Consultation Fee and Availability */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 mb-4 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Consultation:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {doctor.consultationFee}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2">🕒</span>
                    <span className="text-gray-600">Next: </span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {doctor.nextAvailable}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-sm">
                    Book Appointment
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 active:scale-95 text-sm">
                    Profile
                  </button>
                </div>
              </div>

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-emerald-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Scroll Indicator for Mobile */}
        <div className="lg:hidden text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-600 ml-2">Swipe to see more doctors</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100 shadow-lg">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Want to see more doctors?
              </h3>
              <p className="text-gray-600">
                Browse our complete directory of {featuredDoctors.length}+ healthcare professionals
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap">
              View All Doctors
            </button>
          </div>
        </div>
      </div>

      {/* CSS for mobile features */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};


const PricingSection = () => {
  const creditBenefits = [
    "1 Credit = 1 Consultation with any specialist doctor",
    "Credits never expire - use them whenever you need",
    "Transfer credits to family members anytime",
    "Get 24/7 support for all your healthcare needs",
    "Free follow-up consultations for 7 days",
    "Access to premium health records storage",
  ];

  const pricingPlans = [
    {
      name: "Basic Care",
      credits: 1,
      price: "₹499",
      originalPrice: "₹799",
      savings: "38% savings",
      popular: false,
      features: [
        "1 Specialist Consultation",
        "24/7 Chat Support",
        "Basic Health Records",
        "7 Days Follow-up",
        "Email Support",
        "Prescription Storage",
        "Health Tips & Reminders",
      ],
    },
    {
      name: "Family Pack",
      credits: 4,
      price: "₹1,799",
      originalPrice: "₹3,196",
      savings: "44% savings",
      popular: true,
      features: [
        "4 Specialist Consultations",
        "Priority 24/7 Support",
        "Family Sharing Enabled",
        "30 Days Follow-up",
        "Health Records for 4",
        "Dedicated Care Manager",
        "Free Nutrition & Lifestyle Guidance",
      ],
    },
    {
      name: "Premium Care",
      credits: 8,
      price: "₹3,199",
      originalPrice: "₹6,392",
      savings: "50% savings",
      popular: false,
      features: [
        "8 Specialist Consultations",
        "24/7 Priority Support",
        "Unlimited Family Sharing",
        "60 Days Follow-up",
        "Advanced Health Analytics",
        "Personal Health Coach",
        "Annual Health Checkup",
      ],
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-base font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              💰 Affordable Healthcare
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Consultation Packages
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect consultation package that fits your healthcare needs
          </p>
        </div>

        {/* ✅ Fixed Responsive Scrollable Pricing Cards */}
        <div className="pb-6">
          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible px-4 md:px-0 snap-x snap-mandatory scroll-smooth scrollbar-hide">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`min-w-[85%] sm:min-w-[60%] md:min-w-0 snap-center group relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 transition-all duration-500 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-emerald-300 shadow-xl scale-[1.02]"
                    : "border-gray-200 hover:border-emerald-200 shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">👑</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {plan.credits} Credit{plan.credits > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {plan.originalPrice}
                      </span>
                    </div>
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {plan.savings}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mr-2 mt-0.5">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-md hover:shadow-lg"
                        : "bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-sm hover:shadow-md"
                    } active:scale-95`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit System */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg p-6 mt-10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <span className="text-xl">💎</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              How Our{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Credit System
              </span>{" "}
              Works
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Simple, flexible, and designed for your healthcare convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-start p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 hover:border-emerald-200 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 pt-6 border-t border-emerald-100">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-sm">
              <span>Start Your Health Journey</span>
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const buttons = [
    {
      id: 1,
      label: "My Appointments",
      icon: "👨‍⚕️",
      onClick: () => router.push("/my-appointments"),
      bgColor: "bg-emerald-500"
    },
    {
      id: 2,
      label: "Find Doctors",
      icon: "📞",
      onClick: () => router.push("/doctors"),
      bgColor: "bg-purple-500"
    },
    {
      id: 3,
      label: "AI Assistant",
      icon: "🤖",
      onClick: () => router.push("/ai-assistent"),
      bgColor: "bg-blue-500"
    },
    {
      id: 4,
      label: "Supports",
      icon: "💬",
      onClick: () => router.push("/technical-support"),
      bgColor: "bg-green-500"
    }
  ];

  // Cart button with bubble effect
  const CartButton = () => {
    const [isBubbling, setIsBubbling] = useState(false);

    const handleClick = () => {
      console.log("Cart clicked");
      // Add your cart functionality here
    };

    const handleBubbleEffect = () => {
      setIsBubbling(true);
      setTimeout(() => setIsBubbling(false), 600);
    };

    return (
      <button
        onClick={handleClick}
        onMouseEnter={handleBubbleEffect}
        onTouchStart={handleBubbleEffect}
        className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
      >
        {/* Bubble effect */}
        {isBubbling && (
          <div className="absolute inset-0 rounded-full border-4 border-orange-300 animate-ping opacity-75"></div>
        )}
        
        {/* Cart icon */}
        <span className="text-lg">🛒</span>
        
        {/* Optional: Cart badge */}
        {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
          3
        </div> */}
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 right-8 z-50">
      {/* Floating Action Buttons - Stack vertically to the LEFT of main button */}
      <div className={`flex flex-col items-end mb-3 absolute bottom-full right-0 space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {buttons.map((button, index) => (
          <div
            key={button.id}
            className={`flex items-center transition-all duration-500 transform ${
              isOpen 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-10 scale-50'
            }`}
            style={{
              transitionDelay: isOpen ? `${index * 100}ms` : '0ms'
            }}
          >
            {/* Label on the left side */}
            <div className="mr-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
              {button.label}
            </div>
            {/* Button */}
            <button
              onClick={button.onClick}
              className={`${button.bgColor} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
            >
              <span className="text-lg">{button.icon}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Cart Button - Shows only when main menu is closed */}
      <Link href="/medicine-store">
        <div className={`mb-3 absolute bottom-full right-0 transition-all duration-500 transform ${
          !isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
        }`}>
          <CartButton />
        </div>
      </Link>

      {/* Main Floating Button */}
      <button
        onClick={toggleMenu}
        className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative"
      >
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <Grid2X2 />
        </span>
      </button>
    </div>
  );
};



const MedicineStoreSection = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-white via-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm md:text-base font-semibold px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              🚀 Coming Soon
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
            Medicine Store
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your complete healthcare ecosystem - From doctor consultations to medicine delivery at your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Centered Coming Soon Badge with Shine Effect */}
            <div className="flex justify-center">
              <div className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl shadow-lg text-center overflow-hidden">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full animate-shine" />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold relative z-10">Coming Soon</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                Your <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">One-Stop</span> Healthcare Solution
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">💊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Wide Medicine Range</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Prescription & over-the-counter medicines from trusted brands</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">🚚</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Fast Delivery</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Same-day delivery with real-time tracking</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Auto-Prescription Sync</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Automatic prescription import from your doctor consultations</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Discounts & Offers</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Exclusive discounts for BookMyDoc users</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-emerald-200 max-w-2xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg text-center">Be the first to know!</h4>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
                />
                <button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section with Gradient Border */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 md:mt-16">
          <div className="text-center p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-sm relative">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full bg-gradient-to-br from-white via-emerald-50 to-blue-50 rounded-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">10K+</div>
              <div className="text-gray-600 text-sm sm:text-base">Medicines</div>
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-sm relative">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full bg-gradient-to-br from-white via-emerald-50 to-blue-50 rounded-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-gray-600 text-sm sm:text-base">Available</div>
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-sm relative">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full bg-gradient-to-br from-white via-emerald-50 to-blue-50 rounded-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">100+</div>
              <div className="text-gray-600 text-sm sm:text-base">Cities</div>
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-sm relative">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full bg-gradient-to-br from-white via-emerald-50 to-blue-50 rounded-2xl"></div>
            </div>
            <div className="relative z-10">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">30min</div>
              <div className="text-gray-600 text-sm sm:text-base">Delivery Promise</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation for shine effect */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </section>
  );
};

const Feature = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              ⚡ Quick & Easy
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Our platform makes healthcare accessible with just a few clicks
          </p>
        </div>

        {/* Mobile Horizontal Scroll View */}
        <div className="block lg:hidden">
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 space-x-4 hide-scrollbar snap-x snap-mandatory">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 snap-center bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-emerald-200"
                >
                  <div className="p-6">
                    {/* Gradient Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-blue-500 p-0.5 group-hover:from-emerald-600 group-hover:to-blue-600 transition-all duration-300">
                        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-2xl">
                          {feature.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-3 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 line-clamp-3">
                      {feature.description}
                    </p>

                    {/* Step Number */}
                    <div className="text-center">
                      <span className="text-xs font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator for Mobile */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">Swipe for more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8 z-10">
                {/* Step Number */}
                <div className="absolute top-6 right-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                </div>

                {/* Gradient Icon */}
                <div className="mb-6">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-blue-500 p-0.5 group-hover:from-emerald-600 group-hover:to-blue-600 transition-all duration-300">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-3xl">
                        {feature.icon}
                      </div>
                    </div>
                    {/* Animated Dots */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center space-x-2 text-emerald-600 group-hover:text-emerald-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom Gradient Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100 shadow-lg">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to get started?
              </h3>
              <p className="text-gray-600">
                Join thousands of patients who trust our platform
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap">
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      {/* CSS for mobile features */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};

/* chatbot section*/ 
const ChatbotFeatures = () => {
  const features = [
    {
      icon: "👨‍⚕️",
      title: "Doctor Suggestions",
      description: "Get instant medical advice and doctor recommendations based on your symptoms and health concerns"
    },
    {
      icon: "🕒",
      title: "24/7 Availability",
      description: "Round-the-clock assistance whenever you need medical guidance, even during late hours"
    },
    {
      icon: "💊",
      title: "Medication Reminders",
      description: "Never miss your medication with smart reminders and dosage tracking"
    },
    {
      icon: "🏥",
      title: "Hospital Locator",
      description: "Find nearby hospitals, clinics, and specialists based on your location and needs"
    },
    {
      icon: "📊",
      title: "Health Analytics",
      description: "Track your health metrics and get personalized insights and trends"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your health data is encrypted and completely confidential"
    }
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-6 leading-tight">
            AI Health Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal healthcare companion powered by advanced AI technology. 
            Get instant medical guidance, support, and resources anytime, anywhere.
          </p>
        </div>

        {/* Features - Horizontal Scroll on Mobile */}
        <div className="relative">
          {/* Mobile Horizontal Scroll */}
          <div className="flex lg:hidden overflow-x-auto pb-6 -mx-4 px-4 space-x-4 scrollbar-hide">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-80 rounded-2xl p-[1.5px] bg-gradient-to-r from-green-500 to-blue-400 shadow-lg"
              >
                <div className="bg-white rounded-2xl p-6 h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-4">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="rounded-2xl p-[1.5px] bg-gradient-to-r from-green-500 to-blue-400 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-white rounded-2xl p-8 h-full hover:scale-[1.02] transition-transform duration-300">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-6 hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats with Gradient Borders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          {[
            { number: "50K+", label: "Users Helped" },
            { number: "24/7", label: "Availability" },
            { number: "98%", label: "Accuracy Rate" },
            { number: "5min", label: "Response Time" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="rounded-2xl p-[1.5px] bg-gradient-to-r from-green-500 to-blue-400 shadow-lg"
            >
              <div className="bg-white rounded-2xl p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section with Gradient Border */}
        <div className="text-center mt-16">
          <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-green-500 to-blue-400">
            <div className="bg-white rounded-3xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Ready to Experience Better Healthcare?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Start chatting with our AI health assistant today and get personalized medical guidance in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Start Chat Now
                </button>
                <button className="rounded-2xl p-[1.5px] bg-gradient-to-r from-green-500 to-blue-400 hover:scale-105 transition-all duration-300">
                  <div className="bg-white rounded-2xl px-8 py-4">
                    <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-semibold text-lg">
                      Learn More
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};


/* moving testimonial section api */
const mockTestimonials = [
  {
    id: 1,
    name: "Sarah R.",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The video consultation feature saved me so much time. I was able to get medical advice without taking time off work or traveling to a clinic."
  },
  {
    id: 2,
    name: "Dr. Robert M.",
    role: "Cardiologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "This platform has revolutionized my practice. I can now reach more patients and provide timely care without the constraints of a physical office."
  },
  {
    id: 3,
    name: "James T.",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The credit system is so convenient. I purchased a package for my family, and we've been able to consult with specialists whenever needed."
  },
  {
    id: 4,
    name: "Dr. Emily W.",
    role: "Pediatrician",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "As a pediatrician, this platform helps me connect with young patients in a comfortable environment, reducing their anxiety about doctor visits."
  },
  {
    id: 5,
    name: "Michael P.",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The prescription delivery service is fantastic. I get my medications right at my doorstep without any hassle."
  },
  {
    id: 6,
    name: "Dr. Lisa K.",
    role: "Dermatologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The image sharing feature is perfect for dermatology consultations. Patients can easily share photos of their skin conditions for accurate diagnosis."
  },
  {
    id: 7,
    name: "Jennifer L.",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The 24/7 availability is amazing. I had a medical concern late at night and got immediate help from a qualified doctor."
  },
  {
    id: 8,
    name: "David Chen",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "As someone with mobility issues, this platform has been life-changing. I can access quality healthcare from my home."
  },
  {
    id: 9,
    name: "Maria Garcia",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The multilingual support is excellent. I can communicate with doctors in my native language without any barriers."
  },
  {
    id: 10,
    name: "Alex Johnson",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The medical records feature keeps all my health information organized. No more carrying paperwork between doctors."
  },
  {
    id: 11,
    name: "Priya Sharma",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The specialist referral system is seamless. I was connected with the right expert for my condition within hours."
  },
  {
    id: 12,
    name: "Thomas Wilson",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    text: "The follow-up care is outstanding. My doctor checked on my recovery progress regularly through the platform."
  }
];

/* moving testimonial section */
const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const transitionRef = useRef(null);

  // Load testimonials with cloned cards for infinite loop
  useEffect(() => {
    setTestimonials([...mockTestimonials, ...mockTestimonials.slice(0, 3)]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (testimonials.length === 0) return;

    transitionRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4000);

    return () => clearInterval(transitionRef.current);
  }, [testimonials]);

  // Reset when reaching the end
  useEffect(() => {
    if (currentIndex === testimonials.length - 3) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* === Heading Section with Gradient === */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              💫 Success Stories
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            What Our Users Say
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Hear from patients and doctors who use our platform
          </p>
        </div>

        {/* === Carousel Section === */}
        <div className="relative overflow-hidden">
          <div
            className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id + Math.random()} 
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3 sm:px-4"
              >
                {/* Card with Permanent 2px Gradient Border */}
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full shadow-lg">
                  {/* Permanent 2px Gradient Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-0.5">
                    <div className="w-full h-full rounded-2xl bg-white"></div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* User Info with Gradient */}
                    <div className="flex items-center mb-6">
                      <div className="relative mr-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 p-0.5">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        {/* Online Indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</h3>
                        <p className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="relative mb-6">
                      <span className="absolute -left-2 -top-3 text-xl sm:text-2xl text-emerald-400 opacity-50">"</span>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed pl-2 sm:pl-4">
                        {testimonial.text}
                      </p>
                      <span className="absolute -right-2 -bottom-3 text-xl sm:text-2xl text-blue-400 opacity-50">"</span>
                    </div>

                    {/* Rating Stars & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-0.5 sm:space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      
                      {/* Quote Icon */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                        <svg 
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="block lg:hidden flex justify-center mt-8">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-600 ml-2">Swipe for more</span>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="hidden lg:flex justify-center mt-12">
          <div className="flex items-center space-x-3">
            {mockTestimonials.slice(0, 4).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex % 4) === index 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 w-8'
                    : 'bg-gray-300'
                }`}
                onClick={() => {
                  setCurrentIndex(index * 3);
                  setIsTransitioning(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-6 items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/50 shadow-lg w-full max-w-4xl mx-auto">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Join Our Happy Community
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Experience the future of healthcare today
              </p>
            </div>
            <button className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap text-sm sm:text-base">
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* CSS for mobile features */}
      <style jsx>{`
        @media (max-width: 640px) {
          .flex-shrink-0 {
            scroll-snap-align: start;
          }
          .flex {
            scroll-snap-type: x mandatory;
          }
        }
      `}</style>
    </section>
  );
};

/* footer */ 
const Footer = () => {
return (
  <footer className="text-white py-8 px-4" style={{ backgroundColor: '#d6fbe8' }}>
    <div className="max-w-6xl mx-auto">
      
      {/* Healthcare+ Brand */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#009966' }}>BookMyDoc</h1>
        <p className="text-gray-700">
          Your trusted healthcare partner providing quality medical services with modern technology.
        </p>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#009966' }}>Quick Links</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="#" className="hover:text-gray-900 transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-gray-900 transition-colors">Our Doctors</a></li>
            <li><a href="#" className="hover:text-gray-900 transition-colors">Book Appointment</a></li>
            <li><a href="#" className="hover:text-gray-900 transition-colors">About Us</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#009966' }}>Services</h3>
          <ul className="space-y-2 text-gray-700">
            <li>General Medicine</li>
            <li>Cardiology</li>
            <li>Pediatrics</li>
            <li>Emergency Care</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#009966' }}>Contact Info</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center justify-center md:justify-start">
              <span className="mr-2">📍</span>
              <span>123 Gorakhpur, City</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <span className="mr-2">📞</span>
              <span>+91 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <span className="mr-2">📎</span>
              <span>info@BookMyDoc.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-400 pt-4 text-center text-gray-600 text-sm">
        <p>© 2025 BookMyDoc. All Rights Reserved.
Designed & Developed By
Angle270</p>
      </div>
      
    </div>
  </footer>
);
};


/* services in easy to understand*/ 
const ConsultationSection = () => {
  const consultations = [
    {
      id: 1,
      title: "Period doubts or Pregnancy",
      icon: "🤰",
      doctors: "45+ doctors",
      description: "Expert guidance for women's health concerns"
    },
    {
      id: 2,
      title: "Acne, pimple or skin issues",
      icon: "🧴",
      doctors: "38+ doctors",
      description: "Dermatology specialists for skin care"
    },
    {
      id: 3,
      title: "Performance issues in bed",
      icon: "💊",
      doctors: "52+ doctors",
      description: "Confidential consultations available"
    },
    {
      id: 4,
      title: "Cold, cough or fever",
      icon: "🤒",
      doctors: "67+ doctors",
      description: "General physicians for common illnesses"
    },
    {
      id: 5,
      title: "Child not feeling well",
      icon: "👶",
      doctors: "41+ doctors",
      description: "Pediatric specialists for children's health"
    },
    {
      id: 6,
      title: "Depression or anxiety",
      icon: "😔",
      doctors: "29+ doctors",
      description: "Mental health professionals available"
    }
  ];

  // State for animated counters
  const [counters, setCounters] = useState({
    patients: 0,
    doctors: 0,
    availability: 0,
    specialties: 0
  });

  const targetCounters = {
    patients: 5000,
    doctors: 200,
    availability: 24,
    specialties: 50
  };

  // Animate counters
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const animateCounter = (key, target) => {
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
    };

    // Start animations with slight delays for visual effect
    setTimeout(() => animateCounter('patients', targetCounters.patients), 100);
    setTimeout(() => animateCounter('doctors', targetCounters.doctors), 300);
    setTimeout(() => animateCounter('availability', targetCounters.availability), 500);
    setTimeout(() => animateCounter('specialties', targetCounters.specialties), 700);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 text-emerald-700">
              🩺 Online Consultations
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Consult Top Doctors Online
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Private online consultations with verified doctors across all specialties. 
            <span className="font-semibold text-gray-800"> Available 24/7</span>
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
              
              <div className="relative p-8 z-10">
                {/* Icon with Gradient Background */}
                <div className="mb-6">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-blue-500 p-0.5">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-3xl">
                        {consultation.icon}
                      </div>
                    </div>
                    {/* Floating Dots */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {consultation.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {consultation.description}
                </p>

                {/* Doctors Count */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {consultation.doctors}
                  </span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-emerald-300 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                {/* Gradient Button */}
                <button className="group/btn w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2">
                  <span>CONSULT NOW</span>
                  <svg 
                    className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Bottom Gradient Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll View */}
        <div className="block lg:hidden mb-8">
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 space-x-4 hide-scrollbar snap-x snap-mandatory">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex-shrink-0 w-80 snap-center bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg p-6"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-blue-500 p-0.5">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-2xl">
                        {consultation.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                    {consultation.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 line-clamp-2">
                    {consultation.description}
                  </p>

                  {/* Doctors Count */}
                  <div className="text-center mb-4">
                    <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {consultation.doctors}
                    </span>
                  </div>

                  {/* Gradient Button */}
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 active:scale-95 text-sm shadow-lg">
                    CONSULT NOW
                  </button>
                </div>
              ))}
            </div>

            {/* Scroll Indicator for Mobile */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">Swipe for more</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-6 items-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-lg w-full max-w-4xl mx-auto">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Browse our complete directory of healthcare specialists
              </p>
            </div>
            <button className="group/btn px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap flex items-center space-x-2 text-sm sm:text-base">
              <span>View All Specialties</span>
              <svg 
                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Section with Permanent 1.5px Gradient Borders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16">
          {/* Happy Patients Counter */}
          <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            {/* Permanent 1.5px Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full rounded-2xl bg-white"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {counters.patients}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Happy Patients</div>
            </div>
          </div>

          {/* Expert Doctors Counter */}
          <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            {/* Permanent 1.5px Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full rounded-2xl bg-white"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {counters.doctors}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Expert Doctors</div>
            </div>
          </div>

          {/* Availability Counter */}
          <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            {/* Permanent 1.5px Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full rounded-2xl bg-white"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {counters.availability}/7
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Availability</div>
            </div>
          </div>

          {/* Specialties Counter */}
          <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            {/* Permanent 1.5px Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-[1.5px]">
              <div className="w-full h-full rounded-2xl bg-white"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {counters.specialties}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Specialties</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for mobile features */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};





/* mission vision section */
const DoctorAppointmentCards = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cards = [
    {
      id: 1,
      title: "Mission",
      description:
        "Provide exceptional healthcare with compassion, innovation, and personalized patient care excellence.",
      icon: "🎯",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      id: 2,
      title: "Vision",
      description:
        "Leading healthcare provider known for outstanding patient care and medical excellence through innovation.",
      icon: "👁️",
      gradient: "from-emerald-400 to-green-400",
    },
    {
      id: 3,
      title: "Core Values",
      description:
        "Compassion, Integrity, Excellence, Innovation. We prioritize your health and wellbeing above all.",
      icon: "❤️",
      gradient: "from-purple-400 to-pink-400",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getCardPosition = (index) => {
    const positions = ["left", "center", "right"];
    const adjustedIndex = (index - currentIndex + cards.length) % cards.length;
    return positions[adjustedIndex];
  };

  const getCardStyle = (position) => {
    switch (position) {
      case "left":
        return {
          transform: "translateX(-135%) scale(0.9)",
          opacity: 1,
          zIndex: 10,
        };
      case "center":
        return {
          transform: "translateX(0) scale(1.05)",
          opacity: 1,
          zIndex: 30,
        };
      case "right":
        return {
          transform: "translateX(135%) scale(0.9)",
          opacity: 1,
          zIndex: 10,
        };
      default:
        return {};
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              💫 Our Commitment
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Our Commitment to You
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover what drives our passion for healthcare excellence and
            patient-centered service
          </p>
        </div>

        {/* Desktop Cards */}
        <div className="hidden lg:flex items-center justify-center relative h-[380px] overflow-hidden mb-12">
          {cards.map((card, index) => {
            const position = getCardPosition(index);
            const style = {
              ...getCardStyle(position),
              position: "absolute",
              left: "50%",
              transform: `${getCardStyle(position).transform} translateX(-50%)`,
              transition: "all 0.6s ease",
            };

            return (
              <div
                key={card.id}
                className="absolute w-[360px] h-[280px] rounded-2xl cursor-pointer"
                style={style}
                onClick={() => handleNext()}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-0.5">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <div className="p-6 h-full flex flex-col justify-center text-center w-full">
                      <div className="flex justify-center mb-4">
                        <div
                          className={`w-18 h-18 rounded-2xl bg-gradient-to-r ${card.gradient} p-0.5`}
                        >
                          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-3xl">
                            {card.icon}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {card.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Cards */}
        <div className="block lg:hidden">
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 space-x-4 hide-scrollbar snap-x snap-mandatory px-4">
              {cards.map((card) => (
                <div key={card.id} className="flex-shrink-0 w-[320px] snap-center">
                  <div className="relative bg-white rounded-2xl h-[260px]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 p-0.5">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                        <div className="p-6 h-full flex flex-col justify-center text-center w-full">
                          <div className="flex justify-center mb-4">
                            <div
                              className={`w-16 h-16 rounded-xl bg-gradient-to-r ${card.gradient} p-0.5`}
                            >
                              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center text-2xl">
                                {card.icon}
                              </div>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {card.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">Swipe for more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
            <p className="text-gray-600 text-lg leading-relaxed">
              Our commitment to these principles ensures that every patient
              receives the highest quality care in a supportive and innovative
              environment.
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};




const HomePage = () => {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const docRef = await addDoc(collection(db, "message"), {
  //       name,
  //       email,
  //       message
  //     });
  //     console.log("Document written with ID:", docRef.id);

  //     // clear form after submit
  //     setName("");
  //     setEmail("");
  //     setMessage("");
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };
  return (
    <div className="bg-white w-[100%] ">
      {/* Hero Section */}
      <Hero />
      
      <FloatingActionButton/> 

      {/* Services Section */}
      
      < Services/>
     
      {/* Featured Doctors Section */}
      <FeaturedDoctors />
      
      {/* Pricing Section with green medical styling */}
      <PricingSection />

      {/* Features Section */}
      <Feature />
      
      {/* moving testimonial section */}
      <TestimonialCarousel/>
      
      {/* services in easy to understand */}
      <ConsultationSection/>
      
      <MedicineStoreSection/>

      <ChatbotFeatures/>
      
      {/* mission vision section */}
       <DoctorAppointmentCards/>

    </div>
  );
};

export default HomePage;
