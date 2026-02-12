import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import { categories, products, subCategories } from "../data/products";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { ProductCard } from "../components/ProductCard";
import { VerticalCategoryFilter } from "../components/VerticalCategoryFilter";
import { SubCategoryFilter } from "../components/SubCategoryFilter";

export function Categories() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const { cartItems, addToCart, updateQuantity } = useCart();

  const handleCategoryChange = (newCategoryId: string | null) => {
    setSelectedCategoryId(newCategoryId);
    setSelectedSubcategoryId(null); // Reset subcategory when changing category
    if (newCategoryId) {
      navigate(`/categories/${newCategoryId}`);
    } else {
      navigate("/categories");
    }
  };

  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)
    : null;

  // Get subcategories for selected category
  const categorySubcategories = selectedCategoryId
    ? subCategories.filter((s) => s.categoryId === selectedCategoryId)
    : [];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategoryId
      ? product.category === selectedCategoryId
      : true;
    const matchesSubcategory = selectedSubcategoryId
      ? product.subcategory === selectedSubcategoryId
      : true;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const handleSearchFocus = () => {
    navigate(
      `/search${selectedCategoryId ? `?category=${selectedCategoryId}` : ""}`
    );
  };

  const getProductQuantity = (productId: string) => {
    return (
      cartItems.find((item) => item.product.id === productId)?.quantity || 0
    );
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Minimal & Clean (Blink Style) */}
      <div className="bg-white border-b border-gray-100 p-3 sm:p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 ml-2">
            {selectedCategory ? selectedCategory.name : "Categories"}
          </h1>
        </div>

        {/* Search Bar - Clean and Minimal */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 bg-gray-50 border-gray-200 text-sm"
            onClick={handleSearchFocus}
            readOnly
          />
        </div>
      </div>

      {/* Main Content - Blink Style Layout */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Fixed Sidebar - Minimal Icons (Blink Style) */}
        <div className="w-[94px] sm:w-[110px] md:w-[110px] lg:w-[126px] bg-white border-r border-gray-100 fixed left-0 top-24 bottom-16 overflow-y-auto p-1 sm:p-2 space-y-1 z-10">
          <VerticalCategoryFilter
            selectedCategory={selectedCategoryId as string | undefined}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Products Section - Large, Prominent Cards */}
        <div className="flex-1 ml-[94px] sm:ml-[110px] md:ml-[110px] lg:ml-[126px] overflow-y-auto pb-16">
          <div className="p-2 sm:p-3 lg:p-4 bg-white">
            {/* Product Count */}
            {filteredProducts.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 mb-3 font-medium">
                {filteredProducts.length} products
              </p>
            )}

            {/* Products Grid - Blink Style with Larger Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={getProductQuantity(product.id)}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}