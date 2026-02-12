import { categories } from "../data/products";
import { motion } from "motion/react";

interface VerticalCategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function VerticalCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: VerticalCategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white w-full space-y-2 p-2"
    >
      {/* All Categories Button */}
      <motion.button
        onClick={() => onCategoryChange(null)}
        whileTap={{ scale: 0.98 }}
        className={`w-full p-2 rounded-xl transition-all flex flex-col items-center gap-2 ${
          !selectedCategory
            ? "bg-green-600 text-white shadow-md"
            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
        }`}
      >
        <span className="text-3xl">📁</span>
        <p className="font-semibold text-xs break-words whitespace-normal leading-tight text-center">All</p>
      </motion.button>

      {/* Category Items - Cards with Icon and Name */}
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-2 rounded-xl transition-all flex flex-col items-center gap-2 ${
            selectedCategory === category.id
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <span className="text-3xl">{category.icon}</span>
          <p className="font-semibold text-xs break-words whitespace-normal leading-tight text-center">{category.name}</p>
        </motion.button>
      ))}
    </motion.div>
  );
}
