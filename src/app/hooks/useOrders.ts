import { useState, useEffect } from "react";
import { ordersApi, CreateOrderRequest, OrderResponse } from "../services/api";

export function useOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getAll({
        page,
        limit,
        status,
      });

      setOrders(response.data);
      setTotal(response.total);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load orders";
      setError(errorMessage);
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    total,
    fetchOrders,
  };
}

export function useOrderDetail(orderId?: string) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await ordersApi.getById(orderId);
        setOrder(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load order";
        setError(errorMessage);
        console.error("Failed to load order:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return {
    order,
    isLoading,
    error,
  };
}

export function useOrderTracking(orderId?: string) {
  const [trackingData, setTrackingData] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ordersApi.trackOrder(id);
      setTrackingData(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to track order";
      setError(errorMessage);
      console.error("Failed to track order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      trackOrder(orderId);
    }
  }, [orderId]);

  return {
    trackingData,
    isLoading,
    error,
    trackOrder,
  };
}

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = await ordersApi.create(orderData);
      return order;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create order";
      setError(errorMessage);
      console.error("Failed to create order:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string): Promise<OrderResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = await ordersApi.cancel(orderId);
      return order;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to cancel order";
      setError(errorMessage);
      console.error("Failed to cancel order:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    cancelOrder,
    isLoading,
    error,
  };
}
