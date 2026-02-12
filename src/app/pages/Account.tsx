import { ChevronRight, User, MapPin, CreditCard, Heart, Settings, HelpCircle, LogOut, Package, Wallet as WalletIcon, Repeat } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

export function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to access your account
          </h1>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? `${user.name.split(" ")[0][0]}`
    : "U";

  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      description: "Edit your profile details",
      path: "/account/profile",
    },
    {
      icon: Package,
      label: "My Orders",
      description: "Track and view order history",
      path: "/account/orders",
    },
    {
      icon: Repeat,
      label: "My Subscriptions",
      description: "Manage recurring deliveries",
      path: "/account/subscriptions",
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      description: "Manage delivery addresses",
      path: "/account/addresses",
    },
    {
      icon: WalletIcon,
      label: "My Wallet",
      description: "View balance and transactions",
      path: "/account/wallet",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      description: "Manage payment options",
      path: "/account/payment-methods",
    },
    {
      icon: Heart,
      label: "Favorites",
      description: "Your saved products",
      path: "/account/favorites",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "App preferences",
      path: "/account/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with your orders",
      path: "/account/support",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 shadow-lg">
        <h1 className="font-bold">My Account</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-6 border-b shadow-sm">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-2xl font-bold text-green-600">{initials}</span>
          </motion.div>
          <div>
            <h2 className="font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-600">
              {user.email || user.mobile || "No contact info"}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-all active:scale-[0.98] border border-gray-100"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-white rounded-xl p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-all active:scale-[0.98] border border-red-200 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </motion.button>
      </div>

      {/* App Version */}
      <div className="text-center mt-6 pb-4">
        <p className="text-sm text-gray-700 font-semibold mb-1">Cornucopia</p>
        <p className="text-xs text-gray-400">Version 1.0.0</p>
      </div>
    </div>
  );
}