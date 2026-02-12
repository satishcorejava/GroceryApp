import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Plus, Home, Briefcase, Star, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useAddresses } from "../hooks/useAddresses";

export function Addresses() {
  const navigate = useNavigate();
  const { addresses, deleteAddress, setDefaultAddress } = useAddresses();

  const getIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      default:
        return MapPin;
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
          <h1 className="font-bold">Saved Addresses</h1>
        </div>
      </div>

      {/* Add New Address Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/account/address-map")}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Address</span>
        </motion.button>
      </div>

      {/* Address List */}
      <div className="px-4 space-y-3">
        {addresses.map((address) => {
          const Icon = getIcon(address.type);
          return (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{address.label}</h3>
                    {address.isDefault && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-green-600 fill-green-600" />
                        <span className="text-xs text-green-600 font-semibold">Default</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {address.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>

                <button
                  onClick={() => deleteAddress(address.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {!address.isDefault && (
                <button 
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700 active:scale-95 transition-transform"
                >
                  Set as Default
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
