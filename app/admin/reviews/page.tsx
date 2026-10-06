"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Review } from "@/types";
import { formatDate } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, approve: !currentStatus }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, isApproved: !currentStatus } : r))
        );
        success(!currentStatus ? "Review approved" : "Review hidden");
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Customer Review Moderation
          </h1>
          <p className="text-xs text-zinc-400">
            Verify honest feedback, approve genuine customer testimonials, and manage star ratings.
          </p>
        </div>
      </div>

      <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Reviewer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Title & Comment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No submitted reviews in database.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-[#161616] transition-colors">
                    <td className="p-3">
                      <strong className="text-white block">{rev.userName}</strong>
                      <span className="text-[10px] text-zinc-500">{formatDate(rev.createdAt)}</span>
                    </td>

                    <td className="p-3">
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
                    </td>

                    <td className="p-3 max-w-xs">
                      <span className="font-semibold text-white block">{rev.title}</span>
                      <p className="text-zinc-400 text-[11px] line-clamp-2">{rev.comment}</p>
                    </td>

                    <td className="p-3">
                      {rev.isApproved ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold uppercase">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleApproval(rev._id, rev.isApproved)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          rev.isApproved
                            ? "bg-[#181818] hover:bg-zinc-700 text-zinc-300"
                            : "bg-[#8B5E3C] hover:bg-[#A47551] text-white"
                        }`}
                      >
                        {rev.isApproved ? "Hide" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
