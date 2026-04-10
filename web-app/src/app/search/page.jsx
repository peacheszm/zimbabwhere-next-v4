import { getBusinessesSearch } from "@/lib/endpoints/search";
import {
  getBusinessCategories,
  getBusinessTowns,
} from "@/lib/endpoints/json/json";
import { decodeHtml } from "@/lib/utils/decodeHtml";

import SiteSideBar from "@/components/global/Sidebar";
import BusinessCard from "@/components/search/BusinessCard";
export default async function SearchPage({ searchParams }) {
  const search = await searchParams;

  // Parallel fetch results and filter data
  const [results, categories, towns] = await Promise.all([
    getBusinessesSearch(search),
    getBusinessCategories().catch(() => []),
    getBusinessTowns().catch(() => []),
  ]);

  const featuredResults = results?.featured || [];
  const normalResults = results?.normal || [];
  const totalResults = featuredResults.length + normalResults.length;

  // Find category name if filtered
  let categoryName = "";
  if (search.category_filter) {
    const category = categories.find(
      (cat) => cat.id.toString() === search.category_filter.toString()
    );
    if (category) {
      categoryName = decodeHtml(category.label || category.name);
    }
  }

  // Find town name if filtered
  let townName = "";
  if (search.location_filter) {
    const town = towns.find(
      (t) => t.id.toString() === search.location_filter.toString()
    );
    if (town) {
      townName = decodeHtml(town.label || town.name);
    }
  }

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main search_listings_wrapper">
          <div className="page_results">
            {totalResults} Results
            {search.q && ` for "${search.q}"`}
            {categoryName && ` - ${categoryName}`}
            {townName && ` in ${townName}`}
          </div>
          <div className="search_listings">
            {featuredResults.map((item) => (
              <BusinessCard key={item.id} item={item} premium={true} />
            ))}

            {normalResults.map((item) => (
              <BusinessCard key={item.id} item={item} />
            ))}
          </div>
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
