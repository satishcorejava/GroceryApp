import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Grid3x3, ShoppingCart, User } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useTranslation } from "../contexts/TranslationContext";
import { motion } from "motion/react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { cartItems, getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    { icon: Home, label: t("navigation.home"), path: "/" },
    { icon: Grid3x3, label: t("navigation.categories"), path: "/categories" },
    { icon: ShoppingCart, label: t("navigation.cart"), path: "/cart" },
    { icon: User, label: t("navigation.account"), path: "/account" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:z-50">
        <div className="p-6 border-b border-gray-100">
          <h1 
            className="text-2xl font-bold tracking-tight"
            style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              background: "linear-gradient(135deg, #166534 0%, #16a34a 50%, #22c55e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Cornucopia
          </h1>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-2 transition-all ${
                  active 
                    ? "bg-green-50 text-green-600" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${active ? "text-green-600" : "text-gray-400"}`} />
                  {item.path === "/cart" && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </div>
                <span className={`font-medium ${active ? "text-green-600" : "text-gray-600"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Content wrapper - Mobile gets full width, desktop gets centered with max-width */}
          <div className="lg:px-6 lg:py-4">
            <div className="bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 min-h-screen lg:min-h-0">
              <div className="pb-20 lg:pb-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-2xl z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative active:scale-90 transition-transform"
              >
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -inset-2 bg-green-50 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 transition-colors ${
                      active ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  {item.path === "/cart" && itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 z-20 shadow-md font-semibold"
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </motion.span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors relative z-10 ${
                    active ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}