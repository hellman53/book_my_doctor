"use client";

import { useState, useEffect } from "react";
import { submitDoctorApplication } from "@/lib/firebase-users";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FloatingActionButton from "@/components/HomeComponent/FloatingActionButton";

// Medical specializations
const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Neurologist",
  "Psychiatrist",
  "Dentist",
  "Ophthalmologist",
  "ENT Specialist",
  "Urologist",
  "Gastroenterologist",
  "Endocrinologist",
  "Oncologist",
  "Pulmonologist",
  "Rheumatologist",
  "Nephrologist",
  "Anesthesiologist",
  "Radiologist",
  "Emergency Medicine",
  "Family Medicine",
  "Internal Medicine",
  "Plastic Surgeon",
  "Neurosurgeon",
  "Sports Medicine"
].map((s) => ({ value: s, label: s }));

// Days of the week
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Custom styles for react-select
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#10b981' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#10b981'
    },
    minHeight: '44px',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4'
    }
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '14px'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#374151',
    fontSize: '14px'
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  }),
  menuList: (provided) => ({
    ...provided,
    borderRadius: '8px',
    padding: '4px 0'
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: '#e5e7eb'
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#10b981' : '#6b7280',
    '&:hover': {
      color: '#10b981'
    }
  })
};

export default function DoctorForm() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: null,
    experience: "",
    qualifications: "",
    licenseNumber: "",
    clinicName: "",
    clinicAddress: "",
    consultationFee: "",
    availability: [], // Array of { day, startTime, endTime }
    state: null,
    city: null,
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const router = useRouter();

  // Load India states
  useEffect(() => {
    const india = Country.getAllCountries().find((c) => c.name === "India");
    const indiaStates = State.getStatesOfCountry(india.isoCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
    setStates(indiaStates);
  }, []);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: prev.email || user.primaryEmailAddress?.emailAddress || '',
        phone: prev.phone || user.primaryPhoneNumber?.phoneNumber || '',
      }));
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle react-select change
  const handleSelectChange = (field, option) => {
    if (field === "state") {
      setFormData({ ...formData, state: option, city: null });
      // Only fetch cities if a state is selected (not cleared)
      if (option && option.value) {
        const indiaCities = City.getCitiesOfState("IN", option.value).map((c) => ({
          value: c.name,
          label: c.name,
        }));
        setCities(indiaCities);
      } else {
        // Clear cities when state is cleared
        setCities([]);
      }
    } else if (field === "city") {
      setFormData({ ...formData, city: option });
    } else if (field === "specialization") {
      setFormData({ ...formData, specialization: option });
    }
  };

  // Handle availability changes
  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index][field] = value;
    setFormData({ ...formData, availability: updated });
  };

  // Add a new availability row
  const addAvailabilityRow = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, { day: "", startTime: "", endTime: "" }],
    });
  };

  // Remove a row
  const removeAvailabilityRow = (index) => {
    const updated = [...formData.availability];
    updated.splice(index, 1);
    setFormData({ ...formData, availability: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.gender ||
        !formData.specialization || !formData.experience || !formData.qualifications ||
        !formData.licenseNumber || !formData.state || !formData.city ||
        !formData.clinicName || !formData.clinicAddress || !formData.consultationFee) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate availability
    if (formData.availability.length === 0) {
      toast.error('Please add at least one availability schedule');
      return;
    }

    // Validate each availability entry
    const invalidAvailability = formData.availability.some(
      slot => !slot.day || !slot.startTime || !slot.endTime
    );
    if (invalidAvailability) {
      toast.error('Please complete all availability time slots');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        state: formData.state,
        city: formData.city,
        specialization: formData.specialization,
      };
      
      console.log('Submitting doctor application:', submissionData);
      
      const result = await submitDoctorApplication(submissionData, user?.id);
      
      if (result.success) {
        // Show success popup instead of toast
        setShowSuccessPopup(true);
        
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          gender: "",
          specialization: null,
          experience: "",
          qualifications: "",
          licenseNumber: "",
          clinicName: "",
          clinicAddress: "",
          consultationFee: "",
          availability: [],
          state: null,
          city: null,
        });
        setCities([]);
        
      } else {
        setErrorMessage(result.error || 'Failed to submit application');
        setShowErrorPopup(true);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessPopup(false);
    router.push("/");
  };

  const handleErrorOk = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 mt-8 pt-20 py-8 px-4 sm:px-6 lg:px-8">
      
     
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your doctor application has been submitted for admin approval. You will be notified once it's reviewed.
              </p>
              <button
                onClick={handleSuccessOk}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submission Failed</h3>
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={handleErrorOk}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 flex justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex flex-col justify-center text-left ml-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Doctor Registration</h1>
            <p className="text-lg text-gray-600">Join our healthcare network and start helping patients</p>
          </div>
        </div>

        <form className="bg-white shadow-2xl rounded-2xl overflow-hidden" onSubmit={handleSubmit}>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Personal & Professional Information</h2>
            <p className="text-emerald-100 mt-1">Please fill in all required details accurately</p>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="doctor@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 9999999999"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Professional Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Specialization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Specialization *</label>
                  <Select
                    instanceId="specialization-select"
                    inputId="specialization-input"
                    options={SPECIALIZATIONS}
                    value={formData.specialization}
                    onChange={(option) => handleSelectChange("specialization", option)}
                    placeholder="Search and select your specialization"
                    isSearchable
                    isClearable
                    styles={selectStyles}
                    className="text-sm"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No specializations found"}
                    loadingMessage={() => "Loading specializations..."}
                  />
                </div>

                {/* Experience & Qualifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience *</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      min="0"
                      max="50"
                      placeholder="e.g. 5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Qualifications *</label>
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      required
                      placeholder="e.g. MBBS, MD, MS"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medical License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your medical license number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Practice Location
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* State & City */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                    <Select
                      instanceId="state-select"
                      inputId="state-input"
                      options={states}
                      value={formData.state}
                      onChange={(option) => handleSelectChange("state", option)}
                      placeholder="Select your state"
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      className="text-sm"
                      classNamePrefix="react-select"
                      noOptionsMessage={() => "No states found"}
                      loadingMessage={() => "Loading states..."}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                    <Select
                      instanceId="city-select"
                      inputId="city-input"
                      options={cities}
                      value={formData.city}
                      onChange={(option) => handleSelectChange("city", option)}
                      placeholder={formData.state ? "Select your city" : "First select a state"}
                      isSearchable
                      isClearable
                      isDisabled={!formData.state}
                      styles={selectStyles}
                      className="text-sm"
                      classNamePrefix="react-select"
                      noOptionsMessage={() => formData.state ? "No cities found" : "Please select a state first"}
                      loadingMessage={() => "Loading cities..."}
                    />
                  </div>
                </div>

                {/* Clinic Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic/Hospital Name *</label>
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. City Medical Center"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Clinic Address *</label>
                    <textarea
                      name="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Enter complete address including street, area, pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation & Availability Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Consultation & Schedule
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Consultation Fee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Fee (₹) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      required
                      min="0"
                      max="10000"
                      placeholder="500"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Weekly Availability</label>
                    <button
                      type="button"
                      onClick={addAvailabilityRow}
                      className="inline-flex items-center px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Schedule
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.availability.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No schedule added yet. Click "Add Schedule" to add your availability.</p>
                      </div>
                    ) : (
                      formData.availability.map((row, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <select
                              value={row.day}
                              onChange={(e) => handleAvailabilityChange(idx, "day", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                            >
                              <option value="">Select Day</option>
                              {DAYS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="flex gap-2 sm:gap-3">
                            <div className="flex-1">
                              <input
                                type="time"
                                value={row.startTime}
                                onChange={(e) => handleAvailabilityChange(idx, "startTime", e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                              />
                            </div>
                            
                            <span className="flex items-center text-gray-500 px-1">to</span>
                            
                            <div className="flex-1">
                              <input
                                type="time"
                                value={row.endTime}
                                onChange={(e) => handleAvailabilityChange(idx, "endTime", e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                              />
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeAvailabilityRow(idx)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                            title="Remove this schedule"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-gray-50 px-8 py-6 rounded-b-2xl">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              <span className="flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit for Admin Approval
                  </>
                )}
              </span>
            </button>
              
            <p className="text-center text-sm text-gray-600 mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
      </div>
      <FloatingActionButton />
    </div>
  );
}