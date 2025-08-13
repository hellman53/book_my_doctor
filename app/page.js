import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="flex flex-col justify-center items-center h-screen py-4">
      <h1 className="text-4xl font-bold mb-4">Book My Doctor</h1>
      <Button>Book Appointment</Button>
    </div>
    </>
  );
}