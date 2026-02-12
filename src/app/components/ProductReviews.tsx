import { useState } from "react";
import { Star, ThumbsUp, User, ShieldCheck, ChevronDown, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Review, ReviewSummary } from "../hooks/useReviews";
import { useTranslation } from "../contexts/TranslationContext";
import { motion, AnimatePresence } from "motion/react";

interface ProductReviewsProps {
  reviews: Review[];
  summary: ReviewSummary;
  isLoading: boolean;
  onMarkHelpful: (reviewId: string) => void;
  onWriteReview: () => void;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  hasUserReviewed: boolean;
  userReview?: Review;
}

export function ProductReviews({
  reviews,
  summary,
  isLoading,
  onMarkHelpful,
  onWriteReview,
  onEditReview,
  onDeleteReview,
  hasUserReviewed,
  userReview,
}: ProductReviewsProps) {
  const { t } = useTranslation();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("helpful");

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const sortedReviews = [...displayedReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "helpful") {
      return b.helpfulCount - a.helpfulCount;
    }
    return b.rating - a.rating;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const RatingBar = ({ rating, count, total }: { rating: number; count: number; total: number }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-3 text-gray-600">{rating}</span>
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: 0.1 * rating }}
            className="h-full bg-yellow-400 rounded-full"
          />
        </div>
        <span className="w-8 text-gray-500 text-right">{count}</span>
      </div>
    );
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t("reviews.ratingsAndReviews") || "Ratings & Reviews"}
        </h2>
        {!hasUserReviewed && (
          <Button
            variant="outline"
            size="sm"
            onClick={onWriteReview}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Star className="w-4 h-4 mr-1" />
            {t("reviews.writeReview") || "Write Review"}
          </Button>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {summary.averageRating > 0 ? summary.averageRating : "-"}
            </div>
            <StarRating rating={Math.round(summary.averageRating)} />
            <p className="text-sm text-gray-500 mt-1">
              {summary.totalReviews} {t("reviews.reviews") || "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution]}
                total={summary.totalReviews}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User's Review (if exists) */}
      {hasUserReviewed && userReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-green-200 bg-green-50 rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white">
                {t("reviews.yourReview") || "Your Review"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEditReview(userReview)}
                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(t("reviews.confirmDelete") || "Are you sure you want to delete your review?")) {
                    onDeleteReview(userReview.id);
                  }
                }}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <StarRating rating={userReview.rating} />
          <h4 className="font-medium mt-2">{userReview.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{userReview.comment}</p>
          <p className="text-xs text-gray-400 mt-2">
            {formatDate(userReview.createdAt)}
          </p>
        </motion.div>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t("reviews.sortBy") || "Sort by"}:</span>
          <div className="flex gap-2">
            {[
              { value: "helpful", label: t("reviews.mostHelpful") || "Most Helpful" },
              { value: "recent", label: t("reviews.mostRecent") || "Most Recent" },
              { value: "rating", label: t("reviews.highestRated") || "Highest Rated" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as typeof sortBy)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  sortBy === option.value
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <AnimatePresence>
        <div className="space-y-4">
          {sortedReviews
            .filter((r) => r.id !== userReview?.id)
            .map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-xl p-4"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {review.userAvatar ? (
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.userName}</span>
                        {review.isVerifiedPurchase && (
                          <Badge variant="outline" className="text-xs py-0 px-1 border-green-300 text-green-600">
                            <ShieldCheck className="w-3 h-3 mr-0.5" />
                            {t("reviews.verified") || "Verified"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Content */}
                <div className="mt-3">
                  <h4 className="font-medium">{review.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                </div>

                {/* Helpful Button */}
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <button
                    onClick={() => onMarkHelpful(review.id)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      review.userHasMarkedHelpful
                        ? "bg-green-100 text-green-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${
                        review.userHasMarkedHelpful ? "fill-green-700" : ""
                      }`}
                    />
                    {t("reviews.helpful") || "Helpful"} ({review.helpfulCount})
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </AnimatePresence>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <Button
          variant="outline"
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="w-full"
        >
          {showAllReviews ? (
            <>
              {t("reviews.showLess") || "Show Less"}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              {t("reviews.showAll") || "Show All"} ({reviews.length}) {t("reviews.reviews") || "Reviews"}
            </>
          )}
        </Button>
      )}

      {/* Empty State */}
      {reviews.length === 0 && !hasUserReviewed && (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-800 mb-1">
            {t("reviews.noReviews") || "No reviews yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {t("reviews.beFirst") || "Be the first to share your experience!"}
          </p>
          <Button
            onClick={onWriteReview}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Star className="w-4 h-4 mr-1" />
            {t("reviews.writeReview") || "Write Review"}
          </Button>
        </div>
      )}
    </div>
  );
}
