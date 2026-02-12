import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronRight, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function Support() {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I track my order?",
      answer: "You can track your order from the Orders section in your account. Click on any active order to see real-time tracking on the map.",
    },
    {
      id: "2",
      question: "What is the delivery time?",
      answer: "Standard delivery takes 1-2 hours. Express delivery is available for select items and takes 30-45 minutes.",
    },
    {
      id: "3",
      question: "How do I cancel my order?",
      answer: "You can cancel an order within 5 minutes of placing it. Go to Orders, select your order, and tap Cancel Order.",
    },
    {
      id: "4",
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, wallet balance, UPI, and cash on delivery for eligible orders.",
    },
    {
      id: "5",
      question: "How do I get a refund?",
      answer: "Refunds are processed within 5-7 business days to your original payment method or wallet balance.",
    },
  ];

  const contactOptions = [
    {
      id: "1",
      icon: MessageCircle,
      label: "Live Chat",
      description: "Chat with our support team",
      color: "green",
    },
    {
      id: "2",
      icon: Phone,
      label: "Call Us",
      description: "+1 (555) 123-4567",
      color: "blue",
    },
    {
      id: "3",
      icon: Mail,
      label: "Email",
      description: "support@cornucopia.com",
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: "from-green-50 to-green-100 text-green-600",
      blue: "from-blue-50 to-blue-100 text-blue-600",
      purple: "from-purple-50 to-purple-100 text-purple-600",
    };
    return colors[color as keyof typeof colors] || colors.green;
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
          <h1 className="font-bold">Help & Support</h1>
        </div>
      </div>

      {/* Contact Options */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Contact Us
        </h3>
        {contactOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(option.color)} rounded-xl flex items-center justify-center shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </motion.button>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="p-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-gray-500" />
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
        </div>
        
        <div className="space-y-2">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={false}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                }
                className="w-full p-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-semibold text-gray-800 text-left flex-1">
                  {faq.question}
                </p>
                <motion.div
                  animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: expandedFAQ === faq.id ? "auto" : 0,
                  opacity: expandedFAQ === faq.id ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Report Issue */}
      <div className="p-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-4 shadow-lg"
        >
          <span className="font-semibold">Report an Issue</span>
        </motion.button>
      </div>
    </div>
  );
}
