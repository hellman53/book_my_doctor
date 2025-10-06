// components/MedicineStore/ProductGrid.js
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

export default function ProductGrid({ medicines, onAddToCart }) {
  if (medicines.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-gray-500 text-xl">No medicines found matching your criteria.</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {medicines.map((medicine, index) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            layout
          >
            <ProductCard medicine={medicine} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}