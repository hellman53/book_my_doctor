"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="text-center py-4">
      <div className="container mx-auto px-4">
        <p>
          &copy; {year ? year : ""} BookMyDoc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
