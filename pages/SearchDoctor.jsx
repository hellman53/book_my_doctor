import React, { useState, useEffect } from "react";
import { Search, MapPin, Heart, X, Clock, User, ChevronDown } from "lucide-react";

export default function DoctorSearch() {
  // Dummy dataset with image URLs
  const doctors = [
    { id: 1, name: "Dr. Anjali Verma", specialization: "Cardiologist", city: "Lucknow", locality: "Hazratganj", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face" },
    { id: 2, name: "Dr. Rajesh Kumar", specialization: "Dentist", city: "Varanasi", locality: "Lanka", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face" },
    { id: 3, name: "Dr. Priya Singh", specialization: "Dermatologist", city: "Delhi", locality: "Saket", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face" },
    { id: 4, name: "Dr. Arvind Patel", specialization: "Neurologist", city: "Patna", locality: "Kankarbagh", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face" },
    { id: 5, name: "Dr. Neha Sharma", specialization: "Pediatrician", city: "Noida", locality: "Sector 18", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face" },
    { id: 6, name: "Dr. Amit Yadav", specialization: "General Physician", city: "Ghaziabad", locality: "Indirapuram", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face" },
    { id: 7, name: "Dr. Sunita Tiwari", specialization: "Cardiologist", city: "Kanpur", locality: "Swaroop Nagar", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face" },
    { id: 8, name: "Dr. Manish Gupta", specialization: "Dentist", city: "Lucknow", locality: "Aliganj", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face" },
    { id: 9, name: "Dr. Shalini Pandey", specialization: "Dermatologist", city: "Delhi", locality: "Rohini", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face" },
    { id: 10, name: "Dr. Ramesh Sinha", specialization: "Neurologist", city: "Varanasi", locality: "Godowlia", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face" },
    { id: 11, name: "Dr. Sanjay Mishra", specialization: "Pediatrician", city: "Lucknow", locality: "Gomti Nagar", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face" },
    { id: 12, name: "Dr. Pooja Singh", specialization: "General Physician", city: "Lucknow", locality: "Hazratganj", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face" },
    { id: 13, name: "Dr. Rohit Kumar", specialization: "Surgeon", city: "Lucknow", locality: "Aliganj", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face" },
    { id: 14, name: "Dr. Meera Joshi", specialization: "Neurologist", city: "Lucknow", locality: "Gomti Nagar", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face" },
  ];

  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Available cities
  const cities = ["", "Lucknow", "Delhi", "Varanasi", "Patna", "Noida", "Ghaziabad", "Kanpur"];

  // Specialization filters
  const specializations = [
    "Cardiologist", "Dentist", "Dermatologist", "Neurologist", 
    "Pediatrician", "General Physician", "Surgeon"
  ];

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate suggestions based on search query
  const generateSuggestions = (searchTerm) => {
    if (!selectedCity) {
      return { localities: [], specializations: [], doctors: [] };
    }

    if (searchTerm.trim() === "") {
      const cityDoctors = doctors.filter(doc => doc.city === selectedCity);
      return {
        localities: [...new Set(cityDoctors.map(doc => doc.locality))],
        specializations: [...new Set(cityDoctors.map(doc => doc.specialization))],
        doctors: cityDoctors.slice(0, 5)
      };
    }

    const lower = searchTerm.toLowerCase();
    const cityDoctors = doctors.filter(doc => doc.city === selectedCity);
    
    const filteredDoctors = cityDoctors.filter(doc =>
      doc.locality.toLowerCase().includes(lower) ||
      doc.specialization.toLowerCase().includes(lower) ||
      doc.name.toLowerCase().includes(lower)
    );

    return {
      localities: [...new Set(filteredDoctors.map(doc => doc.locality))],
      specializations: [...new Set(filteredDoctors.map(doc => doc.specialization))],
      doctors: filteredDoctors.slice(0, 5)
    };
  };

  // Update results based on city selection, search query, and filter
  useEffect(() => {
    if (!selectedCity) {
      setResults([]);
      return;
    }

    let filteredDoctors = doctors.filter(doc => doc.city === selectedCity);

    // Apply search query filter
    if (query.trim() !== "") {
      const lower = query.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doc =>
        doc.locality.toLowerCase().includes(lower) ||
        doc.specialization.toLowerCase().includes(lower) ||
        doc.name.toLowerCase().includes(lower)
      );
    }

    // Apply specialization filter
    if (selectedFilter) {
      filteredDoctors = filteredDoctors.filter(doc => doc.specialization === selectedFilter);
    }

    setResults(filteredDoctors);
  }, [query, selectedCity, selectedFilter]);

  // Update suggestions when query changes
  useEffect(() => {
    if (showPopup) {
      setSuggestions(generateSuggestions(query));
    }
  }, [query, showPopup, selectedCity]);

  const handleSearchClick = () => {
    if (!selectedCity) {
      alert("Please select a city first");
      return;
    }
    
    setShowPopup(true);
    
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleSuggestionSelect = (suggestion, type) => {
    if (type === 'doctor') {
      setQuery(suggestion.name);
    } else if (type === 'locality') {
      setQuery(suggestion);
    } else {
      setQuery(suggestion);
    }
    setShowPopup(false);
  };

  const handleRecentSearchClick = (search) => {
    setQuery(search);
    setShowPopup(false);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setQuery("");
    setSelectedFilter("");
    setShowPopup(false);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setQuery("");
    setShowPopup(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedFilter("");
  };

  const toggleFavorite = (doctorId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(doctorId)) {
        newFavorites.delete(doctorId);
      } else {
        newFavorites.add(doctorId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Search Bar */}
      <div className="bg-white shadow-lg rounded-2xl flex items-center p-2 sm:p-3">
        {/* Location Icon and City */}
        <div className="flex items-center px-2 sm:px-3 border-r border-gray-200 mr-2">
          <MapPin className="text-gray-500 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <select 
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="outline-none text-sm font-medium text-gray-700 bg-transparent cursor-pointer"
          >
            <option value="">Select City</option>
            {cities.filter(city => city !== "").map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (!selectedCity) {
                alert("Please select a city first");
                return;
              }
              setShowPopup(true);
            }}
            placeholder={selectedCity ? "Search for locality, doctor, or specialization..." : "Select a city to search"}
            disabled={!selectedCity}
            className={`w-full outline-none px-2 sm:px-4 py-2 text-sm sm:text-lg ${
              !selectedCity ? "text-gray-400 cursor-not-allowed" : "text-gray-700"
            }`}
          />
          {query && (
            <button 
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Search Button */}
        <button 
          onClick={handleSearchClick}
          disabled={!selectedCity}
          className={`p-2 sm:p-3 rounded-xl ml-2 transition-colors ${
            !selectedCity 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Specialization Filter Buttons */}
      {selectedCity && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {specializations.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedFilter === filter
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
          {selectedFilter && (
            <button
              onClick={() => handleFilterClick("")}
              className="px-3 py-2 rounded-full text-sm font-medium border bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* City Selection Prompt */}
      {!selectedCity && (
        <div className="text-center text-gray-500 mt-4 text-sm">
          Please select a city to start searching for doctors
        </div>
      )}

      {/* Search Info */}
      {selectedCity && (
        <div className="mt-4 text-sm text-gray-600">
          {!query && !selectedFilter ? (
            <p>Showing all doctors in <span className="font-semibold">{selectedCity}</span></p>
          ) : (
            <p>
              {selectedFilter ? `Showing ${selectedFilter}s` : 'Searching'}{' '}
              {query && `for "${query}"`} in{" "}
              <span className="font-semibold">{selectedCity}</span>
              {(query || selectedFilter) && (
                <button 
                  onClick={clearSearch}
                  className="ml-2 text-emerald-600 hover:text-emerald-800 text-xs"
                >
                  Clear {query && selectedFilter ? 'all' : query ? 'search' : 'filter'}
                </button>
              )}
            </p>
          )}
        </div>
      )}

      {/* Suggestion Popup Modal */}
      {showPopup && selectedCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 pt-16 sm:pt-20">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] sm:max-h-[70vh] overflow-hidden mx-2 sm:mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h3 className="text-base sm:text-lg font-semibold">
                {query ? `Search for "${query}" in ${selectedCity}` : `Browse doctors in ${selectedCity}`}
              </h3>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input inside Popup */}
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 sm:px-4 py-2">
                <Search className="text-gray-500 mr-2 h-4 w-4" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search localities, doctors, or specializations in ${selectedCity}...`}
                  className="flex-1 outline-none bg-transparent text-gray-700 text-sm sm:text-base"
                  autoFocus
                />
              </div>
            </div>

            {/* Suggestions */}
            <div className="max-h-96 overflow-y-auto">
              {/* Show recent searches only when query is empty */}
              {query.trim() === "" && recentSearches.length > 0 && (
                <div className="p-4 sm:p-6 border-b">
                  <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show ALL localities and doctors when no search query */}
              {query.trim() === "" && (
                <>
                  {/* All Localities in selected city */}
                  {suggestions.localities && suggestions.localities.length > 0 && (
                    <div className="p-4 sm:p-6 border-b">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Localities in {selectedCity}
                      </h4>
                      <div className="space-y-2">
                        {suggestions.localities.map((locality, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionSelect(locality, 'locality')}
                            className="flex items-center w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                          >
                            <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm sm:text-base">{locality}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Doctors in selected city */}
                  {suggestions.doctors && suggestions.doctors.length > 0 && (
                    <div className="p-4 sm:p-6">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Doctors in {selectedCity}
                      </h4>
                      <div className="space-y-3">
                        {suggestions.doctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() => handleSuggestionSelect(doctor, 'doctor')}
                            className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg border"
                          >
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm sm:text-base">{doctor.name}</p>
                              <p className="text-xs sm:text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-xs text-gray-500">{doctor.locality}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Show filtered suggestions when there's a search query */}
              {query.trim() !== "" && (
                <>
                  {/* Filtered Localities */}
                  {suggestions.localities && suggestions.localities.length > 0 && (
                    <div className="p-4 sm:p-6 border-b">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Matching Localities</h4>
                      <div className="space-y-2">
                        {suggestions.localities.map((locality, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionSelect(locality, 'locality')}
                            className="flex items-center w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                          >
                            <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm sm:text-base">{locality}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered Specializations */}
                  {suggestions.specializations && suggestions.specializations.length > 0 && (
                    <div className="p-4 sm:p-6 border-b">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Matching Specializations</h4>
                      <div className="space-y-2">
                        {suggestions.specializations.map((spec, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionSelect(spec, 'specialization')}
                            className="flex items-center w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                          >
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm sm:text-base">{spec}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered Doctors */}
                  {suggestions.doctors && suggestions.doctors.length > 0 && (
                    <div className="p-4 sm:p-6">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Matching Doctors</h4>
                      <div className="space-y-3">
                        {suggestions.doctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() => handleSuggestionSelect(doctor, 'doctor')}
                            className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg border"
                          >
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm sm:text-base">{doctor.name}</p>
                              <p className="text-xs sm:text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-xs text-gray-500">{doctor.locality}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {suggestions.localities?.length === 0 && 
                   suggestions.specializations?.length === 0 && 
                   suggestions.doctors?.length === 0 && (
                    <div className="p-6 text-center text-gray-500 text-sm sm:text-base">
                      No results found for "{query}" in {selectedCity}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Doctor Results */}
      {results.length > 0 && selectedCity && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            {selectedFilter ? `${selectedFilter}s` : query ? 'Search Results' : 'All Doctors'} in {selectedCity} ({results.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={doc.image} 
                      alt={doc.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{doc.name}</h3>
                          <p className="text-emerald-600 font-semibold text-sm sm:text-base">{doc.specialization}</p>
                        </div>
                        <button 
                          onClick={() => toggleFavorite(doc.id)}
                          className={`p-2 rounded-full transition-colors ${
                            favorites.has(doc.id) 
                              ? "text-red-500 bg-red-50" 
                              : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${favorites.has(doc.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{doc.locality}, {doc.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">₹500</span>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Book Appointment
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Consultation fee</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {selectedCity && (query.trim() !== "" || selectedFilter) && results.length === 0 && (
        <div className="text-center py-12 text-gray-500 mt-6 text-sm sm:text-base">
          <div className="max-w-md mx-auto">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No doctors found</h3>
            <p>
              {selectedFilter ? `No ${selectedFilter}s` : 'No doctors'}{' '}
              {query ? `matching "${query}"` : ''} in {selectedCity}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}