"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { getBusinessRatings } from "@/lib/endpoints/business";
import { useModal } from "@/contexts/ModalContext";

export default function BusinessRatings({
  business_id,
  business_name,
  business_title,
}) {
  const [businessRating, setBusinessRating] = useState(null);
  const { openModal } = useModal();

  useEffect(() => {
    async function fetchRatings() {
      try {
        const data = await getBusinessRatings(business_id);
        setBusinessRating(data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
    fetchRatings();
  }, [business_id]);

  const handleOpenModal = () => {
    openModal("CreateBusinessReview", {
      business_id,
      business_title: business_title || business_name,
    });
  };

  if (!businessRating) return null;

  return (
    <div className="business_star_ratings">
      <div
        className="star_reviews"
        title="Leave a Review for this Business"
        onClick={handleOpenModal}
        style={{ cursor: "pointer" }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="star">
            {i < Math.round(businessRating.average_rating) ? (
              <IconStarFilled size={16} />
            ) : (
              <IconStar size={16} />
            )}
          </div>
        ))}
      </div>

      {businessRating.total_comments === 0 ? (
        <div
          className="review_count"
          title="Be the first to review this company"
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        >
          Be the first to review this company
        </div>
      ) : (
        <div>based on {businessRating.total_comments} Reviews</div>
      )}
    </div>
  );
}
