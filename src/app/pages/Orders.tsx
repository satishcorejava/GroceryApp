import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  items: number;
  total: number;
  deliveryDate?: string;
}

export function Orders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "delivered">("all");
  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-2026-001234",
      date: "2026-02-09",
      status: "confirmed",
      items: 5,
      total: 45.80,
      deliveryDate: "2026-02-10",
    },
    {
      id: "2",
      orderNumber: "ORD-2026-001220",
      date: "2026-02-08",
      status: "delivered",
      items: 8,
      total: 78.50,
      deliveryDate: "2026-02-09",
    },
    {
      id: "3",
      orderNumber: "ORD-2026-001215",
      date: "2026-02-07",
      status: "delivered",
      items: 12,
      total: 125.30,
      deliveryDate: "2026-02-08",
    },
    {
      id: "4",
      orderNumber: "ORD-2026-001200",
      date: "2026-02-05",
      status: "cancelled",
      items: 3,
      total: 32.50,
    },
  ]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          label: "Pending",
        };
      case "confirmed":
        return {
          icon: Package,
          color: "text-blue-600",
          bg: "bg-blue-50",
          label: "Confirmed",
        };
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
          label: "Delivered",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          label: "Cancelled",
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

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.status === "pending" || order.status === "confirmed";
    if (activeTab === "delivered") return order.status === "delivered";
    return true;
  });

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
          <h1 className="font-bold">My Orders</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 border-b shadow-sm sticky top-[60px] z-10">
        <div className="flex gap-2">
          {(["all", "pending", "delivered"] as const).map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/account/order-detail/${order.id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                    <span className={`text-xs font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {order.items}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-semibold text-gray-800">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.deliveryDate && order.status !== "cancelled" && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {order.status === "delivered" ? "Delivered on" : "Delivery"}
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {order.status === "confirmed" && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="w-full bg-green-50 text-green-600 rounded-lg py-2 text-sm font-semibold hover:bg-green-100 transition-colors">
                      Track Order
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}