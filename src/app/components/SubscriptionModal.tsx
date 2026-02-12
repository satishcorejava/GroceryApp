import { useState } from "react";
import { CalendarClock, Check, Repeat, Minus, Plus, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Product } from "../data/products";
import {
  SubscriptionFrequency,
  FREQUENCY_OPTIONS,
} from "../hooks/useSubscription";
import { useTranslation } from "../contexts/TranslationContext";
import { motion } from "motion/react";

interface SubscriptionModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (frequency: SubscriptionFrequency, quantity: number, startDate: string) => void;
}

export function SubscriptionModal({
  product,
  isOpen,
  onClose,
  onSubscribe,
}: SubscriptionModalProps) {
  const { t } = useTranslation();
  const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequency>("daily");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Additional 5% subscription discount (BigBasket style)
  const subscriptionDiscount = 0.05;
  const subscriptionPrice = finalPrice * (1 - subscriptionDiscount);
  const totalSavings = (product.mrp - subscriptionPrice) * quantity;
  const savingsPercentage = Math.round(((product.mrp - subscriptionPrice) / product.mrp) * 100);

  const handleSubscribe = () => {
    onSubscribe(selectedFrequency, quantity, startDate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-green-600" />
            {t("subscription.subscribeTitle") || "Subscribe & Save"}
          </DialogTitle>
          <DialogDescription>
            {t("subscription.subscribeDescription") || "Get regular deliveries and save extra 5%"}
          </DialogDescription>
        </DialogHeader>

        {/* Product Preview */}
        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-green-600 font-bold">₹{subscriptionPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
              <Badge className="bg-green-100 text-green-700 text-xs">
                Extra 5% off
              </Badge>
            </div>
          </div>
        </div>

        {/* Frequency Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CalendarClock className="w-4 h-4" />
            {t("subscription.selectFrequency") || "Select Delivery Frequency"}
          </label>
          <div className="grid gap-2">
            {FREQUENCY_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFrequency(option.value)}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  selectedFrequency === option.value
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedFrequency === option.value
                        ? "border-green-600 bg-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedFrequency === option.value && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            {t("subscription.quantity") || "Quantity per delivery"}
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 border-x font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {quantity} {product.unit}{quantity > 1 ? "s" : ""} per delivery
            </span>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            {t("subscription.startDate") || "Start Date"}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* Savings Summary */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{t("subscription.pricePerDelivery") || "Price per delivery"}</span>
            <span className="font-bold text-green-600">
              ₹{(subscriptionPrice * quantity).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t("subscription.youSave") || "You save"}</span>
            <span className="font-bold text-green-600">
              ₹{totalSavings.toFixed(2)} ({savingsPercentage}% off)
            </span>
          </div>
        </div>

        {/* Subscribe Button */}
        <Button
          onClick={handleSubscribe}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
        >
          <Repeat className="w-4 h-4 mr-2" />
          {t("subscription.startSubscription") || "Start Subscription"}
        </Button>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center">
          {t("subscription.note") || "You can pause, modify or cancel your subscription anytime from the Subscriptions page."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
