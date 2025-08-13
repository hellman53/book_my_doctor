import { Inter } from "next/font/google";
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
    <html lang="en">
      <body className={`${inter.variable}`} >
        {/* header */}

        <main className="min-h-screen"> 
          {children}
        </main>

        {/* footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <div className="container mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} BookMyDoc. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
