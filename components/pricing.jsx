"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { PricingTable } from "@clerk/nextjs";

const Pricing = () => {
  return (
    <Card className="">
      <CardContent className="p-6 md:p-8">
        <PricingTable
          appearance={{
            variables: {
              colorPrimary: "#059669", // emerald-600
              colorText: "#111827", // gray-900
              fontFamily: "Inter, sans-serif",
              borderRadius: "1rem",
            },
            elements: {
              root: "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto",
              planCard:
                "relative border border-emerald-200 shadow-lg bg-white rounded-2xl transition-all",
              planCard__popular:
                "ring-2 ring-emerald-500/50 scale-105 z-[200]",
              planCardHeader: "pb-4 text-center",
              planName: "text-xl font-bold text-gray-900",
              planPrice: "text-3xl font-bold text-emerald-400",
              planInterval: "text-muted-foreground ml-1",
              planDescription: "text-sm text-gray-600",
              planFeature: "flex items-start text-gray-600",
              planFeatureIcon:
                "h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0",
              planButton:
                "w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center justify-center gap-2 py-2",
              planButton__popular:
                "w-full bg-emerald-600 hover:bg-emerald-700 text-white",
              popularBadge:
                "absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium z-[200]",
            },
          }}
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: "z-[2000]", // keep checkout modal on top
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Pricing;
