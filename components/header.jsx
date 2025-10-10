"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserFromFirestore } from "@/lib/firebase-users";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { 
  Calendar, 
  ShieldCheck, 
  Stethoscope, 
  Search, 
  Menu, 
  X, 
  Home,
  Users,
  MessageCircle,
  Phone,
  Heart,
  Star
} from "lucide-react";

import { usePathname } from 'next/navigation';

const Header = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, synced, error
  const [userData, setUserData] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to check if a link is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Active link styles
  const activeLinkClass = "text-emerald-600";
  const inactiveLinkClass = "text-gray-700 hover:text-emerald-600";
  const activeIconClass = "text-emerald-600";
  const inactiveIconClass = "text-gray-700 group-hover:text-emerald-600";

  useEffect(() => {
    const syncUserData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        return;
      }
      setSyncStatus("syncing");

      // Check if user already exists in Firestore
      const existingUser = await getUserFromFirestore(user.id);

      if (existingUser) {
        // Transform Clerk user data to our format
        const newUser = {
          id: existingUser.id,
          email: existingUser.primaryEmailAddress?.emailAddress || "",
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role || ""   // store full array
        };

        setUserData(newUser);
        // console.log("new user data (before set):", newUser);
      }
    };

    syncUserData();
  }, [user, isSignedIn, isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-doctors?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-lg z-50 shadow-sm">
      <nav className="container mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Stethoscope className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="font-bold text-xl text-gray-900">BookMyDoc</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`flex items-center space-x-2 transition-colors group ${
              isActiveLink('/') ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <Home className={`h-4 w-4 transition-colors ${
              isActiveLink('/') ? activeIconClass : inactiveIconClass
            }`} />
            <span>Home</span>
          </Link>
          
          <Link 
            href="/doctors" 
            className={`flex items-center space-x-2 transition-colors group ${
              isActiveLink('/doctors') ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <Users className={`h-4 w-4 transition-colors ${
              isActiveLink('/doctors') ? activeIconClass : inactiveIconClass
            }`} />
            <span>Find Doctors</span>
          </Link>
          
          <Link 
            href="/ai-assistant" 
            className={`flex items-center space-x-2 transition-colors group ${
              isActiveLink('/ai-assistant') ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <MessageCircle className={`h-4 w-4 transition-colors ${
              isActiveLink('/ai-assistant') ? activeIconClass : inactiveIconClass
            }`} />
            <span>AI Assistant</span>
          </Link>
          
          <Link 
            href="/about" 
            className={`flex items-center space-x-2 transition-colors group ${
              isActiveLink('/about') ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <Heart className={`h-4 w-4 transition-colors ${
              isActiveLink('/about') ? activeIconClass : inactiveIconClass
            }`} />
            <span>About</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            {/* Role-based navigation */}
            {userData?.role === "patient" && (
              <Link href="/my-appointments">
                <Button 
                  variant="outline" 
                  className={`hidden lg:inline-flex items-center gap-2 border-emerald-300 ${
                    isActiveLink('/my-appointments') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400' 
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Calendar className={`h-4 w-4 ${
                    isActiveLink('/my-appointments') ? 'text-emerald-600' : ''
                  }`} />
                  My Appointments
                </Button>
              </Link>
            )}

            {userData?.role === "doctor-pending" && (
              <Link href="/my-appointments">
                <Button 
                  variant="outline" 
                  className={`hidden lg:inline-flex items-center gap-2 border-emerald-300 ${
                    isActiveLink('/appointments') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400' 
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Calendar className={`h-4 w-4 ${
                    isActiveLink('/appointments') ? 'text-emerald-600' : ''
                  }`} />
                  My Appointments
                </Button>
              </Link>
            )}

            {userData?.role === "admin" && (
              <Link href="/admin-dashboard">
                <Button 
                  variant="outline" 
                  className={`hidden lg:inline-flex items-center gap-2 border-emerald-300 ${
                    isActiveLink('/admin-dashboard') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400' 
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <ShieldCheck className={`h-4 w-4 ${
                    isActiveLink('/admin-dashboard') ? 'text-emerald-600' : ''
                  }`} />
                  Admin Dashboard
                </Button>
              </Link>
            )}

            {userData?.role === "doctor" && (
              <Link href="/doctor-dashboard">
                <Button 
                  variant="outline" 
                  className={`hidden lg:inline-flex items-center gap-2 border-emerald-300 ${
                    isActiveLink('/doctor-dashboard') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400' 
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Stethoscope className={`h-4 w-4 ${
                    isActiveLink('/doctor-dashboard') ? 'text-emerald-600' : ''
                  }`} />
                  Doctor Dashboard
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-12 w-12",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search doctors, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <button
                onClick={() => handleNavigation('/')}
                className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                  isActiveLink('/') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Home className={`h-5 w-5 ${
                  isActiveLink('/') ? 'text-emerald-600' : ''
                }`} />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/doctors')}
                className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                  isActiveLink('/doctors') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Users className={`h-5 w-5 ${
                  isActiveLink('/doctors') ? 'text-emerald-600' : ''
                }`} />
                <span>Find Doctors</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/ai-assistant')}
                className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                  isActiveLink('/ai-assistant') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <MessageCircle className={`h-5 w-5 ${
                  isActiveLink('/ai-assistant') ? 'text-emerald-600' : ''
                }`} />
                <span>AI Assistant</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/about')}
                className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                  isActiveLink('/about') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${
                  isActiveLink('/about') ? 'text-emerald-600' : ''
                }`} />
                <span>About</span>
              </button>

              {/* Mobile Role-based Actions */}
              <SignedIn>
                {userData?.role === "patient" && (
                  <button
                    onClick={() => handleNavigation('/appointments')}
                    className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                      isActiveLink('/appointments') 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <Calendar className={`h-5 w-5 ${
                      isActiveLink('/appointments') ? 'text-emerald-600' : ''
                    }`} />
                    <span>My Appointments</span>
                  </button>
                )}
                
                {userData?.role === "admin" && (
                  <button
                    onClick={() => handleNavigation('/admin-dashboard')}
                    className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                      isActiveLink('/admin-dashboard') 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <ShieldCheck className={`h-5 w-5 ${
                      isActiveLink('/admin-dashboard') ? 'text-emerald-600' : ''
                    }`} />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                
                {userData?.role === "doctor" && (
                  <button
                    onClick={() => handleNavigation('/doctor-dashboard')}
                    className={`flex items-center space-x-3 w-full p-3 text-left rounded-xl transition-colors ${
                      isActiveLink('/doctor-dashboard') 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <Stethoscope className={`h-5 w-5 ${
                      isActiveLink('/doctor-dashboard') ? 'text-emerald-600' : ''
                    }`} />
                    <span>Doctor Dashboard</span>
                  </button>
                )}
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;