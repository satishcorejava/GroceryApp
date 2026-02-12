import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useTranslation } from "../contexts/TranslationContext";
import { Button } from "../components/ui/button";

export function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, getTotal } = useCart();

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + tax + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-20 bg-gray-50">
        <div className="bg-white rounded-3xl p-8 shadow-lg max-w-sm w-full text-center">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="mb-2 font-bold text-gray-800">{t("cart.empty")}</h2>
          <p className="text-gray-500 mb-6 text-sm">
            {t("cart.emptyMessage")}
          </p>
          <Button
            onClick={() => navigate("/categories")}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-6 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            {t("cart.startShopping")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-72 lg:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 lg:p-6 sticky top-0 z-10 shadow-lg lg:rounded-t-2xl">
        <h1 className="font-bold text-lg lg:text-xl">{t("cart.title")} ({cartItems.length})</h1>
      </div>

      {/* Main Content - Two column layout on desktop */}
      <div className="lg:flex lg:gap-6 lg:p-6">
        {/* Cart Items */}
        <div className="p-4 lg:p-0 space-y-3 lg:flex-1">
          {cartItems.map((item) => {
            const finalPrice = item.product.discount
              ? item.product.price * (1 - item.product.discount / 100)
              : item.product.price;

            return (
            <div
              key={item.product.id}
              className="bg-white rounded-xl p-4 flex gap-3 shadow-sm border border-gray-100"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-1 text-gray-800">{item.product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 font-bold">
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  {item.product.discount && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.product.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    /{item.product.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors active:scale-90"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors active:scale-90"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Promo Code Section */}
        <div className="px-4 lg:px-0 mb-4 lg:hidden">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Have a promo code?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 font-semibold active:scale-95 transition-transform">
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Summary */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                  Apply
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("cart.subtotal")}</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("cart.tax")}</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("cart.deliveryFee")}</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">{t("cart.freeDelivery")}</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {subtotal < 50 && subtotal > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-xs text-green-700 font-medium">
                    Add ₹{(50 - subtotal).toFixed(2)} more for free delivery 🎉
                  </p>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-lg">{t("cart.total")}</span>
                  <span className="text-green-600 font-bold text-lg">₹{total.toFixed(2)}</span>
                </div>
                
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl font-bold text-base shadow-md active:scale-95 transition-transform"
                >
                  {t("cart.proceedCheckout")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Summary - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t shadow-2xl z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("cart.subtotal")}</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("cart.tax")}</span>
            <span className="font-semibold">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t("cart.deliveryFee")}</span>
            <span className="font-semibold">
              {deliveryFee === 0 ? (
                <span className="text-green-600 font-bold">{t("cart.freeDelivery")}</span>
              ) : (
                `₹${deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>
          
          {subtotal < 50 && subtotal > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
              <p className="text-xs text-green-700 font-medium">
                {t("cart.freeDeliveryMessage", `Add ₹${(50 - subtotal).toFixed(2)} more for free delivery 🎉`)}
              </p>
            </div>
          )}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between mb-4">
              <span className="font-bold text-lg">{t("cart.total")}</span>
              <span className="text-green-600 font-bold text-lg">₹{total.toFixed(2)}</span>
            </div>
            
            <Button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl font-bold text-base shadow-md active:scale-95 transition-transform"
            >
              {t("cart.proceedCheckout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}