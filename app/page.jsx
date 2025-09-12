"use client"
import React, { useState } from "react";
import { db } from "./firebase/config";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
// import { Badge } from "lucide-react";
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { creditBenefits, features } from "@/lib/data";
import { Card, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";



const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "message"), {
        name,
        email,
        message
      });
      console.log("Document written with ID:", docRef.id);

      // clear form after submit
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
      <div className="bg-background">
        <section className="relative overflow-hidden py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge variant="outline"
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium"
                >Health made simple</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Connect with Doctors <br/>{" "}
                   <span className="gradient font-bold text-transparant bg-clip-text pb-1 pr-2">anytime, anywhere</span>
                   </h1>
                   <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                    Book appointments, consult via video and manage your heakthcare journey
                     all in one secure platform.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                      asChild 
                      size="lg"
                      className="bg-emerald-600 text-white hover:bg-emerald-700">
                        <Link href={'/onboarding'}>
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                      asChild 
                      size="lg" 
                      variant="outline"
                      className="border-emerald-700/30 hover:bg-muted/80">
                        <Link href={'/doctor'}>
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                     </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                      <Image 
                      src="/banner2.png" 
                      alt="Doctor Consultation"
                      fill
                      priority
                      className="object-cover md:pt-14 rounded-xl"/>
                     </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our platform makes healthcare accessible with just few clicks</p>
          </div>
          <div className="grid grid-cols-1 md:gird-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index)=>{
              return(
              <Card 
              key={index}
              className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
  <CardHeader className="pb-2">
    <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-3">
      {feature.icon}
      </div>
      <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">
      {feature.description}
      </p>
  </CardContent>

</Card>
)
            })}
          </div>
          </div>
          </section>

          <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
             className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4">
              Affordable Healthcare</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Consultation Packages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Choose the perfect consultation package that fits your healthcare needs</p>
          </div>
          <div>
            {/* pricing table */}


            <Card className="mt-12 bg-muted/20 border-emerald-900/30">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-white flex items-center">
      <Stethoscope className="h-5 w-5 mr-2 text-emerald-400"/>How our Credit System Works</CardTitle>
  </CardHeader>
  <CardContent>
   <ul className="space-y-3">
    {creditBenefits.map((benefit, index)=>{
      return(
        <li key={index}
        className="flex items-start">
          <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full">
            <Check className="h-4 w-4 text-emerald-400"/> 
          </div>
          <p
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{__html:benefit}}
            />
        </li>
      )
    })}
   </ul>
  </CardContent>
</Card>
          </div>
          </div>
          </section>
      </div>
  );
}

export default Home;