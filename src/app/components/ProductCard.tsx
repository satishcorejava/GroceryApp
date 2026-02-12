import { Plus, Minus, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { Product } from "../data/products";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

// Generate consistent mock review data based on product ID
function getProductReviewData(productId: string): { rating: number; count: number } {
  // Use product ID to generate consistent pseudo-random values
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 3.5 + (hash % 16) / 10; // Rating between 3.5 and 5.0
  const count = 10 + (hash % 200); // Review count between 10 and 209
  return { rating: Math.round(rating * 10) / 10, count };
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, quantity, onQuantityChange }: ProductCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const reviewData = useMemo(() => getProductReviewData(product.id), [product.id]);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuantityChange(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      onQuantityChange(product.id, quantity - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all active:scale-[0.98] cursor-pointer border border-gray-100"
    >
      {/* Image Container - Larger */}
      <div className="relative w-full h-40 sm:h-48 bg-gray-50 overflow-hidden">
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10 shadow-sm text-xs">
            -{product.discount}% off
          </Badge>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info - Blink Style */}
      <div className="p-2 sm:p-3 flex flex-col">
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-medium line-clamp-2 text-gray-900 mb-1">
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-700">{reviewData.rating}</span>
          <span className="text-xs text-gray-400">({reviewData.count})</span>
        </div>

        {/* Price and Unit */}
        <div className="flex justify-between items-baseline gap-1 mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ₹{product.price}
            </span>
            <span className="text-xs text-gray-500">/{product.unit}</span>
          </div>
          {product.mrp > product.price && (
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400">MRP</span>
              <span className="text-xs text-gray-500 line-through">
                ₹{product.mrp}
              </span>
            </div>
          )}
        </div>

        {/* Quantity Controls - Blink Style */}
        <div className="mt-auto">
          {quantity > 0 ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-1 bg-green-50 border-2 border-green-600 rounded-lg py-1"
            >
              <button
                onClick={handleDecrement}
                className="w-6 h-6 flex items-center justify-center text-green-600 hover:bg-green-100 rounded transition-colors active:scale-90"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-green-600 font-bold text-sm w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center text-green-600 hover:bg-green-100 rounded transition-colors active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <button
              onClick={handleIncrement}
              className="w-full bg-green-600 text-white rounded-lg py-2 flex items-center justify-center hover:bg-green-700 transition-all active:scale-95 font-semibold text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}