import { useState, useEffect } from "react";
import { cartApi } from "../services/api";
import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = "grocery-cart";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Try to fetch cart from API if user is logged in
        const token = localStorage.getItem("auth-token");
        if (token) {
          try {
            // This would need to return a cart structure matching CartItem[]
            // For now, we'll fall back to localStorage
            const apiCart = await cartApi.getCart();
            // Map API response to CartItem format if needed
            console.log("Cart loaded from API:", apiCart);
          } catch (err) {
            console.error("Failed to load cart from API:", err);
            // Fall back to localStorage
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product, quantity: number) => {
    setError(null);
    try {
      // Add to local state immediately for better UX
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });

      // Try to sync with API if logged in
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          await cartApi.addItem();
        } catch (err) {
          console.error("Failed to sync cart with API:", err);
          // Local state is still updated, API sync is optional
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to add item to cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setError(null);
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      // Update local state immediately
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );

      // Try to sync with API if logged in
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          await cartApi.updateQuantity();
        } catch (err) {
          console.error("Failed to sync cart quantity with API:", err);
          // Local state is still updated
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to update quantity");
    }
  };

  const removeFromCart = async (productId: string) => {
    setError(null);
    try {
      // Remove from local state immediately
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));

      // Try to sync with API if logged in
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          await cartApi.removeItem();
        } catch (err) {
          console.error("Failed to remove item from API:", err);
          // Local state is still updated
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove item from cart");
    }
  };

  const clearCart = async () => {
    setError(null);
    try {
      // Clear local state immediately
      setCartItems([]);
      // Note: API doesn't have a clearCart endpoint, only update locally
    } catch (err: any) {
      setError(err.message || "Failed to clear cart");
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
    isLoading,
    error,
  };
}
