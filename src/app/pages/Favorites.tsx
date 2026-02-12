import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { products } from "../data/products";
import { useCart } from "../hooks/useCart";

export function Favorites() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [favorites, setFavorites] = useState(
    products.filter((p) => ["1", "3", "5", "7", "9"].includes(p.id))
  );

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/account")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold">My Favorites</h1>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">No favorites yet</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Start adding products to your favorites to see them here
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Start Shopping
          </motion.button>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-3">
          {favorites.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Remove Button */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{product.unit}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-green-600">
                      ₹{product.price}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(product)}
                    className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-md"
                  >
                    <span className="text-white font-bold text-lg">+</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
