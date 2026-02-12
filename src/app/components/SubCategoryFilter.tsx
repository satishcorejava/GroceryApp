import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { SubCategory } from "../data/products";

interface SubCategoryFilterProps {
  subcategories: SubCategory[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
}

export function SubCategoryFilter({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
}: SubCategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900">
          Sub Categories ({subcategories.length})
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </motion.div>
      </button>

      {/* Content */}
      <motion.div
        initial={{ height: "auto" }}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-gray-100"
      >
        <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
          {/* All Subcategories */}
          <button
            onClick={() => onSubcategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              selectedSubcategory === null
                ? "bg-green-50 border-l-4 border-green-600 text-green-700 font-semibold"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            All Sub Categories
          </button>

          {/* Individual Subcategories */}
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubcategoryChange(sub.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                selectedSubcategory === sub.id
                  ? "bg-green-50 border-l-4 border-green-600 text-green-700 font-semibold"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span>{sub.name}</span>
            </button>
          ))}

          {/* Clear Filter */}
          {selectedSubcategory && (
            <button
              onClick={() => onSubcategoryChange(null)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
