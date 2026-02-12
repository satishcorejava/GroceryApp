import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, Save, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

export function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (user && user.isLoggedIn) {
      const nameParts = user.name.split(" ");
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    updateProfile({
      name: fullName,
      email: formData.email,
      mobile: formData.mobile,
    });
    navigate("/account");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your profile
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

  const initials = `${formData.firstName[0] || ""}${formData.lastName[0] || ""}`.toUpperCase();

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
          <h1 className="font-bold">Personal Information</h1>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-white p-6 border-b">
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-green-600">{initials}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </motion.div>
          <p className="text-sm text-gray-500 mt-3">Tap to change photo</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">{user.name}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e: { target: { value: any; }; }) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full text-sm text-gray-800 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full text-sm text-gray-800 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full text-sm text-gray-800 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            className="w-full text-sm text-gray-800 outline-none"
          />
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg mt-6"
        >
          <Save className="w-5 h-5" />
          <span className="font-semibold">Save Changes</span>
        </motion.button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          type="button"
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl p-4 flex items-center justify-center gap-2 mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </motion.button>
      </form>
    </div>
  );
}
