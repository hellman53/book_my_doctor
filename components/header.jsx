"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import { Calendar, ShieldCheck, Stethoscope } from "lucide-react";

const Header = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, synced, error
  const [userData, setUserData] = useState();
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

  return (
    <header className="fixed top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo-single.png"
            alt="BookMyDoc"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center space-x-2">
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>

            {userData?.role === "patient" && (
              <Link href="/appointments">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
              </Link>
            )}

            {userData?.role === "doctor-pending" && (
              <Link href="/appointments">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
              </Link>
            )}

            {userData?.role === "admin" && (
              <Link href="/admin-dashboard">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}

            {userData?.role === "doctor" && (
              <Link href="/doctor-dashboard">
                <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
