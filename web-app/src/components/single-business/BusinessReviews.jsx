"use client";

import React, { useEffect, useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { getBusinessReviews } from "@/lib/endpoints/business";
import { formatDate } from "@/lib/utils/formatDate";
import { useModal } from "@/contexts/ModalContext";

export default function BusinessReviews({ business_id, business_title }) {
  const [comments, setComments] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const businessData = await getBusinessReviews(business_id);
        setComments(businessData.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, [business_id]);

  const findNoRating = (rating) => {
    return 5 - rating;
  };

  const ratingDesc = (rating) => {
    if (rating === 5) return "Top Notch";
    if (rating === 4) return "Mushe";
    if (rating === 3) return "Yah good";
    if (rating === 2) return "Could be better";
    if (rating === 1) return "Eish!";
    return "";
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreReviews = comments.length > 3;

  const handleWriteReview = () => {
    openModal("CreateBusinessReview", {
      business_id,
      business_title,
    });
  };

  return (
    <div id="business_reviews" className="business_reviews">
      <div className="reviews">
        <h4>Reviews</h4>
        <div className="reviews_main inner_container">
          <div className="btn_group btn_top">
            <button
              className="btn btn-green button_first"
              onClick={handleWriteReview}
            >
              Write a review
            </button>
          </div>

          {displayedComments.map((comment, cid) => (
            <div key={cid} className="review">
              <div className="top_row">
                <div className="author_info">
                  <div className="name">{comment.author}</div>
                  <div className="date">{formatDate(comment.date)}</div>
                </div>
                <div className="rating">
                  <span className="rating_text">
                    {ratingDesc(parseInt(comment.rating))}
                  </span>
                  <div className="stars">
                    {Array.from(
                      { length: parseInt(comment.rating) },
                      (_, i) => (
                        <div key={`filled-${i}`} className="star checked">
                          <IconStarFilled size={16} />
                        </div>
                      )
                    )}
                    {Array.from(
                      { length: findNoRating(parseInt(comment.rating)) },
                      (_, i) => (
                        <div key={`empty-${i}`} className="star">
                          <IconStar size={16} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="bottom_row">{comment.content}</div>
            </div>
          ))}

          {hasMoreReviews && !showAll && (
            <div className="btn_group">
              <button className="btn btn-green" onClick={() => setShowAll(true)}>
                Show all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
