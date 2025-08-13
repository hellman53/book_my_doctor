import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/themes'
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata = {
  title: "BookMyDoc - Book My Doctor",
  description: "Book your doctor appointments easily",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme: [dark]}}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable}`} >

          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >

          {/* header */}
          <Header />

          <main className="min-h-screen"> 
            {children}
          </main>

          {/* footer */}
          <footer className="text-center py-4">
            <div className="container mx-auto px-4">
              <p>&copy; {new Date().getFullYear()} BookMyDoc. All rights reserved.</p>
            </div>
          </footer>

            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
