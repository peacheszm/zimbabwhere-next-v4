"use client";

import { useEffect } from "react";
import { incrementQuoteView } from "@/lib/endpoints/quotes";

export default function QuoteViewTracker({ quoteId }) {
  useEffect(() => {
    if (quoteId) {
      // Call the view increment API
      incrementQuoteView(quoteId).then((result) => {
        if (result.success) {
          console.log("View count updated:", result.data?.views);
        } else {
          console.error("Failed to increment view count:", result.error);
        }
      });
    }
  }, [quoteId]);

  // This component doesn't render anything
  return null;
}
