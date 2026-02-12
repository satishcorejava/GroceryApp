import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Search as SearchIcon, X } from "lucide-react";
import { products, categories } from "../data/products";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useCart } from "../hooks/useCart";
import { ProductCard } from "../components/ProductCard";

export function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem("recent-searches");
    return stored ? JSON.parse(stored) : [];
  });

  const filteredProducts = searchQuery.trim().length >= 3
    ? products.filter((product) => {
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      })
    : [];

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery.trim()) {
      params.q = searchQuery;
    }
    if (selectedCategory) {
      params.category = selectedCategory;
    }
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 3 && !recentSearches.includes(query.trim())) {
      const updated = [query.trim(), ...recentSearches.slice(0, 9)];
      setRecentSearches(updated);
      localStorage.setItem("recent-searches", JSON.stringify(updated));
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent-searches");
  };

  const removeRecentSearch = (query: string) => {
    const updated = recentSearches.filter((q) => q !== query);
    setRecentSearches(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  const getProductQuantity = (productId: string) => {
    return cartItems.find((item) => item.product.id === productId)?.quantity || 0;
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentQuantity = getProductQuantity(productId);
    if (quantity === 0) {
      updateQuantity(productId, 0);
    } else if (currentQuantity === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="hover:bg-white/20 rounded-lg p-1 transition-colors active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold">Search</h1>
        </div>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 bg-white"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Filter - Horizontal Scroll */}
        <div className="mb-4 -mx-4 px-4">
          <h3 className="text-sm mb-3">Filter by Category</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("")}
              className={`flex flex-col items-center flex-shrink-0 ${
                !selectedCategory ? "opacity-100" : "opacity-60"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-lg flex items-center justify-center mb-1 ${
                  !selectedCategory
                    ? "bg-green-600 border-2 border-green-600"
                    : "bg-gray-100 border-2 border-transparent"
                }`}
              >
                <span className={`text-2xl ${!selectedCategory ? "text-white" : ""}`}>
                  🏪
                </span>
              </div>
              <span className={`text-xs text-center ${!selectedCategory ? "text-green-600" : "text-gray-600"}`}>
                All
              </span>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center flex-shrink-0 ${
                  selectedCategory === category.id ? "opacity-100" : "opacity-60"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-lg overflow-hidden mb-1 border-2 ${
                    selectedCategory === category.id
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-xs text-center ${selectedCategory === category.id ? "text-green-600" : "text-gray-600"}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {searchQuery.trim().length < 3 ? (
          <div>
            {/* Hint when typing */}
            {searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  Type at least 3 characters to search
                </p>
              </div>
            )}
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2>Recent Searches</h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-green-600"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {recentSearches.map((query, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded-lg p-3"
                    >
                      <button
                        onClick={() => handleRecentSearchClick(query)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <SearchIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{query}</span>
                      </button>
                      <button
                        onClick={() => removeRecentSearch(query)}
                        className="p-1"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Search Results */
          <div>
            <p className="text-sm text-gray-600 mb-4">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getProductQuantity(product.id)}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-600 mb-2">No products found</h3>
                <p className="text-sm text-gray-500">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}