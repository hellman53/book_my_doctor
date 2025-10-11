"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Heart,
  X,
  Clock,
  User,
  ChevronDown,
  Filter,
  Star,
  Calendar,
  Badge,
  Video,
  Stethoscope,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingActionButton from "@/components/HomeComponent/FloatingActionButton";

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [consultationTypeFilter, setConsultationTypeFilter] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cities, setCities] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const specializationScrollRef = useRef(null);

  // Load search query from URL on component mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      // Optionally trigger search automatically when query comes from URL
      if (selectedCity) {
        setShowPopup(true);
      }
    }
  }, [searchParams, selectedCity]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    const savedSearches = localStorage.getItem("recentSearches");
    const savedFavorites = localStorage.getItem("doctorFavorites");

    if (savedCity) setSelectedCity(savedCity);
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (selectedCity) localStorage.setItem("selectedCity", selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem("doctorFavorites", JSON.stringify([...favorites]));
  }, [favorites]);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch doctors from Firebase
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const doctorsRef = collection(db, "doctors");
        const q = query(doctorsRef, where("isActive", "==", true));
        const querySnapshot = await getDocs(q);

        const doctorsData = await Promise.all(
          querySnapshot.docs.map(async (doctorDoc) => {
            const doctorData = { id: doctorDoc.id, ...doctorDoc.data() };

            // Also fetch user data for profile image
            try {
              const userDocRef = doc(db, "users", doctorDoc.id);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                return {
                  ...doctorData,
                  profileImage: userDoc.data().profileImage,
                  userData: userDoc.data(),
                };
              }
            } catch (error) {
              console.error(
                "Error fetching user data for doctor:",
                doctorDoc.id,
                error
              );
            }

            return doctorData;
          })
        );

        setDoctors(doctorsData);

        // Extract unique cities and specializations
        const uniqueCities = [
          ...new Set(doctorsData.map((doc) => doc.city).filter(Boolean)),
        ];
        const uniqueSpecializations = [
          ...new Set(
            doctorsData.map((doc) => doc.specialization).filter(Boolean)
          ),
        ];

        setCities(["", ...uniqueCities]);
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
        setCities([""]);
        setSpecializations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Generate suggestions based on search query
  const generateSuggestions = (searchTerm) => {
    if (!selectedCity) {
      return { localities: [], specializations: [], doctors: [] };
    }

    const cityDoctors = doctors.filter(
      (doc) => doc.city && doc.city.toLowerCase() === selectedCity.toLowerCase()
    );

    if (searchTerm.trim() === "") {
      return {
        localities: [
          ...new Set(cityDoctors.map((doc) => doc.locality).filter(Boolean)),
        ],
        specializations: [
          ...new Set(
            cityDoctors.map((doc) => doc.specialization).filter(Boolean)
          ),
        ],
        doctors: cityDoctors.slice(0, 5),
      };
    }

    const lower = searchTerm.toLowerCase();

    const filteredDoctors = cityDoctors.filter(
      (doc) =>
        (doc.locality && doc.locality.toLowerCase().includes(lower)) ||
        (doc.specialization &&
          doc.specialization.toLowerCase().includes(lower)) ||
        (doc.fullName && doc.fullName.toLowerCase().includes(lower)) ||
        (doc.clinicName && doc.clinicName.toLowerCase().includes(lower))
    );

    return {
      localities: [
        ...new Set(filteredDoctors.map((doc) => doc.locality).filter(Boolean)),
      ],
      specializations: [
        ...new Set(
          filteredDoctors.map((doc) => doc.specialization).filter(Boolean)
        ),
      ],
      doctors: filteredDoctors.slice(0, 5),
    };
  };

  // Update results based on filters
  useEffect(() => {
    if (!selectedCity) {
      setResults([]);
      return;
    }

    let filteredDoctors = doctors.filter(
      (doc) => doc.city && doc.city.toLowerCase() === selectedCity.toLowerCase()
    );

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        (doc) =>
          (doc.locality && doc.locality.toLowerCase().includes(lower)) ||
          (doc.specialization &&
            doc.specialization.toLowerCase().includes(lower)) ||
          (doc.fullName && doc.fullName.toLowerCase().includes(lower)) ||
          (doc.clinicName && doc.clinicName.toLowerCase().includes(lower))
      );
    }

    // Apply specialization filter
    if (selectedFilter) {
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.specialization === selectedFilter
      );
    }

    setResults(filteredDoctors);
  }, [searchQuery, selectedCity, selectedFilter, doctors]);

  // Update suggestions when query changes
  useEffect(() => {
    if (showPopup) {
      setSuggestions(generateSuggestions(searchQuery));
    }
  }, [searchQuery, showPopup, selectedCity, doctors]);

  // Scroll functions for horizontal sections
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Event handlers
  const handleSearchClick = () => {
    if (!selectedCity) {
      alert("Please select a city first");
      return;
    }

    setShowPopup(true);

    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleSuggestionSelect = (suggestion, type) => {
    if (type === "doctor") {
      setSearchQuery(suggestion.fullName);
    } else if (type === "locality") {
      setSearchQuery(suggestion);
    } else {
      setSearchQuery(suggestion);
    }
    setShowPopup(false);
  };

  const handleRecentSearchClick = (search) => {
    setSearchQuery(search);
    setShowPopup(false);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSearchQuery("");
    setSelectedFilter("");
    setShowPopup(false);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setSearchQuery("");
    setShowPopup(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedFilter("");
    // Also update URL to remove query parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    router.replace(url.pathname + url.search);
  };

  const toggleFavorite = (doctorId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(doctorId)) {
        newFavorites.delete(doctorId);
      } else {
        newFavorites.add(doctorId);
      }
      return newFavorites;
    });
  };

  const handleCardClick = (doctorId) => {
    router.push(`/doctors/${doctorId}`);
  };

  const handleBookAppointment = (doctorId, e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/doctors/${doctorId}`);
  };

  return (
    <div className="mt-4 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <FloatingActionButton />
      <div className="pt-20 sm:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Find Your Perfect
              <span className="text-emerald-600 ml-1 sm:ml-2">Doctor</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-2">
              Search through thousands of verified doctors and book appointments
              instantly
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6 sm:mb-8">
            <div className="bg-white shadow-lg sm:shadow-xl rounded-2xl sm:rounded-3xl border border-gray-100 p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                {/* City Selection */}
                <div className="flex items-center px-3 sm:px-4 py-2 bg-gray-50 rounded-xl sm:rounded-2xl min-w-0 lg:w-56 xl:w-64">
                  <MapPin className="text-emerald-500 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="outline-none text-xs sm:text-sm font-medium text-gray-700 bg-transparent cursor-pointer flex-1 min-w-0"
                  >
                    <option value="">Select City</option>
                    {cities
                      .filter((city) => city !== "")
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        if (!selectedCity) {
                          alert("Please select a city first");
                          return;
                        }
                        setShowPopup(true);
                      }}
                      placeholder={
                        selectedCity
                          ? "Search doctors, specializations, or localities..."
                          : "Select a city to search"
                      }
                      disabled={!selectedCity}
                      className={`w-full pl-9 sm:pl-12 pr-8 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border-0 bg-gray-50 ${
                        !selectedCity
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      } transition-all duration-200`}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-200 ${
                      showFilters
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-200"
                    }`}
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline text-xs sm:text-sm">
                      Filters
                    </span>
                  </button>

                  <button
                    onClick={handleSearchClick}
                    disabled={!selectedCity}
                    className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      !selectedCity
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Search</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Consultation Type Filter */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Consultation Type
                    </label>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="flex items-center text-xs sm:text-sm">
                        <input
                          type="radio"
                          name="consultationType"
                          value=""
                          checked={consultationTypeFilter === ""}
                          onChange={(e) =>
                            setConsultationTypeFilter(e.target.value)
                          }
                          className="text-emerald-600 focus:ring-emerald-500 h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <span className="ml-2 text-gray-700">All Types</span>
                      </label>
                      <label className="flex items-center text-xs sm:text-sm">
                        <input
                          type="radio"
                          name="consultationType"
                          value="virtual"
                          checked={consultationTypeFilter === "virtual"}
                          onChange={(e) =>
                            setConsultationTypeFilter(e.target.value)
                          }
                          className="text-emerald-600 focus:ring-emerald-500 h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <span className="ml-2 text-gray-700">Virtual Only</span>
                      </label>
                      <label className="flex items-center text-xs sm:text-sm">
                        <input
                          type="radio"
                          name="consultationType"
                          value="in-person"
                          checked={consultationTypeFilter === "in-person"}
                          onChange={(e) =>
                            setConsultationTypeFilter(e.target.value)
                          }
                          className="text-emerald-600 focus:ring-emerald-500 h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <span className="ml-2 text-gray-700">
                          In-Person Only
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm"
                    >
                      <option value="">Default</option>
                      <option value="rating">Highest Rated</option>
                      <option value="experience">Most Experienced</option>
                      <option value="fee-low">Lowest Fee</option>
                      <option value="fee-high">Highest Fee</option>
                      <option value="availability">Available Today</option>
                    </select>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Quick Filters
                    </label>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button className="px-2 sm:px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:border-emerald-300 transition-colors">
                        Available Today
                      </button>
                      <button className="px-2 sm:px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:border-emerald-300 transition-colors">
                        Top Rated
                      </button>
                      <button className="px-2 sm:px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:border-emerald-300 transition-colors">
                        Under ₹500
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Suggestions Popup */}
            {showPopup && selectedCity && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg sm:rounded-xl shadow-lg mt-2 z-50 max-h-80 sm:max-h-96 overflow-y-auto">
                {/* Recent Searches */}
                {recentSearches.length > 0 && searchQuery === "" && (
                  <div className="p-3 sm:p-4 border-b">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Recent Searches
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="block w-full text-left px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Clock className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Localities */}
                {suggestions.localities?.length > 0 && (
                  <div className="p-3 sm:p-4 border-b">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Localities
                    </h4>
                    <div className="space-y-1">
                      {suggestions.localities.map((locality, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleSuggestionSelect(locality, "locality")
                          }
                          className="block w-full text-left px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <MapPin className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          {locality}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {suggestions.specializations?.length > 0 && (
                  <div className="p-3 sm:p-4 border-b">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Specializations
                    </h4>
                    <div className="space-y-1">
                      {suggestions.specializations.map((spec, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleSuggestionSelect(spec, "specialization")
                          }
                          className="block w-full text-left px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <User className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctors */}
                {suggestions.doctors?.length > 0 && (
                  <div className="p-3 sm:p-4">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Doctors
                    </h4>
                    <div className="space-y-2">
                      {suggestions.doctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          onClick={() =>
                            handleSuggestionSelect(doctor, "doctor")
                          }
                          className="block w-full text-left px-2 sm:px-3 py-2 hover:bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-gray-400" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-900">
                                {doctor.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doctor.specialization} • {doctor.locality}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {suggestions.localities?.length === 0 &&
                  suggestions.specializations?.length === 0 &&
                  suggestions.doctors?.length === 0 &&
                  searchQuery !== "" && (
                    <div className="p-4 text-center text-gray-500 text-xs sm:text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Specialization Filter Chips - Horizontal Scroll on Mobile */}
          {selectedCity && specializations.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                Popular Specializations
              </h3>
              <div className="relative">
                <div
                  ref={specializationScrollRef}
                  className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {specializations.slice(0, 8).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterClick(filter)}
                      className={`flex-shrink-0 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border-2 transition-all duration-200 transform hover:scale-105 ${
                        selectedFilter === filter
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-lg"
                          : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                  {selectedFilter && (
                    <button
                      onClick={() => handleFilterClick("")}
                      className="flex-shrink-0 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                      Clear Filter
                    </button>
                  )}
                </div>

                {/* Scroll buttons for mobile */}
                <div className="sm:hidden flex justify-center gap-2 mt-2">
                  <button
                    onClick={() => scrollLeft(specializationScrollRef)}
                    className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-1 shadow-lg hover:shadow-xl transition-all"
                  >
                    <ChevronLeft className="h-3 w-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => scrollRight(specializationScrollRef)}
                    className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full p-1 shadow-lg hover:shadow-xl transition-all"
                  >
                    <ChevronRight className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* City Selection Prompt */}
          {!selectedCity && (
            <div className="text-center text-gray-500 mt-4 text-xs sm:text-sm">
              Please select a city to start searching for doctors
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Loading doctors...
              </p>
            </div>
          )}

          {/* Search Info */}
          {selectedCity && !loading && (
            <div className="mt-4 text-xs sm:text-sm text-gray-600">
              {!searchQuery && !selectedFilter ? (
                <p>
                  Showing all doctors in{" "}
                  <span className="font-semibold">{selectedCity}</span>
                </p>
              ) : (
                <p>
                  {selectedFilter ? `Showing ${selectedFilter}s` : "Searching"}{" "}
                  {searchQuery && `for "${searchQuery}"`} in{" "}
                  <span className="font-semibold">{selectedCity}</span>
                  {(searchQuery || selectedFilter) && (
                    <button
                      onClick={clearSearch}
                      className="ml-2 text-emerald-600 hover:text-emerald-800 text-xs"
                    >
                      Clear{" "}
                      {searchQuery && selectedFilter
                        ? "all"
                        : searchQuery
                        ? "search"
                        : "filter"}
                    </button>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Results Section */}
          {selectedCity && !loading && (
            <div className="mt-4 sm:mt-6">
              {results.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {results.length}{" "}
                      {results.length === 1 ? "Doctor" : "Doctors"} Found
                    </h3>
                    {results.length > 0 && (
                      <div className="text-xs sm:text-sm text-gray-500">
                        Showing results for {selectedCity}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:gap-6">
                    {results.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => handleCardClick(doctor.id)}
                        className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 cursor-pointer border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-1"
                      >
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative">
  {/* Doctor Avatar */}
  <div className="flex items-start gap-3">
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        {doctor.profileImage ? (
          <img
            src={doctor.profileImage}
            alt={doctor.fullName}
            className="w-full h-full rounded-xl sm:rounded-2xl object-cover"
          />
        ) : (
          <User className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-emerald-600" />
        )}
      </div>

      {/* Online Status Indicator */}
      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
      </div>
    </div>

    {/* Name + Specialization beside image (mobile view) */}
    <div className="flex flex-col justify-center sm:hidden">
      <h3 className="text-base font-bold text-gray-900">
        Dr. {doctor.fullName}
      </h3>
      <p className="text-emerald-600 font-semibold text-sm flex items-center gap-1">
        <Stethoscope className="h-3 w-3" />
        {doctor.specialization}
      </p>
    </div>
  </div>

  {/* Favorite Button - Top Right */}
  <button
    onClick={(e) => toggleFavorite(doctor.id, e)}
    className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-50 transition-colors"
  >
    <Heart
      className={`h-5 w-5 ${
        favorites.has(doctor.id)
          ? "fill-red-500 text-red-500"
          : "text-gray-400 hover:text-red-500"
      }`}
    />
  </button>

  {/* Doctor Info */}
  <div className="flex-1 min-w-0">
    {/* Desktop: Name + specialization beside info */}
    <div className="hidden sm:flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-2">
      <div className="flex-1">
        <div className="flex sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
            Dr. {doctor.fullName}
          </h3>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-yellow-500" />
            <Badge className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        <p className="text-emerald-600 font-semibold text-base lg:text-lg mb-2 flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          {doctor.specialization}
        </p>
      </div>
    </div>

    {/* Rest of the info (always below on mobile) */}
    
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Left Column - Address & Details */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 text-xs sm:text-sm flex-1">
        <div className="flex items-center sm:gap-2 text-gray-600">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
          <span className="font-medium truncate">{doctor.clinicName}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
          <span className="truncate">
            {doctor.city}
          </span>
        </div>
        {doctor.experience && (
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
            <span>{doctor.experience} years experience</span>
          </div>
        )}
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
          <span className="text-green-600 font-medium">Available Today</span>
        </div>
        {doctor.rating > 0 && (
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-0.5 sm:gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                i < Math.floor(doctor.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="font-semibold text-gray-900 text-sm sm:text-base">
          {doctor.rating}
        </span>
        {doctor.reviewCount && (
          <span className="text-gray-500 text-xs sm:text-sm">
            ({doctor.reviewCount} reviews)
          </span>
        )}
      </div>
    )}

      </div>

      {/* Right Column - Fee, Services & Actions */}
      <div className="sm:w-56 lg:w-80 flex-shrink-0 sm:pb-1">
        {/* Consultation Fee */}
        {doctor.consultationFee && (
          <div className="mb-4">
            <div className="text-xl font-bold text-gray-500">
              Consultation Fee -{" "}
              <span className="text-lg sm:text-xl font-bold text-emerald-600">
                ₹{doctor.consultationFee}
              </span>
            </div>
          </div>
        )}

        {/* Service Tags */}
        <div className="flex gap-1 flex-wrap mb-4 ">
          <span className="inline-flex items-center  py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
            <Video className="h-3 w-3 mr-1" />
            Video Call
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
            <User className="h-3 w-3 mr-1" />
            In-Person
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
            <Clock className="h-3 w-3 mr-1" />
            Same Day
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => handleBookAppointment(doctor.id, e)}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Book Appointment
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add view profile functionality
            }}
            className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <User className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base px-2">
                    {searchQuery || selectedFilter ? (
                      <>
                        No doctors match your search criteria. Try adjusting
                        your filters or search terms.
                      </>
                    ) : (
                      <>
                        No doctors are available in {selectedCity} at the
                        moment.
                      </>
                    )}
                  </p>
                  {(searchQuery || selectedFilter) && (
                    <button
                      onClick={clearSearch}
                      className="mt-3 sm:mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base"
                    >
                      Clear search and show all doctors
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Click outside to close popup */}
          {showPopup && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPopup(false)}
            ></div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}