import { useState } from "react";
import { ArrowLeft, MapPin, Phone, User, Package, Clock, CheckCircle, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "../contexts/TranslationContext";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "completed";
  status: "assigned" | "in-transit" | "arrived" | "delivered";
  scheduledTime: string;
}

export function DeliveryAgent() {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orders] = useState<DeliveryOrder[]>([
    {
      id: "1",
      orderNumber: "ORD-2026-005401",
      customerName: "Rajesh Kumar",
      customerPhone: "+91 98765 43210",
      deliveryAddress: "123 Main Street, Apartment 4B, Downtown Area, City, 110001",
      items: [
        { name: "Fresh Tomatoes", quantity: 2, price: 3.99 },
        { name: "Green Apples", quantity: 1, price: 4.49 },
        { name: "Organic Milk", quantity: 1, price: 5.99 },
      ],
      total: 23.50,
      paymentMethod: "Pending",
      paymentStatus: "pending",
      status: "assigned",
      scheduledTime: "2:00 PM - 2:30 PM",
    },
    {
      id: "2",
      orderNumber: "ORD-2026-005402",
      customerName: "Priya Sharma",
      customerPhone: "+91 87654 32109",
      deliveryAddress: "456 Park Avenue, Building C, Tech Park, City, 110002",
      items: [
        { name: "Fresh Broccoli", quantity: 2, price: 3.49 },
        { name: "Red Carrots", quantity: 1, price: 2.49 },
        { name: "Spinach Salad Mix", quantity: 1, price: 4.99 },
        { name: "Fresh Chicken Breast", quantity: 1, price: 8.99 },
      ],
      total: 35.80,
      paymentMethod: "Pending",
      paymentStatus: "pending",
      status: "assigned",
      scheduledTime: "3:30 PM - 4:00 PM",
    },
    {
      id: "3",
      orderNumber: "ORD-2026-005403",
      customerName: "Amit Patel",
      customerPhone: "+91 76543 21098",
      deliveryAddress: "789 Oak Road, House No. 42, Residential Area, City, 110003",
      items: [
        { name: "Fresh Oranges", quantity: 1, price: 5.99 },
        { name: "Whole Wheat Bread", quantity: 2, price: 3.29 },
        { name: "Wild Salmon Fillet", quantity: 1, price: 14.99 },
      ],
      total: 45.20,
      paymentMethod: "Pending",
      paymentStatus: "pending",
      status: "in-transit",
      scheduledTime: "4:30 PM - 5:00 PM",
    },
    {
      id: "4",
      orderNumber: "ORD-2026-005404",
      customerName: "Neha Gupta",
      customerPhone: "+91 65432 10987",
      deliveryAddress: "321 Maple Lane, Suite 200, Commercial Complex, City, 110004",
      items: [
        { name: "Fresh Tomatoes", quantity: 3, price: 3.99 },
        { name: "Red Carrots", quantity: 2, price: 2.49 },
      ],
      total: 16.95,
      paymentMethod: "Cash",
      paymentStatus: "completed",
      status: "arrived",
      scheduledTime: "1:00 PM - 1:30 PM",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<"all" | "assigned" | "in-transit" | "arrived">("all");

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "assigned":
        return {
          icon: Package,
          color: "text-blue-600",
          bg: "bg-blue-50",
          label: "Assigned",
        };
      case "in-transit":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          label: "In Transit",
        };
      case "arrived":
        return {
          icon: MapPin,
          color: "text-purple-600",
          bg: "bg-purple-50",
          label: "Arrived",
        };
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
          label: "Delivered",
        };
      default:
        return {
          icon: Package,
          color: "text-gray-600",
          bg: "bg-gray-50",
          label: "Unknown",
        };
    }
  };

  const handlePayment = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0 z-30"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Delivery Orders</h1>
            <div className="text-sm">Agent Dashboard</div>
          </div>
          <div className="text-green-100 text-sm">
            Total Orders: {filteredOrders.length} | Pending Payment: {filteredOrders.filter(o => o.paymentStatus === "pending").length}
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-20 bg-white border-b">
        <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
          {(["all", "assigned", "in-transit", "arrived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterStatus === status
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No orders in this status</p>
          </motion.div>
        ) : (
          filteredOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500">{order.orderNumber}</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {order.customerName}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}
                    >
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                      <span className={`text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${order.customerPhone}`} className="text-green-600 hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <p>{order.deliveryAddress}</p>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Scheduled: <span className="font-semibold">{order.scheduledTime}</span>
                  </p>
                </div>

                {/* Items */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Items</p>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} <span className="text-gray-500">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Payment */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">₹{order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <p className={`text-sm font-semibold ${
                        order.paymentStatus === "pending"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {order.paymentStatus === "pending" ? "Pending" : "✓ Collected"}
                      </p>
                    </div>
                    {order.paymentStatus === "pending" && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment(order)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Collect Payment
                      </motion.button>
                    )}
                  </div>

                  {order.status === "assigned" && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Mark as In Transit
                    </motion.button>
                  )}

                  {order.status === "in-transit" && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Mark as Arrived
                    </motion.button>
                  )}

                  {order.status === "arrived" && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={order.paymentStatus === "pending"}
                    >
                      Mark as Delivered
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && selectedOrder && (
        <PaymentCollectionModal
          order={selectedOrder}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

interface PaymentCollectionModalProps {
  order: DeliveryOrder;
  onClose: () => void;
}

function PaymentCollectionModal({ order, onClose }: PaymentCollectionModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "pluxee" | "cash">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [pluxeeCode, setPluxeeCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = async () => {
    if (paymentMethod === "upi" && !upiId.trim()) {
      alert("Please enter UPI ID");
      return;
    }
    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert("Please enter complete card details");
      return;
    }
    if (paymentMethod === "pluxee" && !pluxeeCode.trim()) {
      alert("Please scan Pluxee code");
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      alert(`Payment of ₹${order.total.toFixed(2)} collected via ${paymentMethod.toUpperCase()}`);
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Collect Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">{order.orderNumber}</p>
          <p className="text-lg font-semibold text-gray-800 mb-3">{order.customerName}</p>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "upi", label: "UPI", icon: "📱" },
              { id: "card", label: "Card", icon: "💳" },
              { id: "pluxee", label: "Pluxee", icon: "🎫" },
              { id: "cash", label: "Cash", icon: "💵" },
            ].map((method) => (
              <motion.button
                key={method.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === method.id
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-sm font-medium text-gray-800">{method.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Payment Details Form */}
        <div className="mb-6">
          {paymentMethod === "upi" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="user@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                  maxLength={16}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "pluxee" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pluxee Code / QR Code
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <p className="text-2xl mb-2">📷</p>
                <input
                  type="text"
                  placeholder="Scan or enter Pluxee code"
                  value={pluxeeCode}
                  onChange={(e) => setPluxeeCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-center"
                />
              </div>
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-lg font-semibold text-amber-900 mb-2">💵 Cash Payment</p>
              <p className="text-sm text-amber-800">
                Collect ₹{order.total.toFixed(2)} from the customer
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePaymentSubmit}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : `Confirm Payment ₹${order.total.toFixed(2)}`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
