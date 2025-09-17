"use client";
import React, { useState } from "react";
// import { db } from "../app/firebase/config";
// import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
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
import Pricing from "@/components/pricing";
import { creditBenefits, features, testimonials } from "@/lib/data";
import "./homePage.css"

const Hero = () => {
  return (
    <section className=" hero relative overflow-hidden mt-32 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="bg-emerald-100 border-emerald-300 px-4 py-2 text-emerald-700 text-sm font-medium"
            >
              Healthcare made simple
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Connect with doctors <br />
              <span className="gradient-title">anytime, anywhere</span>
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
    <div className="bg-white">
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

      {/* Testimonials with green medical accents */}
      <Testimonials />

      {/* CTA Section with green medical styling */}
      <CTA />
    </div>
  );
};

export default HomePage;
