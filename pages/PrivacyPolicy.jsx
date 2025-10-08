"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, date of birth, gender",
        "Health Information: Medical history, symptoms, prescriptions, diagnostic reports",
        "Payment Information: Billing address, payment method details (securely processed)",
        "Technical Information: IP address, browser type, device information, usage data"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "Provide healthcare services and facilitate doctor consultations",
        "Process payments and manage your account",
        "Send appointment reminders and health updates",
        "Improve our services and user experience",
        "Comply with legal obligations and healthcare regulations"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection & Security",
      content: [
        "End-to-end encryption for all health data and communications",
        "HIPAA compliant data storage and processing",
        "Regular security audits and vulnerability assessments",
        "Access controls and authentication protocols",
        "Data anonymization for research and analytics"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Your Rights & Choices",
      content: [
        "Access and download your personal health records",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Control data sharing preferences"
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Third-Party Sharing",
      content: [
        "Healthcare providers for treatment purposes",
        "Payment processors for transaction handling",
        "Legal authorities when required by law",
        "Analytics services (anonymized data only)",
        "Emergency services in life-threatening situations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              🔒 Privacy & Security
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg mb-8">
          <p className="text-gray-700 leading-relaxed">
            At BookMyDoc, we are committed to protecting your privacy and ensuring the security of your 
            personal and health information. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our healthcare platform.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
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
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3" />
                          <span className="text-gray-700 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal health information as required by healthcare regulations 
              and for as long as necessary to provide our services. You can request deletion 
              of your account at any time, subject to legal requirements.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Updates</h3>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of any 
              significant changes via email or through our platform. Continued use of our 
              services after changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100 shadow-lg mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Contact Our Privacy Team
          </h3>
          <p className="text-gray-700 text-center mb-6">
            If you have any questions about this Privacy Policy or our data practices, 
            please contact our Privacy Officer:
          </p>
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <div className="text-sm text-gray-600">
                <strong>Email:</strong> privacy@bookmydoc.com
              </div>
              <div className="text-sm text-gray-600">
                <strong>Phone:</strong> +1 (555) 123-HELP
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors mb-4 sm:mb-0"
          >
            ← Back to Home
          </Link>
          <Link 
            href="/terms-of-service"
            className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;