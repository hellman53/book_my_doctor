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

const Header = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, synced, error
  const [userData, setUserData] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        console.log("new user data (before set):", newUser);
      }
    };

    syncUserData();

    // const userData = await getUserFromFirestore(user.id)
    // console.log(userData)
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
          <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/doctors" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
            <Users className="h-4 w-4" />
            <span>Find Doctors</span>
          </Link>
          <Link href="/ai-assistant" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>AI Assistant</span>
          </Link>
          <Link href="/about" className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
            <Heart className="h-4 w-4" />
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
              <Link href="/appointments">
                <Button variant="outline" className="hidden lg:inline-flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
              </Link>
            )}

            {userData?.role === "doctor-pending" && (
              <Link href="/appointments">
                <Button variant="outline" className="hidden lg:inline-flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
              </Link>
            )}

            {userData?.role === "admin" && (
              <Link href="/admin-dashboard">
                <Button variant="outline" className="hidden lg:inline-flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}

            {userData?.role === "doctor" && (
              <Link href="/doctor-dashboard">
                <Button variant="outline" className="hidden lg:inline-flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <Stethoscope className="h-4 w-4" />
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
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/search-doctors')}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Find Doctors</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/medical-chat')}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>AI Assistant</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/about')}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
              >
                <Heart className="h-5 w-5" />
                <span>About</span>
              </button>

              {/* Mobile Role-based Actions */}
              <SignedIn>
                {userData?.role === "patient" && (
                  <button
                    onClick={() => handleNavigation('/appointments')}
                    className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>My Appointments</span>
                  </button>
                )}
                
                {userData?.role === "admin" && (
                  <button
                    onClick={() => handleNavigation('/admin-dashboard')}
                    className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                
                {userData?.role === "doctor" && (
                  <button
                    onClick={() => handleNavigation('/doctor-dashboard')}
                    className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                  >
                    <Stethoscope className="h-5 w-5" />
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
