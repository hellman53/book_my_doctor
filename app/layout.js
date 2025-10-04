import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { neobrutalism } from '@clerk/themes'
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UserSyncProvider from "@/components/UserSyncProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata = {
  title: "BookMyDoc - Book My Doctor",
  description: "Book your doctor appointments easily",
  other: {
    "format-detection": "telephone=no, date=no, email=no, address=no"
  },
    icons: {
    icon: "/logo-single.png",          // default
    shortcut: "/logo-single.png",
    apple: "/logo-single.png", // optional, if you add it
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable}`} suppressHydrationWarning>

          <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
            <UserSyncProvider>
              {/* header */}
              <Header />

              <main className="min-h-screen"> 
                {children}
              </main>

              {/* footer */}
              {/* <footer className="text-center py-4">
                <div className="container mx-auto px-4">
                  <p suppressHydrationWarning>&copy; {new Date().getFullYear()} BookMyDoc. All rights reserved.</p>
                </div>
              </footer> */}
              <Footer />

              {/* 🔥 global toast container */}
              <Toaster reverseOrder={false} /> 
              {/* position="top-right"  */}

            </UserSyncProvider>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
