"use client";
import React, {useState} from 'react';
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";
import {
  Grid2X2,
} from "lucide-react";


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
      onClick: () => router.push("/ai-assistant"),
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

export default FloatingActionButton;