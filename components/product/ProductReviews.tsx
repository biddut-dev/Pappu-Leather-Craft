"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, MessageSquarePlus } from "lucide-react";
import { Review } from "@/types";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/formatters";

interface ProductReviewsProps {
  productId: string;
  initialRating: number;
  initialCount: number;
}

export default function ProductReviews({
  productId,
  initialRating,
  initialCount,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      error("Please write a comment for your review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || "Verified Experience",
          comment: comment.trim(),
          userName: user?.name || name.trim() || "Customer",
        }),
      });

      const data = await res.json();
      if (res.ok && data.review) {
        setReviews([data.review, ...reviews]);
        setShowForm(false);
        setTitle("");
        setComment("");
        success("Thank you! Your review has been published.");
      } else {
        error(data.message || "Failed to submit review.");
      }
    } catch {
      error("Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pt-8 border-t border-[#222222]">
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#F3EDE3]">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(initialRating) ? "fill-current" : "text-zinc-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-white">
              {initialRating.toFixed(1)} out of 5
            </span>
            <span className="text-xs text-zinc-500">
              ({reviews.length > 0 ? reviews.length : initialCount} ratings)
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] rounded text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:text-white transition-colors self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#8B5E3C]" />
          <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
        </button>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-lg bg-[#141414] border border-[#2B2B2B] space-y-4 animate-in slide-in-from-top-3"
        >
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Share Your Experience
          </h4>

          {/* Rating selector */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-[#C5A059] fill-current"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {!user && (
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Chowdhury"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Review Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent fit and supreme leather quality"
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Detailed Feedback</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the comfort, sizing accuracy, and leather feel..."
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5E3C]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-20 bg-[#161616] rounded animate-pulse" />
          <div className="h-20 bg-[#161616] rounded animate-pulse" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 text-center bg-[#131313] rounded-lg border border-[#222222]">
          <p className="text-sm text-zinc-400">
            Be the first to review this footwear! Share your thoughts on the craftsmanship and fit.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-current" : "text-zinc-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">{rev.title}</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {formatDate(rev.createdAt)}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1">
                <span>By {rev.userName}</span>
                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[#A47551]">
                    <CheckCircle className="w-3 h-3" />
                    Verified Order
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
