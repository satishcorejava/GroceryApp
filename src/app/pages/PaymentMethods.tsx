import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Plus, Trash2, Star } from "lucide-react";
import { motion } from "motion/react";

interface PaymentMethod {
  id: string;
  type: "card" | "upi";
  name: string;
  last4?: string;
  brand?: string;
  upiId?: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa",
      brand: "Visa",
      last4: "4242",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      name: "Mastercard",
      brand: "Mastercard",
      last4: "8888",
      isDefault: false,
    },
    {
      id: "3",
      type: "upi",
      name: "UPI",
      upiId: "john@upi",
      isDefault: false,
    },
  ]);

  const deleteMethod = (id: string) => {
    setMethods(methods.filter((method) => method.id !== id));
  };

  const getCardIcon = (brand: string) => {
    // In a real app, you'd use actual card brand icons
    return "💳";
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
          <h1 className="font-bold">Payment Methods</h1>
        </div>
      </div>

      {/* Add New Method */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Payment Method</span>
        </motion.button>
      </div>

      {/* Payment Methods List */}
      <div className="px-4 space-y-3">
        {methods.map((method) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                {method.type === "card" ? (
                  <CreditCard className="w-6 h-6 text-blue-600" />
                ) : (
                  <span className="text-2xl">📱</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">
                    {method.type === "card"
                      ? `${method.brand} •••• ${method.last4}`
                      : method.upiId}
                  </h3>
                  {method.isDefault && (
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 text-green-600 fill-green-600" />
                      <span className="text-xs text-green-600 font-semibold">
                        Default
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {method.type === "card" ? "Credit/Debit Card" : "UPI Payment"}
                </p>
              </div>

              <button
                onClick={() => deleteMethod(method.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            {!method.isDefault && (
              <button className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700">
                Set as Default
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <div className="px-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">ℹ️</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Secure Payments
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
