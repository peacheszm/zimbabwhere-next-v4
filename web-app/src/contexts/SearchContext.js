"use client";
import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [filterResults, setFilterResults] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        submittedQuery,
        setSubmittedQuery,
        results,
        setResults,
        location,
        setLocation,
        selectedRegions,
        setSelectedRegions,
        selectedActivities,
        setSelectedActivities,
        filterResults,
        setFilterResults,
        isFiltering,
        setIsFiltering,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
