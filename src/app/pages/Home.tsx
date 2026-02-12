import { Search, MapPin, ChevronRight, Map } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { categories, products } from "../data/products";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useCart } from "../hooks/useCart";
import { useLocation } from "../hooks/useLocation";
import { ProductCard } from "../components/ProductCard";
import { LocationMapSelector } from "../components/LocationMapSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function Home() {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { location, setLocation, presetLocations } = useLocation();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [customLocationName, setCustomLocationName] = useState("");
  const [customZipCode, setCustomZipCode] = useState("");
  const featuredProducts = products.filter((p) => p.discount);

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

  const handleLocationSelect = (locName: string, zipCode: string) => {
    setLocation({
      id: Date.now().toString(),
      name: locName,
      zipCode: zipCode,
    });
    setIsLocationDialogOpen(false);
    setShowMapSelector(false);
    setCustomLocationName("");
    setCustomZipCode("");
  };

  const handleMapLocationSelect = (lat: number, lng: number, address: string) => {
    // Extract zip code from address or use coordinates as fallback
    let zipCode = customZipCode;
    if (!zipCode) {
      zipCode = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }

    handleLocationSelect(customLocationName || address, zipCode);
  };

  const handleCustomLocationSave = () => {
    if (customLocationName.trim() && customZipCode.trim()) {
      handleLocationSelect(customLocationName, customZipCode);
    }
  };

  return (
    <div className="pb-20 lg:pb-6 bg-white">
      {/* Header - Professional Delivery App Style (hidden on desktop - sidebar has logo) */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 lg:relative">
        <div className="px-4 lg:px-6 py-3 lg:py-4">
          {/* Top Bar - Logo and Location */}
          <div className="flex items-center justify-between mb-3">
            <h1 
              className="text-2xl lg:text-3xl font-bold tracking-tight lg:hidden"
              style={{ 
                fontFamily: "'Playfair Display', Georgia, serif",
                background: "linear-gradient(135deg, #166534 0%, #16a34a 50%, #22c55e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Cornucopia
            </h1>
            <h2 className="hidden lg:block text-xl font-semibold text-gray-900">Welcome back!</h2>
            <button 
              onClick={() => setIsLocationDialogOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">{location.zipCode}</span>
            </button>
          </div>

          {/* Search Bar - Clean and Professional */}
          <div className="relative mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 w-full h-11 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              onClick={() => navigate("/search")}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Delivery Info Banner */}
      <div className="px-4 py-3 bg-green-50 border-b border-green-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">🚚 Delivery in 30-45 mins</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Shop by Category</h2>
          <button 
            onClick={() => navigate("/categories")}
            className="text-green-600 text-sm flex items-center gap-1 font-medium hover:text-green-700 transition-colors"
          >
            See all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/categories/${category.id}`)}
              className="flex flex-col items-center p-3 bg-white rounded-xl hover:shadow-md transition-all active:scale-95 border border-gray-100"
            >
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden mb-2 shadow-sm">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-center font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Deals - Promotion Banner */}
      <div className="px-4 mt-7">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <h3 className="font-bold text-lg mb-1">Special Deals 🔥</h3>
          <p className="text-sm opacity-90 mb-3">Save up to 40% on selected items</p>
          <button 
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all"
            onClick={() => navigate("/categories")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Deals Products Grid */}
      <div className="px-4 lg:px-6 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getProductQuantity(product.id)}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-4 mt-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Popular Products</h2>
          <button 
            onClick={() => navigate("/categories")}
            className="text-green-600 text-sm flex items-center gap-1 font-medium hover:text-green-700 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {products.slice(0, 3).map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex gap-3 bg-white border border-gray-100 rounded-lg p-3 w-full text-left hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.98]"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1 text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">
                  {product.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm">₹{product.price}</span>
                  <span className="text-xs text-gray-400">/{product.unit}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Selection Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent 
          className={`${
            showMapSelector ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-sm"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="text-gray-900">Select Delivery Location</DialogTitle>
          </DialogHeader>

          {!showMapSelector ? (
            <div className="space-y-4">
              {/* Preset Locations */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Popular Locations</h3>
                <div className="space-y-2">
                  {presetLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleLocationSelect(loc.name, loc.zipCode)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-colors text-left"
                    >
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{loc.name}</p>
                        <p className="text-xs text-gray-500">{loc.zipCode}</p>
                      </div>
                      {location.zipCode === loc.zipCode && (
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Custom Location Input Option */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Enter Custom Location</h3>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Location name (e.g., Home, Office)"
                    value={customLocationName}
                    onChange={(e) => setCustomLocationName(e.target.value)}
                    className="h-10 bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  <Input
                    type="text"
                    placeholder="Zip code"
                    value={customZipCode}
                    onChange={(e) => setCustomZipCode(e.target.value)}
                    className="h-10 bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomLocationSave}
                      disabled={!customLocationName.trim() || !customZipCode.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition-colors active:scale-95"
                    >
                      Save Location
                    </button>
                    <button
                      onClick={() => setShowMapSelector(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 font-semibold py-2.5 rounded-lg transition-colors active:scale-95"
                    >
                      <Map className="w-4 h-4" />
                      Select on Map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Back Button */}
              <button
                onClick={() => setShowMapSelector(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                ← Back to List
              </button>

              {/* Map Selector */}
              <LocationMapSelector
                onLocationSelect={(lat, lng, address) => {
                  handleMapLocationSelect(lat, lng, address);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}