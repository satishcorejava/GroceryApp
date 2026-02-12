import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Gift, CreditCard } from "lucide-react";
import { motion } from "motion/react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: string;
  icon: "order" | "refund" | "cashback";
}

export function Wallet() {
  const navigate = useNavigate();
  const [balance] = useState(125.50);
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "debit",
      description: "Order #1234",
      amount: 45.80,
      date: "2026-02-09",
      icon: "order",
    },
    {
      id: "2",
      type: "credit",
      description: "Cashback Reward",
      amount: 5.25,
      date: "2026-02-08",
      icon: "cashback",
    },
    {
      id: "3",
      type: "credit",
      description: "Refund - Order #1220",
      amount: 32.50,
      date: "2026-02-07",
      icon: "refund",
    },
    {
      id: "4",
      type: "debit",
      description: "Order #1215",
      amount: 78.90,
      date: "2026-02-06",
      icon: "order",
    },
  ]);

  const getTransactionIcon = (icon: string) => {
    switch (icon) {
      case "cashback":
        return Gift;
      case "refund":
        return ArrowDownLeft;
      default:
        return ArrowUpRight;
    }
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
          <h1 className="font-bold">My Wallet</h1>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl p-6 shadow-xl text-white"
        >
          <div className="flex items-center gap-2 mb-6">
            <WalletIcon className="w-6 h-6" />
            <span className="text-sm opacity-90">Available Balance</span>
          </div>

          <div className="mb-6">
            <h2 className="text-4xl font-bold">${balance.toFixed(2)}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-semibold">Add Money</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-semibold">Pay</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-1">This Month</p>
            <p className="font-bold text-gray-800">$234.50</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-1">Cashback</p>
            <p className="font-bold text-green-600">$12.75</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-1">Orders</p>
            <p className="font-bold text-gray-800">24</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4">
        <h3 className="font-semibold text-gray-800 mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.icon);
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    transaction.type === "credit"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    className={`font-bold ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
