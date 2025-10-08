"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { db } from "@/app/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Search, HelpCircle, Send, User, Phone, CreditCard, Calendar, MessageCircle } from 'lucide-react';

const TechnicalSupport = () => {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    issueType: '',
    title: '',
    description: '',
    transactionId: '',
    doctorName: '',
    appointmentDate: '',
    amount: '',
    contactNumber: '',
    email: '',
    additionalDetails: ''
  });

  // List of 25 common issues
  const issueTypes = [
    "Unable to book doctor appointment",
    "Payment failed during booking",
    "Payment successful but booking not confirmed",
    "Doctor not found in search",
    "Cannot select preferred time slot",
    "Website/app loading slowly",
    "Error during video consultation",
    "Prescription not received",
    "Medicine delivery delayed",
    "Account login issues",
    "Forgot password reset not working",
    "Profile information not updating",
    "Notification not received",
    "Appointment reminder not working",
    "Credit balance issue",
    "Refund not processed",
    "Doctor cancelled appointment",
    "Rescheduling not working",
    "Medical records not accessible",
    "Prescription upload failed",
    "Family member addition issue",
    "Subscription plan problem",
    "Coupon code not applying",
    "Location services not working",
    "General technical issue",
    "Feedback/Suggestion",
    "Other issue not listed"
  ];

  const filteredIssues = issueTypes.filter(issue =>
    issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form when issue type changes
  useEffect(() => {
    if (formData.issueType) {
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        transactionId: '',
        doctorName: '',
        appointmentDate: '',
        amount: '',
        contactNumber: '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        additionalDetails: ''
      }));
    }
  }, [formData.issueType, user]);

  // Check if user is logged in
  useEffect(() => {
    if (isLoaded && !user) {
      toast.error('Please log in to submit a support ticket');
    }
  }, [isLoaded, user]);

  // Dynamic fields based on issue type
  const getDynamicFields = () => {
    const fields = [];

    // Common fields for all issues
    fields.push(
      {
        name: 'title',
        label: 'Issue Title',
        type: 'text',
        placeholder: 'Brief title describing your issue',
        required: true,
        icon: <MessageCircle className="w-5 h-5" />
      },
      {
        name: 'description',
        label: 'Detailed Description',
        type: 'textarea',
        placeholder: 'Please describe your issue in detail...',
        required: true,
        icon: <HelpCircle className="w-5 h-5" />
      }
    );

    // Payment related issues
    if (formData.issueType.includes('Payment') || formData.issueType.includes('Refund')) {
      fields.push(
        {
          name: 'transactionId',
          label: 'Transaction ID',
          type: 'text',
          placeholder: 'Enter your transaction ID',
          required: true,
          icon: <CreditCard className="w-5 h-5" />
        },
        {
          name: 'amount',
          label: 'Transaction Amount',
          type: 'text',
          placeholder: 'Enter the transaction amount',
          required: true,
          icon: <CreditCard className="w-5 h-5" />
        }
      );
    }

    // Booking related issues
    if (formData.issueType.includes('book') || formData.issueType.includes('appointment')) {
      fields.push(
        {
          name: 'doctorName',
          label: 'Doctor Name',
          type: 'text',
          placeholder: 'Enter doctor name you tried to book',
          required: true,
          icon: <User className="w-5 h-5" />
        },
        {
          name: 'appointmentDate',
          label: 'Appointment Date & Time',
          type: 'datetime-local',
          placeholder: 'Select appointment date and time',
          required: true,
          icon: <Calendar className="w-5 h-5" />
        }
      );
    }

    // Contact information
    fields.push(
      {
        name: 'contactNumber',
        label: 'Contact Number',
        type: 'tel',
        placeholder: 'Your contact number for updates',
        required: false,
        icon: <Phone className="w-5 h-5" />
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Your email for updates',
        required: false,
        value: user?.primaryEmailAddress?.emailAddress || '',
        icon: <MessageCircle className="w-5 h-5" />
      },
      {
        name: 'additionalDetails',
        label: 'Additional Information',
        type: 'textarea',
        placeholder: 'Any other details that might help us resolve your issue faster...',
        required: false,
        icon: <HelpCircle className="w-5 h-5" />
      }
    );

    return fields;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit a support ticket');
      return;
    }

    if (!formData.issueType) {
      toast.error('Please select an issue type');
      return;
    }

    setIsSubmitting(true);

    try {
      const supportData = {
        ...formData,
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress,
        userName: user.fullName,
        status: 'open',
        priority: getPriorityLevel(formData.issueType),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "technicalSupport"), supportData);
      
      toast.success('Support ticket submitted successfully! We will get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        issueType: '',
        title: '',
        description: '',
        transactionId: '',
        doctorName: '',
        appointmentDate: '',
        amount: '',
        contactNumber: '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        additionalDetails: ''
      });
      setSearchTerm('');

      console.log("Support ticket created with ID: ", docRef.id);

    } catch (error) {
      console.error("Error submitting support ticket: ", error);
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine priority based on issue type
  const getPriorityLevel = (issueType) => {
    const highPriorityIssues = [
      'Payment failed during booking',
      'Payment successful but booking not confirmed',
      'Doctor cancelled appointment',
      'Refund not processed'
    ];
    
    const mediumPriorityIssues = [
      'Unable to book doctor appointment',
      'Error during video consultation',
      'Prescription not received',
      'Medicine delivery delayed',
      'Credit balance issue'
    ];

    if (highPriorityIssues.includes(issueType)) return 'high';
    if (mediumPriorityIssues.includes(issueType)) return 'medium';
    return 'low';
  };

  // Check if form is valid
  const isFormValid = () => {
    const dynamicFields = getDynamicFields();
    const requiredFields = dynamicFields.filter(field => field.required);
    
    return requiredFields.every(field => {
      const value = formData[field.name];
      return value && value.trim() !== '';
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-blue-50 py-12 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-semibold px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700">
              🛠️ Technical Support
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Technical Support
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            We're here to help! Describe your issue and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* User Info Banner */}
        {user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg mb-8">
            <div className="flex items-center space-x-4">
              <img 
                src={user.imageUrl} 
                alt={user.fullName || 'User'} 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user.fullName || 'User'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Support Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Issue Type Dropdown with Search */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  What type of issue are you facing? *
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for your issue..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>
                  
                  {searchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredIssues.length > 0 ? (
                        filteredIssues.map((issue, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, issueType: issue }));
                              setSearchTerm('');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                          >
                            {issue}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No issues found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Issue Display */}
                {formData.issueType && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-emerald-700 font-semibold">
                      Selected: {formData.issueType}
                    </p>
                  </div>
                )}

                {/* Quick Issue Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {['Payment failed during booking', 'Unable to book doctor appointment', 'Doctor not found in search', 'General technical issue'].map((quickIssue) => (
                    <button
                      key={quickIssue}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, issueType: quickIssue }))}
                      className="text-left px-4 py-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded-xl transition-all duration-300 hover:border-emerald-300 text-sm"
                    >
                      {quickIssue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Form Fields */}
              {formData.issueType && (
                <div className="space-y-6 border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Issue Details
                  </h3>
                  
                  {getDynamicFields().map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          {field.icon}
                        </div>
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            rows={4}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting || !user}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Support Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg text-center">
            <Phone className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm">+1 (555) 123-HELP</p>
            <p className="text-gray-500 text-xs">Mon-Sun, 9AM-9PM</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg text-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm">support@bookmydoc.com</p>
            <p className="text-gray-500 text-xs">24/7 Response</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg text-center">
            <HelpCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
            <p className="text-gray-600 text-sm">Within 24 Hours</p>
            <p className="text-gray-500 text-xs">For all queries</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: "How long does it take to resolve payment issues?",
                a: "Payment issues are typically resolved within 2-4 hours during business hours."
              },
              {
                q: "Can I track my support ticket?",
                a: "Yes, you'll receive a ticket ID and can email us for updates."
              },
              {
                q: "What information should I provide for booking issues?",
                a: "Please provide doctor name, appointment date/time, and any error messages you received."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupport;