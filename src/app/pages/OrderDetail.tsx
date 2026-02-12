import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Package, MapPin, Clock, CreditCard, Phone } from "lucide-react";
import { motion } from "motion/react";

export function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Mock order data
  const order = {
    id: orderId,
    orderNumber: "ORD-2026-001234",
    date: "2026-02-09",
    status: "confirmed",
    deliveryDate: "2026-02-10",
    deliveryTime: "11:00 AM - 12:00 PM",
    items: [
      { name: "Fresh Tomatoes", quantity: 2, price: 2.70, unit: "500g" },
      { name: "Organic Milk", quantity: 1, price: 4.20, unit: "1L" },
      { name: "Whole Wheat Bread", quantity: 1, price: 3.50, unit: "400g" },
      { name: "Fresh Eggs", quantity: 2, price: 5.80, unit: "12 pcs" },
      { name: "Greek Yogurt", quantity: 1, price: 3.60, unit: "500g" },
    ],
    subtotal: 45.80,
    delivery: 2.00,
    discount: 5.00,
    total: 42.80,
    paymentMethod: "Credit Card •••• 4242",
    address: {
      name: "Home",
      street: "123 Main Street",
      city: "New York, NY 10001",
    },
    driver: {
      name: "John Smith",
      phone: "+1 (555) 987-6543",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/account/orders")}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold">Order Details</h1>
              <p className="text-xs opacity-90">{order.orderNumber}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/account/order/${orderId}`)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Track
          </button>
        </div>
      </div>

      {/* Order Status */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Order Confirmed</h3>
              <p className="text-sm text-gray-500">Out for delivery</p>
            </div>
            <div className="bg-blue-50 px-3 py-1.5 rounded-full">
              <span className="text-xs font-semibold text-blue-600">In Transit</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Expected Delivery</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} • {order.deliveryTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Delivery Address
        </h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">{order.address.name}</h4>
              <p className="text-sm text-gray-600">{order.address.street}</p>
              <p className="text-sm text-gray-600">{order.address.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Delivery Partner
        </h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600">JS</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{order.driver.name}</h4>
              <p className="text-sm text-gray-500">Delivery Partner</p>
            </div>
            <a
              href={`tel:${order.driver.phone}`}
              className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Order Items ({order.items.length})
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`p-4 flex items-center justify-between ${
                index !== order.items.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">×{item.quantity}</p>
                <p className="text-sm font-semibold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Payment Summary
        </h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800">₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="text-gray-800">₹{order.delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="text-green-600">-₹{order.discount.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-between">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-bold text-green-600 text-lg">
              ₹{order.total.toFixed(2)}
            </span>
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-green-600 text-green-600 rounded-xl p-3 font-semibold hover:bg-green-50 transition-colors"
        >
          Reorder
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-gray-300 text-gray-700 rounded-xl p-3 font-semibold hover:bg-gray-50 transition-colors"
        >
          Get Help
        </motion.button>
      </div>
    </div>
  );
}
