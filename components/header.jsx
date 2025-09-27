"use client"
import Link from "next/link";

import Image from "next/image";
import React from "react";
import { useUser } from "@clerk/nextjs";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

const Header = () => {
  const { user } = useUser();
  console.log(user)
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
              <Button variant="secondary">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-12 w-12",
                  userButtonPopoverCard:"shadow-xl",
                  userPreviewMainIdentifier: "font-semibold"
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
