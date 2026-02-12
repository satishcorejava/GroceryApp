import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Heart, Share2, Minus, Plus, Repeat, Check, Star, ShoppingCart } from "lucide-react";
import { products } from "../data/products";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useState, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useSubscription, SubscriptionFrequency } from "../hooks/useSubscription";
import { useReviews, Review } from "../hooks/useReviews";
import { SubscriptionModal } from "../components/SubscriptionModal";
import { ReviewModal } from "../components/ReviewModal";
import { ProductReviews } from "../components/ProductReviews";
import { useTranslation } from "../contexts/TranslationContext";

// Define available unit options for products
const UNIT_OPTIONS: { [key: string]: { label: string; multiplier: number }[] } = {
  kg: [
    { label: "1 kg", multiplier: 1 },
    { label: "500 g", multiplier: 0.5 },
    { label: "250 g", multiplier: 0.25 },
  ],
  liter: [
    { label: "1 L", multiplier: 1 },
    { label: "500 ml", multiplier: 0.5 },
  ],
  piece: [
    { label: "1 piece", multiplier: 1 },
    { label: "2 pieces", multiplier: 2 },
    { label: "5 pieces", multiplier: 5 },
  ],
  bunch: [
    { label: "1 bunch", multiplier: 1 },
    { label: "2 bunches", multiplier: 2 },
  ],
  loaf: [
    { label: "1 loaf", multiplier: 1 },
    { label: "2 loaves", multiplier: 2 },
  ],
  cup: [
    { label: "1 cup", multiplier: 1 },
    { label: "2 cups", multiplier: 2 },
  ],
  block: [
    { label: "1 block", multiplier: 1 },
    { label: "2 blocks", multiplier: 2 },
  ],
  jar: [
    { label: "1 jar", multiplier: 1 },
    { label: "2 jars", multiplier: 2 },
  ],
  box: [
    { label: "1 box", multiplier: 1 },
    { label: "2 boxes", multiplier: 2 },
  ],
  dozen: [
    { label: "1 dozen", multiplier: 1 },
    { label: "2 dozen", multiplier: 2 },
  ],
};

export function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { addToCart } = useCart();
  const { addSubscription, isProductSubscribed } = useSubscription();
  const {
    reviews,
    isLoading: reviewsLoading,
    getReviewSummary,
    addReview,
    updateReview,
    deleteReview,
    markHelpful,
    hasUserReviewed,
    getUserReview,
  } = useReviews(productId);

  const product = products.find((p) => p.id === productId);

  // Get Frequently Bought Together products
  const frequentlyBoughtTogether = useMemo(() => {
    if (!product) return [];
    
    // Get products from same category and other complementary categories
    const complementaryCategories: { [key: string]: string[] } = {
      vegetables: ["fruits", "dairy", "bakery"],
      fruits: ["vegetables", "dairy", "bakery"],
      dairy: ["bakery", "vegetables", "fruits"],
      bakery: ["dairy", "fruits"],
      meat: ["vegetables", "dairy"],
      beverages: ["bakery", "dairy"],
    };
    
    const relatedCategories = complementaryCategories[product.category] || [];
    
    // Get products from same category (excluding current product)
    const sameCategoryProducts = products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    
    // Get products from complementary categories
    const complementaryProducts = products.filter(
      (p) => relatedCategories.includes(p.category)
    );
    
    // Combine and shuffle, then take first 4
    const combined = [...sameCategoryProducts, ...complementaryProducts];
    const shuffled = combined.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [product]);

  // State for FBT selected items
  const [selectedFBT, setSelectedFBT] = useState<Set<string>>(new Set());

  const toggleFBTSelection = (productId: string) => {
    setSelectedFBT(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addSelectedFBTToCart = () => {
    selectedFBT.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        addToCart(prod, 1);
      }
    });
    // Also add current product
    addToCart(product!, 1);
    navigate("/cart");
  };

  const getFBTTotalPrice = () => {
    let total = product ? (product.discount ? product.price * (1 - product.discount / 100) : product.price) : 0;
    selectedFBT.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        total += prod.discount ? prod.price * (1 - prod.discount / 100) : prod.price;
      }
    });
    return total;
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Product not found</p>
      </div>
    );
  }

  // Get available unit options for this product
  const availableUnits = UNIT_OPTIONS[product.unit] || [
    { label: `1 ${product.unit}`, multiplier: 1 },
  ];
  const selectedUnit = availableUnits[selectedUnitIndex];
  const unitMultiplier = selectedUnit.multiplier;

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
  
  const adjustedPrice = finalPrice * unitMultiplier;
  const adjustedMRP = product.mrp * unitMultiplier;
  const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const handleSubscribe = (frequency: SubscriptionFrequency, qty: number, startDate: string) => {
    const success = addSubscription(product, frequency, qty, startDate);
    if (success) {
      // Could show a toast notification here
      console.log("Subscription added successfully");
    }
  };

  const isSubscribed = isProductSubscribed(product.id);

  const reviewSummary = getReviewSummary();
  const userReview = getUserReview(product.id);

  const handleSubmitReview = async (rating: number, title: string, comment: string) => {
    if (editingReview) {
      const success = await updateReview(editingReview.id, { rating, title, comment });
      setEditingReview(null);
      return success;
    }
    return addReview({ productId: product.id, rating, title, comment });
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
  };

  return (
    <div className="min-h-screen bg-white pb-36">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
            <button className="p-2">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative">
        {product.discount && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10">
            -{product.discount}% OFF
          </Badge>
        )}
        <div className="w-full h-80 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="flex-1 pr-4">{product.name}</h1>
          {product.inStock ? (
            <Badge className="bg-green-100 text-green-700">{t("products.inStock")}</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700">{t("products.outOfStock")}</Badge>
          )}
        </div>

        {/* Rating Summary (compact) */}
        {reviewSummary.totalReviews > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded">
              <span className="text-sm font-bold">{reviewSummary.averageRating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-sm text-gray-500">
              {reviewSummary.totalReviews} {t("reviews.reviews") || "reviews"}
            </span>
          </div>
        )}

        <p className="text-gray-600 mb-4">{product.description}</p>

        {/* Price */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-600">₹{adjustedPrice.toFixed(2)}</span>
            <span className="text-gray-500">/{selectedUnit.label}</span>
          </div>
          {adjustedMRP > adjustedPrice && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm text-gray-500">MRP</span>
              <span className="text-lg text-gray-400 line-through">
                ₹{adjustedMRP.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-white bg-green-600 px-2 py-1 rounded">
                {discountPercentage}% off
              </span>
            </div>
          )}
        </div>

        {/* Unit Selection */}
        {availableUnits.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("products.selectUnit")}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableUnits.map((unit, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUnitIndex(index)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedUnitIndex === index
                      ? "border-green-600 bg-green-50 text-green-600"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="border-t border-b py-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("products.category")}</span>
            <span className="capitalize">{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("products.unit")}</span>
            <span>{product.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("products.status")}</span>
            <span className={product.inStock ? "text-green-600" : "text-red-600"}>
              {product.inStock ? t("products.available") : t("products.outOfStock")}
            </span>
          </div>
        </div>

        {/* Nutrition Info (placeholder) */}
        <div className="mb-6">
          <h2 className="mb-3">{t("products.nutritionFacts")}</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("products.servingSize")}</span>
              <span>1 {product.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("products.calories")}</span>
              <span>{t("products.varies")}</span>
            </div>
          </div>
        </div>

        {/* Subscribe & Save Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Repeat className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">
                {t("subscription.subscribeAndSave") || "Subscribe & Save 5%"}
              </h3>
              <p className="text-sm text-green-700 mt-1">
                {t("subscription.subscribeDescription") || "Get regular deliveries and save extra 5%"}
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <Check className="w-4 h-4" />
                    {t("subscription.alreadySubscribed") || "You're subscribed to this product"}
                  </span>
                  <button
                    onClick={() => navigate("/account/subscriptions")}
                    className="text-sm text-green-700 underline hover:text-green-800"
                  >
                    {t("subscription.manage") || "Manage"}
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => setShowSubscriptionModal(true)}
                >
                  <Repeat className="w-4 h-4 mr-1" />
                  {t("subscription.subscribe") || "Subscribe"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mb-6">
          <ProductReviews
            reviews={reviews}
            summary={reviewSummary}
            isLoading={reviewsLoading}
            onMarkHelpful={markHelpful}
            onWriteReview={() => {
              setEditingReview(null);
              setShowReviewModal(true);
            }}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
            hasUserReviewed={hasUserReviewed(product.id)}
            userReview={userReview}
          />
        </div>

        {/* Frequently Bought Together Section */}
        {frequentlyBoughtTogether.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Frequently Bought Together</h2>
            
            {/* Product Cards Grid */}
            <div className="space-y-3">
              {/* Current Product */}
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-sm text-green-600 font-semibold">
                    ₹{(product.discount ? product.price * (1 - product.discount / 100) : product.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-6 h-6 bg-green-600 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Suggested Products */}
              {frequentlyBoughtTogether.map((fbtProduct) => (
                <div 
                  key={fbtProduct.id}
                  onClick={() => toggleFBTSelection(fbtProduct.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedFBT.has(fbtProduct.id) 
                      ? "bg-green-50 border-green-200" 
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={fbtProduct.image} alt={fbtProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{fbtProduct.name}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm text-green-600 font-semibold">
                        ₹{(fbtProduct.discount ? fbtProduct.price * (1 - fbtProduct.discount / 100) : fbtProduct.price).toFixed(2)}
                      </p>
                      {fbtProduct.discount && (
                        <span className="text-xs text-gray-400 line-through">₹{fbtProduct.price}</span>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                    selectedFBT.has(fbtProduct.id)
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300"
                  }`}>
                    {selectedFBT.has(fbtProduct.id) && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Selected to Cart Button */}
            {selectedFBT.size > 0 && (
              <Button
                onClick={addSelectedFBTToCart}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add {selectedFBT.size + 1} items to cart - ₹{getFBTTotalPrice().toFixed(2)}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        product={product}
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
      />

      {/* Review Modal */}
      <ReviewModal
        product={product}
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setEditingReview(null);
        }}
        onSubmit={handleSubmitReview}
        existingReview={
          editingReview
            ? {
                rating: editingReview.rating,
                title: editingReview.title,
                comment: editingReview.comment,
              }
            : undefined
        }
      />

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 lg:left-64 bg-white border-t p-4 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 border-x">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {t("products.addToCart")} - ₹{(adjustedPrice * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
