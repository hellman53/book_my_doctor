import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`} >

        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >

        {/* header */}

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
  );
}
