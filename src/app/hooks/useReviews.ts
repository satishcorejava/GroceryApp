import { useState, useEffect, useCallback } from "react";

export interface Review {
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
  userHasMarkedHelpful?: boolean;
}

export interface ReviewSummary {
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

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

const REVIEWS_STORAGE_KEY = "grocery-reviews";
const HELPFUL_STORAGE_KEY = "grocery-reviews-helpful";

// Mock reviews data
const generateMockReviews = (productId: string): Review[] => {
  const mockReviews: Review[] = [
    {
      id: `review-${productId}-1`,
      productId,
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
      id: `review-${productId}-2`,
      productId,
      userId: "user-102",
      userName: "Rahul Verma",
      rating: 4,
      title: "Good but slightly overpriced",
      comment: "Quality is good but I feel the price is a bit high compared to local market. Overall satisfied with the purchase.",
      helpfulCount: 8,
      isVerifiedPurchase: true,
      createdAt: "2026-01-28T14:20:00Z",
      updatedAt: "2026-01-28T14:20:00Z",
    },
    {
      id: `review-${productId}-3`,
      productId,
      userId: "user-103",
      userName: "Anjali Patel",
      rating: 5,
      title: "Best I've bought!",
      comment: "Amazing freshness and taste. My family loved it. Highly recommended for everyone!",
      helpfulCount: 15,
      isVerifiedPurchase: true,
      createdAt: "2026-01-25T09:15:00Z",
      updatedAt: "2026-01-25T09:15:00Z",
    },
    {
      id: `review-${productId}-4`,
      productId,
      userId: "user-104",
      userName: "Karthik Reddy",
      rating: 3,
      title: "Average experience",
      comment: "The product was okay, nothing special. Delivery was delayed by a day.",
      helpfulCount: 3,
      isVerifiedPurchase: false,
      createdAt: "2026-01-20T16:45:00Z",
      updatedAt: "2026-01-20T16:45:00Z",
    },
    {
      id: `review-${productId}-5`,
      productId,
      userId: "user-105",
      userName: "Meera Iyer",
      rating: 4,
      title: "Good quality, fast delivery",
      comment: "Received the product within 2 hours. Quality was as expected. Will order again.",
      helpfulCount: 6,
      isVerifiedPurchase: true,
      createdAt: "2026-01-15T11:00:00Z",
      updatedAt: "2026-01-15T11:00:00Z",
    },
  ];

  return mockReviews;
};

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>(() => {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [helpfulMarks, setHelpfulMarks] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(HELPFUL_STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist user reviews to localStorage
  useEffect(() => {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(userReviews));
  }, [userReviews]);

  // Persist helpful marks to localStorage
  useEffect(() => {
    localStorage.setItem(HELPFUL_STORAGE_KEY, JSON.stringify([...helpfulMarks]));
  }, [helpfulMarks]);

  // Load reviews for a product
  useEffect(() => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const mockReviews = generateMockReviews(productId);
      const productUserReviews = userReviews.filter((r) => r.productId === productId);
      
      // Combine mock reviews with user reviews, avoiding duplicates
      const allReviews = [...productUserReviews, ...mockReviews].map((review) => ({
        ...review,
        userHasMarkedHelpful: helpfulMarks.has(review.id),
      }));

      setReviews(allReviews);
      setIsLoading(false);
    }, 300);
  }, [productId, userReviews, helpfulMarks]);

  // Calculate review summary
  const getReviewSummary = useCallback((): ReviewSummary => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach((review) => {
      totalRating += review.rating;
      distribution[review.rating as keyof typeof distribution]++;
    });

    return {
      averageRating: Number((totalRating / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    };
  }, [reviews]);

  // Add a new review
  const addReview = async (input: CreateReviewInput): Promise<boolean> => {
    setError(null);

    // Check if user already reviewed this product
    const existingReview = userReviews.find(
      (r) => r.productId === input.productId
    );
    if (existingReview) {
      setError("You have already reviewed this product");
      return false;
    }

    const newReview: Review = {
      id: `review-user-${Date.now()}`,
      productId: input.productId,
      userId: "user-123", // Current user ID
      userName: "You",
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      helpfulCount: 0,
      isVerifiedPurchase: true, // Assume verified for demo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUserReviews((prev) => [newReview, ...prev]);
    return true;
  };

  // Update an existing review
  const updateReview = async (
    reviewId: string,
    updates: Partial<Pick<Review, "rating" | "title" | "comment">>
  ): Promise<boolean> => {
    setError(null);

    const reviewIndex = userReviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex === -1) {
      setError("Review not found or you don't have permission to edit it");
      return false;
    }

    setUserReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, ...updates, updatedAt: new Date().toISOString() }
          : review
      )
    );
    return true;
  };

  // Delete a review
  const deleteReview = async (reviewId: string): Promise<boolean> => {
    setError(null);

    setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));
    return true;
  };

  // Mark a review as helpful
  const markHelpful = async (reviewId: string): Promise<boolean> => {
    if (helpfulMarks.has(reviewId)) {
      // Already marked, unmark it
      setHelpfulMarks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, helpfulCount: r.helpfulCount - 1, userHasMarkedHelpful: false }
            : r
        )
      );
    } else {
      // Mark as helpful
      setHelpfulMarks((prev) => new Set([...prev, reviewId]));
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, helpfulCount: r.helpfulCount + 1, userHasMarkedHelpful: true }
            : r
        )
      );
    }
    return true;
  };

  // Check if current user has reviewed this product
  const hasUserReviewed = useCallback(
    (productIdToCheck: string): boolean => {
      return userReviews.some((r) => r.productId === productIdToCheck);
    },
    [userReviews]
  );

  // Get user's review for a product
  const getUserReview = useCallback(
    (productIdToCheck: string): Review | undefined => {
      return userReviews.find((r) => r.productId === productIdToCheck);
    },
    [userReviews]
  );

  return {
    reviews,
    isLoading,
    error,
    getReviewSummary,
    addReview,
    updateReview,
    deleteReview,
    markHelpful,
    hasUserReviewed,
    getUserReview,
  };
}
