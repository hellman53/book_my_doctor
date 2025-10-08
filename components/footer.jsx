"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Shield,
  Clock,
  Users,
  Warehouse,
  Truck,
} from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-800 text-white">
      <div className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Stethoscope className="h-6 w-6 text-emerald-300" />
              </div>
              <div className="font-bold text-2xl">BookMyDoc</div>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              Your trusted healthcare partner providing quality medical services
              with modern technology. Connecting patients with verified doctors
              nationwide.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-emerald-300">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/search-doctors"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Find Doctors</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/medical-chat"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>AI Assistant</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-emerald-300">
              Our Services
            </h3>
            <ul className="space-y-3">
              <li className="text-emerald-100 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span>General Medicine</span>
              </li>

              <li className="text-emerald-100 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span>Pediatrics</span>
              </li>

              <li className="text-emerald-100 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span>Virtual Consultations</span>
              </li>
              <li className="text-emerald-100 flex items-center space-x-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span>Emergency Care</span>
              </li>
              <li className="text-emerald-100 flex items-center space-x-2">
                <Link
                  href="/doctor-form"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Stethoscope className="h-4 w-4 text-emerald-400" />
                  <span className="">Register as Doctor</span>
                </Link>
              </li>
              <li className="text-emerald-100 flex items-center space-x-2">
                <Link
                  href="/"
                  className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Truck className="h-4 w-4 text-emerald-400" />
                  <span>Register as Distributor</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-emerald-300">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-emerald-100">123 Healthcare Street</div>
                  <div className="text-emerald-200 text-sm">
                    Gorakhpur, UP 273001
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <div className="text-emerald-100">+91 (555) 123-4567</div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <div className="text-emerald-100">info@bookmydoc.com</div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-emerald-100">24/7 Emergency</div>
                  <div className="text-emerald-200 text-sm">
                    Always available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        {/* <div className="mt-12 pt-8 border-t border-emerald-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="h-6 w-6 text-emerald-400" />
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <div className="text-emerald-200 text-sm">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="h-6 w-6 text-emerald-400" />
                <span className="text-2xl font-bold text-white">50K+</span>
              </div>
              <div className="text-emerald-200 text-sm">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Stethoscope className="h-6 w-6 text-emerald-400" />
                <span className="text-2xl font-bold text-white">1000+</span>
              </div>
              <div className="text-emerald-200 text-sm">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-6 w-6 text-emerald-400" />
                <span className="text-2xl font-bold text-white">24/7</span>
              </div>
              <div className="text-emerald-200 text-sm">Support Available</div>
            </div>
          </div>
        </div> */}

        {/* Bottom Copyright */}
        <div className="mt-8 pt-2 border-t border-emerald-700 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-emerald-200">
              &copy; {year ? year : ""} BookMyDoc. All rights reserved.
            </div>
            <div className="text-emerald-200 text-sm">
              Designed & Developed with ❤️ by{" "}
              <span className="text-emerald-300 font-semibold">Angle270</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
