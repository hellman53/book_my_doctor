// components/MedicineStore/ProductCard.js
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ medicine, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Discount Badge */}
        {medicine.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            {medicine.discount}% OFF
          </div>
        )}
        
        {/* Prescription Badge */}
        {medicine.prescriptionRequired && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
            Rx
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {medicine.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {medicine.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{medicine.price}
            </span>
            {medicine.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{medicine.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-yellow-400">
            {'★'.repeat(Math.floor(medicine.rating))}
            {'☆'.repeat(5 - Math.floor(medicine.rating))}
            <span className="text-gray-500 text-sm ml-1">({medicine.reviews})</span>
          </div>
        </div>

        {/* Manufacturer */}
        <div className="text-xs text-gray-500 mb-4">
          By {medicine.manufacturer}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart(medicine)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}