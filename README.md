# 🏥 BookMyDoc - Book My Doctor

**Modern healthcare appointment booking platform with integrated medicine store** built with Next.js, featuring virtual consultations, in-person visits, pharmacy integration, and seamless doctor-patient connections.
<div style="border-left: 2px solid gray; padding-left: 10px;">
<span style="font-weight:bold;">⚠️ IMPORTANT DEVELOPMENT NOTICE:</span> This application is currently under active development. Many features, including the complete medicine store functionality, are not yet implemented or fully functional. Please see the "Development Status" section below for details.
</div>

## 🌐 Live Demo

**Try BookMyDoc now:**  [book-my-doctor-two.vercel.app](https://book-my-doctor-two.vercel.app/)

<div style="border-left: 2px solid gray; padding-left: 10px;">
<span style="font-weight:bold;">🚧 Demo Limitations:</span>  The live demo showcases core appointment booking functionality. Medicine store and several advanced features are placeholder implementations only.
</div>

## 🚧 Development Status

### ✅ Fully Implemented & Working

- 👨‍⚕️ Doctor Discovery & Profiles - Complete with search and filtering
- 📅 Appointment Booking System - Full scheduling with real-time availability
- 🔐 User Authentication - Secure login/signup with Clerk
- 💳 Payment Processing - Stripe integration for appointments
- 📹 Virtual Consultations - ZegoCloud video call setup
- 📱 Responsive UI - Complete design system with Tailwind CSS

### 🛠️ Partially Implemented

- 💊 Medicine Store UI - Basic interface and components built
- 📋 Prescription Management - Frontend components ready
- 🛒 Shopping Cart - UI implemented, backend pending
- 📦 Order Management - Basic structure in place

### ❌ Not Yet Implemented

- 💊 Medicine Inventory System - Backend database and management
- 📋 Prescription Validation - Digital prescription processing
- 🚚 Delivery Integration - Shipping and tracking services
- 📊 Pharmacy Dashboard - Inventory and order management
- 🔔 Medicine Notifications - Stock alerts and reminders
- 💊 Drug Interaction Checks - Safety validation system

## ✨ Features

### 🎯 Core Functionality (WORKING)

- 👨‍⚕️ Smart Doctor Discovery - Find specialists based on location, availability, and expertise
- 📅 Flexible Scheduling - Book virtual or in-person appointments with real-time availability
- 💳 Secure Payments - Integrated Stripe payment processing for appointments
- 📹 Virtual Consultations - Built-in video calling powered by ZegoCloud
- 📱 Responsive Design - Optimized for desktop, tablet, and mobile devices

### 🏪 Medicine Store Features (UNDER DEVELOPMENT)

#### ⚠️ These features are currently in development and not functional

- 💊 Comprehensive Pharmacy - Wide range of medicines and healthcare products
- 📋 Prescription Management - Digital prescription handling and verification
- 🚚 Delivery Tracking - Real-time order tracking and delivery updates
- 💊 Medicine Search - Smart search with categories and filters
- 📦 Inventory Management - Real-time stock availability and updates
- 🎯 Prescription Upload - Easy prescription upload for required medications

### 🔐 Authentication & Security (WORKING)

- 🔒 Secure Authentication - Powered by Clerk for robust user management
- 🛡️ Verified Doctors - Comprehensive doctor verification and profile management
- 🔐 Secure Data - Firestore database with proper access controls

## 📸 Screenshots

<div align="center">
  <img src="https://github.com/hellman53/book_my_doctor/blob/d4d799367ab02a8447e8a60aadd3093dac2dac56/public/preview.png" alt="Preview" width="600"/>
</div>


## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Firebase Project with Firestore enabled
- Clerk Account for authentication
- Stripe Account for payments
- ZegoCloud Account for video calls

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/book-my-doctor.git
cd book-my-doctor
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# backend/.env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=""

# Clerk Webhook Secret (you'll need to get this from your Clerk dashboard)
# Instructions: Go to Clerk Dashboard -> Webhooks -> Create Endpoint -> Copy the secret
CLERK_WEBHOOK_SECRET=your_webhook_secret_here


# Stripe Payment Gateway Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
# Stripe Webhook Secret (for production)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# ZegoCloud Video Calling api keys
NEXT_PUBLIC_ZEGOCLOUD_APP_ID=""
NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET=""

# Firebase Api Keys
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

```

### 3. Install Dependencies & Build

```bash
# Install all dependencies and build frontend
npm install
```

### 4. Start Development Server

```bash
# Start with hot reload (recommended)
npm run dev
```

🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) to see BookMyDoc in action.

<div style="border-left: 2px solid gray; padding-left: 10px;">
<span style="font-weight:bold;">📝 Note:</span>  The medicine store sections will show placeholder content as these features are still in development.
</div>


---

<div align="center">
  <p>Built with ❤️ using React, Node.js, and Google AI</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
