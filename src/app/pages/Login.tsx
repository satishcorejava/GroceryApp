import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Phone, User, ArrowRight, Truck } from "lucide-react";
import { Input } from "../components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { motion } from "motion/react";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userRole, setUserRole] = useState<"customer" | "delivery-agent">("customer");
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile.replace(/\D/g, ""));
  };

  const handleLogin = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (loginMethod === "email") {
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
    } else {
      if (!mobile.trim()) {
        setError("Please enter your mobile number");
        return;
      }
      if (!validateMobile(mobile)) {
        setError("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsLoading(true);
    try {
      login(email, mobile, name, userRole);
      setIsLoading(false);
      if (userRole === "delivery-agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cornucopia</h1>
          <p className="text-gray-600">Welcome back to your grocery store</p>
        </div>

        {/* User Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Login As
          </label>
          <div className="flex gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserRole("customer")}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                userRole === "customer"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🛒 Customer
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserRole("delivery-agent")}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                userRole === "delivery-agent"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Truck className="w-4 h-4" /> Agent
            </motion.button>
          </div>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              loginMethod === "email"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Mail className="w-4 h-4 inline-block mr-2" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("mobile")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              loginMethod === "mobile"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Phone className="w-4 h-4 inline-block mr-2" />
            Mobile
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Email Input */}
          {loginMethod === "email" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </motion.div>
          )}

          {/* Mobile Input */}
          {loginMethod === "mobile" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(value);
                  }}
                  maxLength={10}
                  className="pl-10 h-11 bg-gray-50 border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-all active:scale-95 mb-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Login to Your Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Signup Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
