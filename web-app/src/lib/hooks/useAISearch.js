import { useState } from "react";
import { searchFarmsWithAI } from "@/lib/endpoints/ai";

/**
 * Hook for AI-powered farm search
 */
export function useAISearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const search = async (query, userLocation = null) => {
    if (!query || query.trim().length === 0) {
      setError("Please enter a search query");
      return null;
    }

    setIsSearching(true);
    setError(null);
    setResults(null);

    try {
      const data = await searchFarmsWithAI(query, userLocation);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to search farms");
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return {
    search,
    isSearching,
    error,
    results,
    clearResults,
  };
}
