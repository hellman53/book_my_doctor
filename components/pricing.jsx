"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, CreditCard } from "lucide-react";
// Import PricingTable conditionally to avoid errors when billing is disabled
// import { PricingTable } from "@clerk/nextjs";

const Pricing = () => {
  const [showClerkPricing, setShowClerkPricing] = useState(false);

  // Fallback pricing plans when Clerk billing is disabled
  const pricingPlans = [
    {
      name: "Basic",
      price: "$19",
      period: "/month",
      description: "Perfect for individuals",
      features: [
        "5 consultation credits",
        "Basic video calls",
        "Email support",
        "Health record storage"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "$39",
      period: "/month",
      description: "Great for families",
      features: [
        "15 consultation credits",
        "HD video calls",
        "Priority support",
        "Advanced health analytics",
        "Family member accounts"
      ],
      popular: true
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "For healthcare professionals",
      features: [
        "Unlimited consultations",
        "Professional tools",
        "24/7 support",
        "API access",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {pricingPlans.map((plan, index) => (
        <Card 
          key={index}
            className={`relative border-emerald-200 shadow-lg bg-white ${
            plan.popular ? 'ring-2 ring-emerald-500/50 scale-105' : ''
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white px-3 py-1">
                Most Popular
              </Badge>
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 text-center">
              {plan.name}
            </CardTitle>
            <div className="text-center">
              <span className="text-3xl font-bold text-emerald-400">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {plan.description}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full ${
                plan.popular 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700'
              }`}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Choose Plan
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Uncomment this section when Clerk billing is enabled
  /*
  return (
    <Card className="border-emerald-900/30 shadow-lg bg-gradient-to-b from-emerald-950/30 to-transparent">
      <CardContent className="p-6 md:p-8">
        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
  */
};

export default Pricing;
