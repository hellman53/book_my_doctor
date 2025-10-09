"use client";
import React from 'react';
import Link from 'next/link';
import FloatingActionButton from "@/components/HomeComponent/FloatingActionButton"
import { Scale, FileText, AlertTriangle, Users, CreditCard, Shield } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: `By accessing or using BookMyDoc's healthcare platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our services.`
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Accounts & Responsibilities",
      content: `You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Provide accurate and complete information for healthcare services.`
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Healthcare Services Disclaimer",
      content: `BookMyDoc facilitates connections between patients and healthcare providers. We are not a healthcare provider and do not practice medicine. All medical advice, diagnosis, and treatment are provided by licensed healthcare professionals. Emergency situations require immediate in-person medical attention.`
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payments & Refunds",
      content: `Consultation fees are clearly displayed before booking. Payments are processed securely through our payment partners. Refunds are subject to our cancellation policy and healthcare provider availability. Credit packages are non-refundable but transferable within family accounts.`
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Intellectual Property",
      content: `All content on BookMyDoc, including logos, text, graphics, and software, is our property or licensed to us and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.`
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: `BookMyDoc shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services. Our total liability shall not exceed the amount paid by you for services in the past six months.`
    }
  ];

  const policies = [
    {
      title: "Cancellation Policy",
      points: [
        "Cancel appointments at least 24 hours in advance for full refund",
        "50% refund for cancellations within 24 hours",
        "No refund for missed appointments without prior notice"
      ]
    },
    {
      title: "Prescription Policy",
      points: [
        "Prescriptions are issued at the discretion of healthcare providers",
        "Controlled substances require in-person consultation",
        "Prescription validity period: 30 days from issue date"
      ]
    },
    {
      title: "Data Usage Policy",
      points: [
        "Health data used only for treatment purposes",
        "Anonymized data may be used for research and improvement",
        "You control data sharing preferences in your account settings"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 py-12 mt-16">
      <FloatingActionButton />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              ⚖️ Legal Terms
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Effective date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg mb-8">
          <p className="text-gray-700 leading-relaxed text-center">
            Please read these Terms of Service carefully before using BookMyDoc's healthcare platform. 
            These terms govern your access to and use of our services, including website, mobile applications, 
            and healthcare services.
          </p>
        </div>

        {/* Main Terms Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Policies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Additional Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {policy.title}
                </h3>
                <ul className="space-y-3">
                  {policy.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notices */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 shadow-lg mb-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">
                Important Medical Disclaimer
              </h3>
              <p className="text-amber-700 leading-relaxed">
                <strong>For Medical Emergencies:</strong> In case of a medical emergency, 
                please call your local emergency number immediately or go to the nearest 
                emergency room. BookMyDoc is not designed for emergency medical situations.
              </p>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Governing Law & Dispute Resolution
          </h3>
          <div className="text-gray-700 space-y-4">
            <p>
              These Terms shall be governed by the laws of [Your Country/State] without 
              regard to its conflict of law provisions. Any disputes arising from these 
              Terms or your use of our services shall be resolved through binding 
              arbitration in accordance with the rules of the American Arbitration Association.
            </p>
            <p>
              We encourage you to contact us first if you have any concerns about our 
              services. We are committed to resolving disputes amicably and efficiently.
            </p>
          </div>
        </div>

        {/* Contact & Navigation */}
        <div className="mt-12 space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Questions About Our Terms?
            </h3>
            <p className="text-gray-700 text-center mb-4">
              Contact our legal team for any questions regarding these Terms of Service.
            </p>
            <div className="text-center text-sm text-gray-600">
              <strong>Email:</strong> legal@bookmydoc.com | 
              <strong> Phone:</strong> +1 (555) 123-LEGAL
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
            <Link 
              href="/privacy-policy"
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors mb-4 sm:mb-0"
            >
              ← Privacy Policy
            </Link>
            <div className="flex space-x-4">
              <Link 
                href="/"
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;