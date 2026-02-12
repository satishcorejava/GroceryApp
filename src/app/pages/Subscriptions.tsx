import { useNavigate } from "react-router";
import { ArrowLeft, Repeat, Calendar, Package, Pause, Play, Trash2, Edit2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  useSubscription,
  FREQUENCY_OPTIONS,
  Subscription,
} from "../hooks/useSubscription";
import { useTranslation } from "../contexts/TranslationContext";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function Subscriptions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    subscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getActiveSubscriptions,
    getPausedSubscriptions,
    getSubscriptionSavings,
  } = useSubscription();

  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const activeSubscriptions = getActiveSubscriptions();
  const pausedSubscriptions = getPausedSubscriptions();
  const monthlySavings = getSubscriptionSavings();

  const getFrequencyLabel = (frequency: string) => {
    const option = FREQUENCY_OPTIONS.find((f) => f.value === frequency);
    return option?.label || frequency;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => {
    const { product, frequency, quantity, nextDeliveryDate, isActive } = subscription;
    
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;
    const subscriptionPrice = finalPrice * 0.95; // 5% extra discount

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl border p-4 ${
          isActive ? "border-green-200" : "border-gray-200 opacity-75"
        }`}
      >
        <div className="flex gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
            onClick={() => navigate(`/product/${product.id}`)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-medium text-sm line-clamp-2 cursor-pointer hover:text-green-600"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <Badge
                className={
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {isActive ? "Active" : "Paused"}
              </Badge>
            </div>

            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Repeat className="w-3 h-3" />
                <span>{getFrequencyLabel(frequency)}</span>
                <span className="text-gray-400">•</span>
                <span>{quantity} {product.unit}{quantity > 1 ? "s" : ""}</span>
              </div>
              {isActive && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Next: {formatDate(nextDeliveryDate)}</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-green-600 font-bold">
                ₹{(subscriptionPrice * quantity).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">per delivery</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setEditingSubscription(subscription)}
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          {isActive ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
              onClick={() => pauseSubscription(subscription.id)}
            >
              <Pause className="w-3 h-3 mr-1" />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => resumeSubscription(subscription.id)}
            >
              <Play className="w-3 h-3 mr-1" />
              Resume
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              if (confirm("Are you sure you want to cancel this subscription?")) {
                cancelSubscription(subscription.id);
              }
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center p-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">
            {t("subscription.mySubscriptions") || "My Subscriptions"}
          </h1>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 mt-12">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Repeat className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t("subscription.noSubscriptions") || "No Subscriptions Yet"}
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-sm">
            {t("subscription.noSubscriptionsMessage") ||
              "Subscribe to your frequently used products and save 5% extra on every delivery!"}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Package className="w-4 h-4 mr-2" />
            Explore Products
          </Button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Savings Banner */}
          {monthlySavings > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white"
            >
              <p className="text-sm opacity-90">Estimated monthly savings</p>
              <p className="text-2xl font-bold">₹{(monthlySavings * 30).toFixed(2)}</p>
              <p className="text-xs opacity-75 mt-1">
                Based on {activeSubscriptions.length} active subscription(s)
              </p>
            </motion.div>
          )}

          {/* Active Subscriptions */}
          {activeSubscriptions.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-800">
                Active ({activeSubscriptions.length})
              </h2>
              {activeSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>
          )}

          {/* Paused Subscriptions */}
          {pausedSubscriptions.length > 0 && (
            <div className="space-y-3 mt-6">
              <h2 className="font-semibold text-gray-500">
                Paused ({pausedSubscriptions.length})
              </h2>
              {pausedSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal would go here - simplified for now */}
      {editingSubscription && (
        <Dialog
          open={!!editingSubscription}
          onOpenChange={(open) => !open && setEditingSubscription(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subscription</DialogTitle>
            </DialogHeader>
            <p className="text-gray-500">
              Editing functionality for {editingSubscription.product.name}
            </p>
            <Button onClick={() => setEditingSubscription(null)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
