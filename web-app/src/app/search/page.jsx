import { getBusinessesSearch } from "@/lib/endpoints/search";

import SiteSideBar from "@/components/global/Sidebar";
import BusinessCard from "@/components/search/BusinessCard";
export default async function SearchPage({ searchParams }) {
  const search = await searchParams;
  const results = await getBusinessesSearch(search);

  const featuredResults = results?.featured || [];
  const normalResults = results?.normal || [];

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main search_listings_wrapper">
          <div className="page_results">
            {featuredResults.length + normalResults.length} Results
          </div>
          <div className="search_listings">
            {featuredResults.map((item) => (
              <BusinessCard key={item.id} item={item} />
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
