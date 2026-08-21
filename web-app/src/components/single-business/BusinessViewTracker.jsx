"use client";

import { useEffect } from "react";
import { incrementBusinessView } from "@/lib/endpoints/business";

export default function BusinessViewTracker({ businessId }) {
  useEffect(() => {
    if (businessId) {
      // Call the view increment API
      incrementBusinessView(businessId).then((result) => {
        if (result.success) {
          console.log("View count updated:", result.data?.views);
        } else {
          console.error("Failed to increment view count:", result.error);
        }
      });
    }
  }, [businessId]);

  // This component doesn't render anything
  return null;
}
