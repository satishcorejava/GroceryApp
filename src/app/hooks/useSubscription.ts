import { useState, useEffect } from "react";
import { Product } from "../data/products";

export type SubscriptionFrequency = 
  | "daily"
  | "alternate-days"
  | "weekly"
  | "bi-weekly"
  | "monthly";

export interface Subscription {
  id: string;
  product: Product;
  frequency: SubscriptionFrequency;
  quantity: number;
  startDate: string;
  nextDeliveryDate: string;
  isActive: boolean;
  createdAt: string;
}

export const FREQUENCY_OPTIONS: { value: SubscriptionFrequency; label: string; description: string }[] = [
  { value: "daily", label: "Daily", description: "Delivered every day" },
  { value: "alternate-days", label: "Alternate Days", description: "Every 2nd day" },
  { value: "weekly", label: "Weekly", description: "Once a week" },
  { value: "bi-weekly", label: "Bi-Weekly", description: "Every 2 weeks" },
  { value: "monthly", label: "Monthly", description: "Once a month" },
];

const SUBSCRIPTION_STORAGE_KEY = "grocery-subscriptions";

function calculateNextDeliveryDate(frequency: SubscriptionFrequency, fromDate?: Date): string {
  const date = fromDate || new Date();
  
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "alternate-days":
      date.setDate(date.getDate() + 2);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "bi-weekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
  }
  
  return date.toISOString().split("T")[0];
}

export function useSubscription() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist subscriptions to localStorage
  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (
    product: Product,
    frequency: SubscriptionFrequency,
    quantity: number,
    startDate?: string
  ) => {
    setError(null);
    
    // Check if already subscribed to this product
    const existing = subscriptions.find((sub) => sub.product.id === product.id && sub.isActive);
    if (existing) {
      setError("You are already subscribed to this product");
      return false;
    }

    const now = new Date();
    const start = startDate ? new Date(startDate) : now;
    
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product,
      frequency,
      quantity,
      startDate: start.toISOString().split("T")[0],
      nextDeliveryDate: calculateNextDeliveryDate(frequency, start),
      isActive: true,
      createdAt: now.toISOString(),
    };

    setSubscriptions((prev) => [...prev, newSubscription]);
    return true;
  };

  const updateSubscription = (
    subscriptionId: string,
    updates: Partial<Pick<Subscription, "frequency" | "quantity" | "isActive">>
  ) => {
    setError(null);
    
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          const updated = { ...sub, ...updates };
          // Recalculate next delivery if frequency changed
          if (updates.frequency) {
            updated.nextDeliveryDate = calculateNextDeliveryDate(updates.frequency);
          }
          return updated;
        }
        return sub;
      })
    );
  };

  const pauseSubscription = (subscriptionId: string) => {
    updateSubscription(subscriptionId, { isActive: false });
  };

  const resumeSubscription = (subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          return {
            ...sub,
            isActive: true,
            nextDeliveryDate: calculateNextDeliveryDate(sub.frequency),
          };
        }
        return sub;
      })
    );
  };

  const cancelSubscription = (subscriptionId: string) => {
    setError(null);
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));
  };

  const isProductSubscribed = (productId: string) => {
    return subscriptions.some((sub) => sub.product.id === productId && sub.isActive);
  };

  const getProductSubscription = (productId: string) => {
    return subscriptions.find((sub) => sub.product.id === productId);
  };

  const getActiveSubscriptions = () => {
    return subscriptions.filter((sub) => sub.isActive);
  };

  const getPausedSubscriptions = () => {
    return subscriptions.filter((sub) => !sub.isActive);
  };

  const getSubscriptionSavings = () => {
    // BigBasket typically offers 5-10% extra discount on subscriptions
    const SUBSCRIPTION_DISCOUNT = 0.05; // 5% extra discount
    return subscriptions
      .filter((sub) => sub.isActive)
      .reduce((total, sub) => {
        const basePrice = sub.product.price * sub.quantity;
        return total + basePrice * SUBSCRIPTION_DISCOUNT;
      }, 0);
  };

  return {
    subscriptions,
    isLoading,
    error,
    addSubscription,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    isProductSubscribed,
    getProductSubscription,
    getActiveSubscriptions,
    getPausedSubscriptions,
    getSubscriptionSavings,
  };
}
