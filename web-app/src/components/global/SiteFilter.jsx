"use client";

import React, { useEffect, useState } from "react";
import {
  getQuickBusinessSearch,
  getBusinessCategories,
  getBusinessTowns,
} from "@/lib/endpoints/json/json";
import SiteFilterClient from "@/components/global/SiteFilterClient";

export default function SiteFilter() {
  const [initialData, setInitialData] = useState({
    searchData: [],
    categories: [],
    towns: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [searchData, categories, towns] = await Promise.all([
          getQuickBusinessSearch().catch(() => []),
          getBusinessCategories().catch(() => []),
          getBusinessTowns().catch(() => []),
        ]);

        setInitialData({
          searchData,
          categories: Array.isArray(categories) ? categories : [],
          towns: Array.isArray(towns) ? towns : [],
        });
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return null; // or a subtle loading bar
  console.log(initialData)

  return <SiteFilterClient initialData={initialData} />;
}
