"use client";
import React, { useState, useEffect, useRef } from 'react';

// import { db } from "../app/firebase/config";
// import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import {
  ArrowRight,
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Video,
  Brain,
  Heart,
  Eye,
  Baby,
  Bone,
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
  return (
    <section className="hero relative overflow-hidden mt-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT TEXT */}
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="bg-emerald-100 border-emerald-300 px-4 py-2 text-emerald-700 text-sm font-medium"
            >
              Healthcare made simple
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {/* Dynamic Line */}
              <span className="text-black block">
                <Typewriter
                  words={[
                    "Connect with doctors",
                    "Book appointments",
                    "Manage your health",
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
              {/* Static Line */}
              <span className="block mt-2" style={{ color: "#0a9d6c" }}>
                Consult with Doctors Anytime, Anywhere
              </span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-md">
              Book appointments, consult via video, and manage your healthcare
              journey all in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Link href="/onboarding">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-emerald-300 hover:bg-gray-100"
              >
                <Link href="/doctors">Find Doctors</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
            <Image
              src="/banner2.png"
              alt="Doctor consultation"
              fill
              priority
              className="heroImg object-cover md:pt-14 rounded-xl p-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const specialties = [
  {
    icon: Stethoscope,
    title: "General Medicine",
    description:
      "Comprehensive healthcare for common conditions and preventive care",
    doctors: "2,500+ doctors",
  },
  {
    icon: Heart,
    title: "Cardiology",
    description: "Heart and cardiovascular system specialists across India",
    doctors: "450+ doctors",
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Brain, spine, and nervous system expert consultations",
    doctors: "320+ doctors",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Eye care specialists for vision and eye health",
    doctors: "280+ doctors",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized care for infants, children, and adolescents",
    doctors: "380+ doctors",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description: "Bone, joint, and musculoskeletal system specialists",
    doctors: "420+ doctors",
  },
];

const Services = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Specialists by{" "}
            <span className="text-emerald-600">Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with expert doctors across various specialties, available
            for both in-person and virtual consultations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow group bg-white border-emerald-200 hover:border-emerald-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                    <IconComponent className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {specialty.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{specialty.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-600">
                      {specialty.doctors}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      View Doctors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
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
];

const FeaturedDoctors = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Rated <span className="text-emerald-600">Doctors</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our highly rated healthcare professionals trusted by thousands
            of patients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDoctors.map((doctor, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-white border-emerald-200 hover:border-emerald-300"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-emerald-600 font-medium">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.experience} experience
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-sm text-gray-600">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>
                  {doctor.virtualAvailable && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-emerald-100 text-emerald-700"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Virtual
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {doctor.location}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-semibold text-emerald-600">
                    {doctor.consultationFee}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-600">Next available: </span>
                  <span className="font-medium ml-1 text-gray-900">
                    {doctor.nextAvailable}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="sm"
                  >
                    Book Appointment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            View All Doctors
          </Button>
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="bg-emerald-100 border-emerald-300 px-4 py-1 text-emerald-700 text-sm font-medium mb-4"
          >
            Affordable Healthcare
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Consultation Packages
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the perfect consultation package that fits your healthcare
            needs
          </p>
        </div>

        <div className="mx-auto">
          {/* Clerk Pricing Table */}
          <Pricing />

          {/* Description */}
          <Card className="mt-12 bg-gray-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-emerald-600" />
                How Our Credit System Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {creditBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-emerald-100 p-1 rounded-full">
                      <svg
                        className="h-4 w-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: benefit }}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const Feature = () => {
  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our platform makes healthcare accessible with just a few clicks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm"
            >
              <CardHeader className="pb-2">
                <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="bg-emerald-100 border-emerald-300 px-4 py-1 text-emerald-700 text-sm font-medium mb-4"
          >
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear from patients and doctors who use our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-emerald-200 hover:border-emerald-300 transition-all bg-white shadow-sm"
            >
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                    <span className="text-emerald-700 font-bold">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">&quot;{testimonial.quote}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* === Heading Section (same as screenshot) === */}
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Success Stories
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4"
              style={{ fontSize: '36px' }}>
            What Our Users Say
          </h1>
          <p className="text-gray-600 text-lg">
            Hear from patients and doctors who use our platform
          </p>
        </div>

        {/* === Carousel Section === */}
        <div className="relative overflow-hidden">
          <div
            className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id + Math.random()} 
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4"
              >
                <div 
                  className="bg-white rounded-lg shadow-md p-6 h-full"
                  style={{ 
                    border: '1px solid #29f68cff',
                    borderRadius: '10px'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
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


/* services in easy to understand */
const ConsultationSection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Consult top doctors online for any health concern
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Private online consultations with verified doctors in all specialists
          </p>
        </div>

        {/* Consultation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Period doubts or Pregnancy */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #00d492' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤰</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">45+ doctors</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Period doubts or Pregnancy</h3>
            <button className="w-full text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm hover:bg-green-700" style={{ backgroundColor: '#009966' }}>
              CONSULT NOW
            </button>
          </div>

          {/* Acne, pimple or skin issues */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #00d492' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🧴</span>
              </div>
              <span className="text-sm text-gray-500 font-medium" >38+ doctors</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Acne, pimple or skin issues</h3>
            <button className="w-full text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm hover:bg-green-700" style={{ backgroundColor: '#009966' }}>
              CONSULT NOW
            </button>
          </div>

          {/* Performance issues in bed */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #00d492' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💊</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">52+ doctors</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance issues in bed</h3>
            <button className="w-full text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm hover:bg-green-700" style={{ backgroundColor: '#009966' }}>
              CONSULT NOW
            </button>
          </div>

          {/* Cold, cough or fever */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #00d492' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤒</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">67+ doctors</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Cold, cough or fever</h3>
            <button className="w-full text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm hover:bg-green-700" style={{ backgroundColor: '#009966' }}>
              CONSULT NOW
            </button>
          </div>

          {/* Child not feeling well */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #00d492' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👶</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">41+ doctors</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Child not feeling well</h3>
            <button className="w-full text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm hover:bg-green-700" style={{ backgroundColor: '#009966' }}>
              CONSULT NOW
            </button>
          </div>

          {/* Depression or anxiety */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid #00d492' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">😔</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">29+ doctors</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Depression or anxiety</h3>
            <button className="w-full text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm hover:bg-green-700" style={{ backgroundColor: '#009966' }}>
              CONSULT NOW
            </button>
          </div>
        </div>

        {/* View All Specialties Button */}
        <div className="text-center">
          <button className="border-2 text-green-600 font-medium py-2 px-6 rounded-lg transition-colors hover:bg-green-600 hover:text-white" style={{ borderColor: '#00d492', color: '#009966' }}>
            View All Specialties
          </button>
        </div>

      </div>
    </section>
  );
};

/* mission vision section */
const DoctorAppointmentCards = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle card
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cards = [
    {
      id: 1,
      title: "Mission",
      description:
        "To provide exceptional healthcare services with compassion, innovation, and excellence, ensuring every patient receives personalized care in a comfortable environment.",
      icon: "🎯",
      bgColor: "#ffe2e2",
    },
    {
      id: 2,
      title: "Vision",
      description:
        "To be the leading healthcare provider known for outstanding patient care, medical excellence, and community wellness through cutting-edge technology and compassionate service.",
      icon: "👁️",
      bgColor: "#f3e8ff",
    },
    {
      id: 3,
      title: "Core Values",
      description:
        "Compassion, Integrity, Excellence, Innovation, and Patient-Centered Care. We prioritize your health and wellbeing above all else.",
      icon: "❤️",
      bgColor: "#fef9c2",
    },
  ];

  // Auto-rotate every 4 seconds (no dependency on currentIndex)
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getCardPosition = (index) => {
    const positions = ["left", "center", "right"];
    const adjustedIndex = (index - currentIndex + cards.length) % cards.length;
    return positions[adjustedIndex];
  };

  const getCardStyle = (position, bgColor) => {
    switch (position) {
      case "left":
        return {
          transform: "translateX(-120%) scale(0.9)",
          opacity: 0.9,
          zIndex: 10,
          backgroundColor: bgColor,
        };
      case "center":
        return {
          transform: "translateX(0) scale(1)",
          opacity: 1,
          zIndex: 30,
          backgroundColor: bgColor,
        };
      case "right":
        return {
          transform: "translateX(120%) scale(0.9)",
          opacity: 0.9,
          zIndex: 10,
          backgroundColor: bgColor,
        };
      default:
        return { backgroundColor: bgColor };
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-bold mb-4" style={{ fontSize: "36px" }}>
            <span className="text-black">Our Commitment </span>
            <span style={{ color: "#009966" }}>to You</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what drives our passion for healthcare excellence and
            patient-centered service
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative h-96 md:h-80 flex items-center justify-center">
          {cards.map((card, index) => {
            const position = getCardPosition(index);
            const style = getCardStyle(position, card.bgColor);

            return (
              <div
                key={card.id}
                className="absolute w-80 md:w-96 h-72 rounded-2xl shadow-xl transition-all duration-500 ease-in-out cursor-pointer hover:shadow-2xl"
                style={style}
                onClick={() => {
                  if (position === "left") handlePrev();
                  if (position === "right") handleNext();
                }}
              >
                <div className="p-8 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {card.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="text-gray-600 text-lg">
            Our commitment to these principles ensures that every patient
            receives the highest quality care in a supportive and innovative
            environment.
          </p>
        </div>
      </div>
    </div>
  );
};



const CTA = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to take control of your healthcare?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of users who have simplified their healthcare
                journey with our platform. Get started today and experience
                healthcare the way it should be.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Link href="/sign-up">Sign Up Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-emerald-300 hover:bg-gray-100"
                >
                  <Link href="#pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Decorative healthcare elements */}
            <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-200/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-300/30 rounded-full blur-3xl -ml-10 -mb-10"></div>
          </CardContent>
        </Card>
      </div>
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

      {/* Services Section */}
      <Services />
     
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
      
      {/* Testimonials with green medical accents */}
      <Testimonials />

      {/* CTA Section with green medical styling */}
      <CTA />
      
      {/* mission vision section */}
       <DoctorAppointmentCards/>

    </div>
  );
};

export default HomePage;
