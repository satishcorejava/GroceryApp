import { useState } from "react";
import { Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Product } from "../data/products";
import { useTranslation } from "../contexts/TranslationContext";
import { motion } from "motion/react";

interface ReviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, title: string, comment: string) => Promise<boolean>;
  existingReview?: {
    rating: number;
    title: string;
    comment: string;
  };
}

export function ReviewModal({
  product,
  isOpen,
  onClose,
  onSubmit,
  existingReview,
}: ReviewModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (rating === 0) {
      setError(t("reviews.errorSelectRating") || "Please select a rating");
      return;
    }
    if (title.trim().length < 3) {
      setError(t("reviews.errorTitleRequired") || "Please enter a review title");
      return;
    }
    if (comment.trim().length < 10) {
      setError(t("reviews.errorCommentRequired") || "Please write at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(rating, title.trim(), comment.trim());
    setIsSubmitting(false);

    if (success) {
      onClose();
      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
    }
  };

  const getRatingLabel = (r: number) => {
    const labels = [
      "",
      t("reviews.rating1") || "Poor",
      t("reviews.rating2") || "Fair",
      t("reviews.rating3") || "Good",
      t("reviews.rating4") || "Very Good",
      t("reviews.rating5") || "Excellent",
    ];
    return labels[r] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            {existingReview
              ? t("reviews.editReview") || "Edit Review"
              : t("reviews.writeReview") || "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            {t("reviews.shareExperience") || "Share your experience with this product"}
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
            <p className="text-xs text-gray-500 mt-1">₹{product.price}/{product.unit}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("reviews.yourRating") || "Your Rating"} *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </motion.button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {getRatingLabel(hoveredRating || rating)}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("reviews.reviewTitle") || "Review Title"} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("reviews.titlePlaceholder") || "Summarize your experience"}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            maxLength={100}
          />
          <p className="text-xs text-gray-400 text-right">{title.length}/100</p>
        </div>

        {/* Review Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("reviews.reviewComment") || "Your Review"} *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviews.commentPlaceholder") || "Tell us more about your experience..."}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("common.loading") || "Submitting..."
              : existingReview
              ? t("reviews.updateReview") || "Update Review"
              : t("reviews.submitReview") || "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
