/**
 * API Service Layer - MOCK DATA VERSION
 * Returns dummy data for development/testing
 * Replace this with real API calls when backend is ready
 */

const API_BASE_URL = "https://api.zakya.com/";

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Authentication Requests
export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email?: string;
  mobile?: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  };
  token: string;
}

// Order Requests
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  addressId: string;
  paymentMethodId: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  deliveryAddress: {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  createdAt: string;
  estimatedDelivery: string;
}

// Address Requests
export interface AddressRequest {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: { lat: number; lng: number };
  isDefault?: boolean;
}

// Mock data generators
function generateMockUser() {
  return {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    mobile: "9876543210",
  };
}

function generateMockToken() {
  return "mock-jwt-token-" + Date.now();
}

function generateMockProducts(limit = 20): any[] {
  return Array.from({ length: limit }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    price: Math.random() * 50 + 5,
    unit: "pieces",
    image: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
    category: ["vegetables", "fruits", "bakery", "dairy"][i % 4],
    subcategory: ["leafy-greens", "berries", "bread", "milk"][i % 4],
    description: `This is a mock description for product ${i + 1}`,
    inStock: true,
    discount: i % 3 === 0 ? 10 : 0,
  }));
}

function generateMockOrder(): OrderResponse {
  return {
    id: "order-123",
    orderNumber: "ORD-20260210-001",
    userId: "user-123",
    items: [
      {
        id: "item-1",
        productId: "product-1",
        productName: "Fresh Tomatoes",
        quantity: 2,
        price: 3.99,
      },
      {
        id: "item-2",
        productId: "product-2",
        productName: "Organic Lettuce",
        quantity: 1,
        price: 4.49,
      },
    ],
    subtotal: 12.47,
    tax: 0.99,
    deliveryFee: 2.99,
    total: 16.45,
    status: "confirmed",
    deliveryAddress: {
      id: "addr-1",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3600000 * 2).toISOString(),
  };
}

// Utility function for simulating API calls
async function apiCall<T>(endpoint: string): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

  if (endpoint.includes("/auth/login")) {
    return mockAuth as T;
  }

  if (endpoint.includes("/products")) {
    return mockProducts as T;
  }

  if (endpoint.includes("/orders")) {
    return mockOrder as T;
  }

  if (endpoint.includes("/addresses")) {
    return mockAddresses as T;
  }

  if (endpoint.includes("/cart")) {
    return mockCart as T;
  }

  throw new Error(`Endpoint ${endpoint} not implemented in mock API`);
}

// Mock data files
import mockAuth from "../data/mockAuth.json";
import mockProducts from "../data/mockProducts.json";
import mockOrder from "../data/mockOrder.json";
import mockAddresses from "../data/mockAddresses.json";
import mockCart from "../data/mockCart.json";
import mockSubscriptions from "../data/mockSubscriptions.json";

// ============= AUTHENTICATION ENDPOINTS =============
export const authApi = {
  login: async () => apiCall("/auth/login"),
  getCurrentUser: async () => apiCall("/auth/current"),
};

export const productsApi = {
  getAll: async () => apiCall("/products"),
};

export const ordersApi = {
  getById: async () => apiCall("/orders"),
};

export const addressesApi = {
  getAll: async () => apiCall("/addresses"),
  create: async (data: AddressRequest) => apiCall("/addresses/create"),
  update: async (id: string, data: AddressRequest) => apiCall("/addresses/update"),
  delete: async (id: string) => apiCall("/addresses/delete"),
  setDefault: async (id: string) => apiCall("/addresses/setDefault"),
};

export const cartApi = {
  getCart: async () => apiCall("/cart"),
  addItem: async () => apiCall("/cart/add"),
  removeItem: async () => apiCall("/cart/remove"),
  updateQuantity: async () => apiCall("/cart/update"),
};

// ============= DELIVERY AGENT ENDPOINTS =============
export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "completed";
  status: "assigned" | "in-transit" | "arrived" | "delivered";
  scheduledTime: string;
}

export const deliveryAgentApi = {
  getAssignedOrders: async () => apiCall("/delivery/orders"),
  updateOrderStatus: async (orderId: string, status: string) =>
    apiCall(`/delivery/orders/${orderId}/status`),
  recordPayment: async (orderId: string, paymentData: any) =>
    apiCall(`/delivery/orders/${orderId}/payment`),
  getOrderDetails: async (orderId: string) =>
    apiCall(`/delivery/orders/${orderId}`),
};

// ============= SUBSCRIPTION TYPES =============
export type SubscriptionFrequency = 
  | "daily"
  | "alternate_days"
  | "weekly"
  | "bi_weekly"
  | "monthly";

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired";

export type SubscriptionDeliveryStatus = 
  | "scheduled"
  | "processing"
  | "out_for_delivery"
  | "delivered"
  | "skipped"
  | "failed";

export interface SubscriptionRequest {
  productId: string;
  frequency: SubscriptionFrequency;
  quantity: number;
  startDate: string;
  addressId?: string;
  preferredTimeSlot?: "morning" | "afternoon" | "evening";
}

export interface SubscriptionUpdateRequest {
  frequency?: SubscriptionFrequency;
  quantity?: number;
  addressId?: string;
  preferredTimeSlot?: string;
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  productUnit: string;
  frequency: SubscriptionFrequency;
  quantity: number;
  unitPrice: number;
  subscriptionDiscount: number;
  startDate: string;
  nextDeliveryDate: string;
  lastDeliveryDate?: string;
  preferredTimeSlot?: string;
  status: SubscriptionStatus;
  pausedAt?: string;
  pausedUntil?: string;
  totalDeliveries: number;
  totalAmountSaved: number;
  createdAt: string;
}

export interface SubscriptionDeliveryResponse {
  id: string;
  subscriptionId: string;
  orderId?: string;
  scheduledDate: string;
  actualDeliveryDate?: string;
  quantity: number;
  unitPrice: number;
  discountApplied: number;
  totalAmount: number;
  status: SubscriptionDeliveryStatus;
  skipReason?: string;
}

export interface SubscriptionSummary {
  activeSubscriptions: number;
  pausedSubscriptions: number;
  totalSavings: number;
  totalDeliveries: number;
  nextDeliveryDate?: string;
}

// ============= SUBSCRIPTION ENDPOINTS =============
export const subscriptionApi = {
  // Get all subscriptions for current user
  getAll: async (): Promise<ApiResponse<SubscriptionResponse[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: mockSubscriptions.subscriptions as SubscriptionResponse[],
    };
  },

  // Get subscription by ID
  getById: async (subscriptionId: string): Promise<ApiResponse<SubscriptionResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const subscription = mockSubscriptions.subscriptions.find(
      (s) => s.id === subscriptionId
    );
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    return { success: true, data: subscription as SubscriptionResponse };
  },

  // Create a new subscription
  create: async (data: SubscriptionRequest): Promise<ApiResponse<SubscriptionResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newSubscription: SubscriptionResponse = {
      id: `sub-${Date.now()}`,
      userId: "user-123",
      productId: data.productId,
      productName: "New Subscribed Product",
      productImage: "https://via.placeholder.com/300",
      productUnit: "unit",
      frequency: data.frequency,
      quantity: data.quantity,
      unitPrice: 100,
      subscriptionDiscount: 5.0,
      startDate: data.startDate,
      nextDeliveryDate: data.startDate,
      preferredTimeSlot: data.preferredTimeSlot,
      status: "active",
      totalDeliveries: 0,
      totalAmountSaved: 0,
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: newSubscription };
  },

  // Update subscription
  update: async (
    subscriptionId: string,
    data: SubscriptionUpdateRequest
  ): Promise<ApiResponse<SubscriptionResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const subscription = mockSubscriptions.subscriptions.find(
      (s) => s.id === subscriptionId
    );
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    return {
      success: true,
      data: { ...subscription, ...data } as SubscriptionResponse,
    };
  },

  // Pause subscription
  pause: async (
    subscriptionId: string,
    pauseUntil?: string
  ): Promise<ApiResponse<SubscriptionResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const subscription = mockSubscriptions.subscriptions.find(
      (s) => s.id === subscriptionId
    );
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    return {
      success: true,
      data: {
        ...subscription,
        status: "paused",
        pausedAt: new Date().toISOString(),
        pausedUntil: pauseUntil,
      } as SubscriptionResponse,
    };
  },

  // Resume subscription
  resume: async (subscriptionId: string): Promise<ApiResponse<SubscriptionResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const subscription = mockSubscriptions.subscriptions.find(
      (s) => s.id === subscriptionId
    );
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    return {
      success: true,
      data: {
        ...subscription,
        status: "active",
        pausedAt: undefined,
        pausedUntil: undefined,
      } as SubscriptionResponse,
    };
  },

  // Cancel subscription
  cancel: async (
    subscriptionId: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      data: { message: "Subscription cancelled successfully" },
    };
  },

  // Skip a delivery
  skipDelivery: async (
    subscriptionId: string,
    deliveryDate: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: { message: `Delivery on ${deliveryDate} has been skipped` },
    };
  },

  // Get upcoming deliveries
  getUpcomingDeliveries: async (): Promise<ApiResponse<SubscriptionDeliveryResponse[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const upcoming = mockSubscriptions.subscriptionDeliveries.filter(
      (d) => d.status === "scheduled"
    );
    return { success: true, data: upcoming as SubscriptionDeliveryResponse[] };
  },

  // Get delivery history
  getDeliveryHistory: async (
    subscriptionId?: string
  ): Promise<ApiResponse<SubscriptionDeliveryResponse[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let deliveries = mockSubscriptions.subscriptionDeliveries;
    if (subscriptionId) {
      deliveries = deliveries.filter((d) => d.subscriptionId === subscriptionId);
    }
    return { success: true, data: deliveries as SubscriptionDeliveryResponse[] };
  },

  // Get subscription summary
  getSummary: async (): Promise<ApiResponse<SubscriptionSummary>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const subs = mockSubscriptions.subscriptions;
    const summary: SubscriptionSummary = {
      activeSubscriptions: subs.filter((s) => s.status === "active").length,
      pausedSubscriptions: subs.filter((s) => s.status === "paused").length,
      totalSavings: subs.reduce((sum, s) => sum + s.totalAmountSaved, 0),
      totalDeliveries: subs.reduce((sum, s) => sum + s.totalDeliveries, 0),
      nextDeliveryDate: subs
        .filter((s) => s.status === "active")
        .map((s) => s.nextDeliveryDate)
        .sort()[0],
    };
    return { success: true, data: summary };
  },

  // Get frequency options
  getFrequencyOptions: async () => {
    return mockSubscriptions.frequencyOptions;
  },

  // Get time slot options
  getTimeSlots: async () => {
    return mockSubscriptions.timeSlots;
  },
};

// ============= REVIEW TYPES =============
export interface ReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummaryResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Mock reviews data
const mockReviewsData: ReviewResponse[] = [
  {
    id: "review-1",
    productId: "prod-001",
    userId: "user-101",
    userName: "Priya Sharma",
    rating: 5,
    title: "Excellent quality!",
    comment: "Fresh and high quality product. Delivered on time and packaging was great. Will definitely order again!",
    helpfulCount: 12,
    isVerifiedPurchase: true,
    createdAt: "2026-02-01T10:30:00Z",
    updatedAt: "2026-02-01T10:30:00Z",
  },
  {
    id: "review-2",
    productId: "prod-001",
    userId: "user-102",
    userName: "Rahul Verma",
    rating: 4,
    title: "Good but slightly overpriced",
    comment: "Quality is good but I feel the price is a bit high compared to local market. Overall satisfied.",
    helpfulCount: 8,
    isVerifiedPurchase: true,
    createdAt: "2026-01-28T14:20:00Z",
    updatedAt: "2026-01-28T14:20:00Z",
  },
  {
    id: "review-3",
    productId: "prod-002",
    userId: "user-103",
    userName: "Anjali Patel",
    rating: 5,
    title: "Best I've bought!",
    comment: "Amazing freshness and taste. My family loved it. Highly recommended!",
    helpfulCount: 15,
    isVerifiedPurchase: true,
    createdAt: "2026-01-25T09:15:00Z",
    updatedAt: "2026-01-25T09:15:00Z",
  },
];

// ============= REVIEW ENDPOINTS =============
export const reviewsApi = {
  // Get reviews for a product
  getProductReviews: async (
    productId: string
  ): Promise<ApiResponse<ReviewResponse[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const reviews = mockReviewsData.filter((r) => r.productId === productId);
    return { success: true, data: reviews };
  },

  // Get review summary for a product
  getProductReviewSummary: async (
    productId: string
  ): Promise<ApiResponse<ReviewSummaryResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const reviews = mockReviewsData.filter((r) => r.productId === productId);
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    
    reviews.forEach((review) => {
      totalRating += review.rating;
      distribution[review.rating as keyof typeof distribution]++;
    });

    const summary: ReviewSummaryResponse = {
      averageRating: reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    };
    
    return { success: true, data: summary };
  },

  // Create a review
  create: async (data: ReviewRequest): Promise<ApiResponse<ReviewResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newReview: ReviewResponse = {
      id: `review-${Date.now()}`,
      productId: data.productId,
      userId: "user-123",
      userName: "You",
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      helpfulCount: 0,
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return { success: true, data: newReview, message: "Review submitted successfully" };
  },

  // Update a review
  update: async (
    reviewId: string,
    data: Partial<ReviewRequest>
  ): Promise<ApiResponse<ReviewResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const review = mockReviewsData.find((r) => r.id === reviewId);
    if (!review) {
      return { success: false, error: "Review not found" };
    }
    
    return {
      success: true,
      data: { ...review, ...data, updatedAt: new Date().toISOString() },
      message: "Review updated successfully",
    };
  },

  // Delete a review
  delete: async (reviewId: string): Promise<ApiResponse<{ message: string }>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: { message: "Review deleted successfully" } };
  },

  // Mark review as helpful
  markHelpful: async (reviewId: string): Promise<ApiResponse<{ helpfulCount: number }>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const review = mockReviewsData.find((r) => r.id === reviewId);
    return {
      success: true,
      data: { helpfulCount: (review?.helpfulCount || 0) + 1 },
    };
  },

  // Get user's reviews
  getUserReviews: async (): Promise<ApiResponse<ReviewResponse[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userReviews = mockReviewsData.filter((r) => r.userId === "user-123");
    return { success: true, data: userReviews };
  },
};