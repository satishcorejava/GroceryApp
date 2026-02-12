import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
  Download,
} from "lucide-react";
import { motion } from "motion/react";

interface EarningRecord {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  deliveryAmount: number;
  bonus: number;
  deduction: number;
  totalEarning: number;
  status: "completed" | "pending" | "rejected";
}

export function AgentEarnings() {
  const [filterPeriod, setFilterPeriod] = useState<"today" | "week" | "month" | "all">("month");
  const [earnings] = useState<EarningRecord[]>([
    {
      id: "1",
      orderNumber: "ORD-2026-005401",
      date: "2026-02-10",
      customerName: "Rajesh Kumar",
      deliveryAmount: 40,
      bonus: 10,
      deduction: 0,
      totalEarning: 50,
      status: "completed",
    },
    {
      id: "2",
      orderNumber: "ORD-2026-005402",
      date: "2026-02-10",
      customerName: "Priya Sharma",
      deliveryAmount: 50,
      bonus: 15,
      deduction: 0,
      totalEarning: 65,
      status: "completed",
    },
    {
      id: "3",
      orderNumber: "ORD-2026-005403",
      date: "2026-02-10",
      customerName: "Amit Patel",
      deliveryAmount: 60,
      bonus: 20,
      deduction: 0,
      totalEarning: 80,
      status: "completed",
    },
    {
      id: "4",
      orderNumber: "ORD-2026-005404",
      date: "2026-02-09",
      customerName: "Neha Gupta",
      deliveryAmount: 30,
      bonus: 5,
      deduction: 0,
      totalEarning: 35,
      status: "completed",
    },
    {
      id: "5",
      orderNumber: "ORD-2026-005405",
      date: "2026-02-09",
      customerName: "Vikram Singh",
      deliveryAmount: 45,
      bonus: 12,
      deduction: 5,
      totalEarning: 52,
      status: "completed",
    },
    {
      id: "6",
      orderNumber: "ORD-2026-005406",
      date: "2026-02-08",
      customerName: "Anita Verma",
      deliveryAmount: 55,
      bonus: 18,
      deduction: 0,
      totalEarning: 73,
      status: "completed",
    },
    {
      id: "7",
      orderNumber: "ORD-2026-005407",
      date: "2026-02-08",
      customerName: "Rahul Kumar",
      deliveryAmount: 50,
      bonus: 10,
      deduction: 0,
      totalEarning: 60,
      status: "pending",
    },
  ]);

  // Calculate statistics
  const filteredEarnings = earnings.filter((e) => {
    const date = new Date(e.date);
    const today = new Date();

    if (filterPeriod === "today") {
      return date.toDateString() === today.toDateString();
    } else if (filterPeriod === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    } else if (filterPeriod === "month") {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return date >= monthAgo;
    }
    return true;
  });

  const totalEarning = filteredEarnings.reduce((sum, e) => sum + e.totalEarning, 0);
  const totalBonus = filteredEarnings.reduce((sum, e) => sum + e.bonus, 0);
  const totalDeduction = filteredEarnings.reduce((sum, e) => sum + e.deduction, 0);
  const completedOrders = filteredEarnings.filter((e) => e.status === "completed").length;
  const pendingAmount = filteredEarnings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.totalEarning, 0);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
          label: "Completed",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
          label: "Pending",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          badge: "bg-gray-100 text-gray-700",
          label: "Unknown",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your delivery earnings and bonuses</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Earning */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Total Earning</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{totalEarning.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-2">{completedOrders} orders completed</p>
        </motion.div>

        {/* Today's Earning */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Today</h3>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            ₹
            {filteredEarnings
              .filter((e) => new Date(e.date).toDateString() === new Date().toDateString())
              .reduce((sum, e) => sum + e.totalEarning, 0)
              .toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {filteredEarnings.filter((e) => new Date(e.date).toDateString() === new Date().toDateString()).length} orders
          </p>
        </motion.div>

        {/* Total Bonus */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Bonuses</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">₹{totalBonus.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-2">{((totalBonus / totalEarning) * 100).toFixed(1)}% of earnings</p>
        </motion.div>

        {/* Pending Amount */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Pending</h3>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-600">₹{pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-2">
            {filteredEarnings.filter((e) => e.status === "pending").length} orders
          </p>
        </motion.div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {(["today", "week", "month", "all"] as const).map((period) => (
          <motion.button
            key={period}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterPeriod === period
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
            }`}
          >
            {period === "today"
              ? "Today"
              : period === "week"
                ? "This Week"
                : period === "month"
                  ? "This Month"
                  : "All Time"}
          </motion.button>
        ))}
      </motion.div>

      {/* Earnings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">Delivery</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">Bonus</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">Deduction</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEarnings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No earnings data for this period</p>
                  </td>
                </tr>
              ) : (
                filteredEarnings.map((record, index) => {
                  const statusConfig = getStatusConfig(record.status);
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors ${statusConfig.bg}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{record.orderNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{record.customerName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">
                          {new Date(record.date).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">₹{record.deliveryAmount}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-green-600">+₹{record.bonus}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-semibold ${record.deduction > 0 ? "text-red-600" : "text-gray-600"}`}>
                          {record.deduction > 0 ? `-₹${record.deduction}` : "₹0"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-lg text-gray-900">₹{record.totalEarning}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Total: <span className="font-bold text-gray-900">{filteredEarnings.length} Orders</span>
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-blue-600">₹{totalEarning.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Available for Withdrawal</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(totalEarning - pendingAmount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3"
      >
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Payment Settlement</p>
          <p className="text-sm text-blue-800 mt-1">
            Earnings will be settled weekly on Fridays. Pending orders will be processed once completed and verified.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
