import React, { useState } from "react";
import { ShoppingCart, Star, Heart, Search, Filter, Truck, Shield, Clock, Zap, ArrowRight } from "lucide-react";

const MedicineStore = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Medicines", icon: "💊" },
    { id: "pain", name: "Pain Relief", icon: "🤕" },
    { id: "fever", name: "Fever & Cold", icon: "🤒" },
    { id: "allergy", name: "Allergy", icon: "🤧" },
    { id: "vitamin", name: "Vitamins", icon: "💪" },
    { id: "skin", name: "Skin Care", icon: "✨" },
    { id: "digestive", name: "Digestive", icon: "🫀" },
    { id: "heart", name: "Heart Care", icon: "❤️" }
  ];

  const medicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      brand: "Cipla",
      category: "pain",
      price: 49,
      originalPrice: 65,
      discount: 25,
      rating: 4.8,
      reviews: 1240,
      image: "https://d1ymz67w5raq8g.cloudfront.net/Pictures/2000xAny/1/2/0/532120_paracetamolbackgroundinformationcoverimage_807319_crop.jpg",
      inStock: true,
      prescription: false,
      description: "Effective pain relief and fever reducer"
    },
    {
      id: 2,
      name: "Amoxicillin Capsule",
      brand: "Sun Pharma",
      category: "fever",
      price: 120,
      originalPrice: 150,
      discount: 20,
      rating: 4.6,
      reviews: 890,
      image: "https://5.imimg.com/data5/SELLER/Default/2022/9/MP/EH/AX/20293607/amoxycillin-500-mg-tablet-mox-500-tablet.jpg",
      inStock: true,
      prescription: true,
      description: "Broad-spectrum antibiotic for bacterial infections"
    },
    {
      id: 3,
      name: "Vitamin C Tablets",
      brand: "Himalaya",
      category: "vitamin",
      price: 89,
      originalPrice: 120,
      discount: 26,
      rating: 4.9,
      reviews: 2150,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
      inStock: true,
      prescription: false,
      description: "Boosts immunity and antioxidant protection"
    },
    {
      id: 4,
      name: "Cough Syrup",
      brand: "Dabur",
      category: "fever",
      price: 150,
      originalPrice: 200,
      discount: 25,
      rating: 4.5,
      reviews: 1560,
      image: "https://ik.imagekit.io/wlfr/wellness/images/products/206052-1.jpg/tr:w-3840,c-at_max,cm-pad_resize,ar-1210-700,pr-true,f-auto,q-70,l-image,i-Wellness_logo_BDwqbQao9.png,lfo-bottom_right,w-200,h-90,c-at_least,cm-pad_resize,l-end",
      inStock: true,
      prescription: false,
      description: "Natural relief from cough and cold symptoms"
    },
    {
      id: 5,
      name: "Cetirizine 10mg",
      brand: "Zydus",
      category: "allergy",
      price: 35,
      originalPrice: 45,
      discount: 22,
      rating: 4.7,
      reviews: 980,
      image: "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=400&h=300&fit=crop",
      inStock: true,
      prescription: false,
      description: "Fast-acting allergy relief tablets"
    },
    {
      id: 6,
      name: "Vitamin D3 1000IU",
      brand: "Revital",
      category: "vitamin",
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.8,
      reviews: 1870,
      image: "https://stmaria.cz/image/cache/catalog/doplnky/revital/REVITAL%20Vitamin%20D3%20Forte%201000%20IU%20tbl.90-1200x1200.jpeg",
      inStock: true,
      prescription: false,
      description: "Bone health and immunity support"
    },
    {
      id: 7,
      name: "Omeprazole 20mg",
      brand: "Mankind",
      category: "digestive",
      price: 85,
      originalPrice: 110,
      discount: 23,
      rating: 4.4,
      reviews: 760,
      image: "https://spmc.gov.lk/?w=630&h=630&src=resources/237/p.jpg",
      inStock: true,
      prescription: true,
      description: "Acid reflux and heartburn relief"
    },
    {
      id: 8,
      name: "Aspirin 75mg",
      brand: "Bayer",
      category: "heart",
      price: 65,
      originalPrice: 85,
      discount: 24,
      rating: 4.6,
      reviews: 1340,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
      inStock: true,
      prescription: true,
      description: "Blood thinner and cardiovascular protection"
    }
  ];

  const healthTips = [
    {
      title: "5 Tips for Boosting Immunity Naturally",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      readTime: "3 min read",
      category: "Wellness"
    },
    {
      title: "How to Take Medicines Safely & Effectively",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      readTime: "4 min read",
      category: "Safety"
    },
    {
      title: "Daily Vitamin Routine for Better Health",
      image: "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=",
      readTime: "5 min read",
      category: "Nutrition"
    }
  ];

  const toggleWishlist = (medicineId) => {
    setWishlist(prev => 
      prev.includes(medicineId) 
        ? prev.filter(id => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const filteredMedicines = medicines.filter(medicine => 
    selectedCategory === "all" || medicine.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-20 px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Trusted
            <span className="block bg-gradient-to-r from-yellow-300 to-emerald-300 bg-clip-text text-transparent">
              Online Pharmacy 💊
            </span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get genuine medicines, healthcare products, and expert advice delivered to your doorstep
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Search medicines, brands, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl"
            />
          </div>

          <button className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
            Shop Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <span className="font-semibold text-gray-900">Free Delivery</span>
              <span className="text-sm text-gray-500">Above ₹499</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">100% Genuine</span>
              <span className="text-sm text-gray-500">Quality Assured</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">24/7 Support</span>
              <span className="text-sm text-gray-500">Always Available</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-3">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <span className="font-semibold text-gray-900">Easy Returns</span>
              <span className="text-sm text-gray-500">7 Days Policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-emerald-500 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:shadow-md"
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Medicines</h2>
              <p className="text-gray-600 mt-2">Carefully selected for your health needs</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <img
                    src={med.image}
                    alt={med.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Discount Badge */}
                  {med.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {med.discount}% OFF
                    </div>
                  )}
                  
                  {/* Prescription Badge */}
                  {med.prescription && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Rx Required
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(med.id)}
                    className={`absolute top-12 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                      wishlist.includes(med.id)
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <Heart 
                      size={18} 
                      className={wishlist.includes(med.id) ? "fill-current" : ""}
                    />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{med.name}</h3>
                    <p className="text-sm text-gray-500">{med.brand}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{med.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                      <Star size={14} fill="currentColor" className="text-yellow-500" />
                      <span className="text-sm font-semibold text-emerald-700">{med.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({med.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-emerald-600">₹{med.price}</span>
                    {med.originalPrice > med.price && (
                      <span className="text-gray-400 line-through text-sm">₹{med.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🎉 Special Health Festival Sale!
              </h2>
              <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
                Get up to 50% off on healthcare essentials + FREE delivery on all orders
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Extra 10% off</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Free Health Checkup</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Doctor Consultation</span>
              </div>
              <button className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:scale-105 transition-all duration-300">
                Explore All Offers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Health & Wellness Tips</h2>
            <p className="text-gray-600 text-lg">Expert advice to keep you healthy and informed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tip.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                    {tip.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{tip.readTime}</span>
                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1">
                      Read More
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 md:px-20 bg-gradient-to-r from-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Healthy & Informed</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Subscribe to get health tips, medicine updates, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicineStore;