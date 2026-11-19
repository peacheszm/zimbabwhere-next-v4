import { redirect } from "next/navigation";
import { getBusinessesSearch } from "@/lib/endpoints/search";
import {
  getBusinessCategories,
  getBusinessTowns,
} from "@/lib/endpoints/json/json";
import { getHeadingById } from "@/lib/endpoints/headings";
import { headingMetadata } from "@/lib/seo/headings";
import { decodeHtml } from "@/lib/utils/decodeHtml";
import { groupBusinesses } from "@/lib/utils/groupBusinesses";

import SiteSideBar from "@/components/global/Sidebar";
import BusinessCard from "@/components/search/BusinessCard";
import BusinessGroupCard from "@/components/search/BusinessGroupCard";

// A link to just a heading (/search?category_filter=123) is the old way of
// sharing a heading. It redirects to that heading's own page.
const isHeadingOnly = (search) =>
  Boolean(search.category_filter) &&
  !search.q &&
  !search.search &&
  !search.location_filter &&
  !search.area &&
  !search.town;

export async function generateMetadata({ searchParams }) {
  const search = await searchParams;

  // Already shared heading links keep their title, description and image in
  // link previews (crawlers don't always follow the redirect)
  if (isHeadingOnly(search)) {
    const heading = await getHeadingById(search.category_filter);
    if (heading?.slug) {
      return headingMetadata({
        name: decodeHtml(heading.label || heading.title),
        slug: heading.slug,
      });
    }
  }

  return {
    title: "Search Businesses | Zimbabwhere",
    description:
      "Search local businesses across Zimbabwe by category, town, or keyword on Zimbabwhere.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const search = await searchParams;

  if (isHeadingOnly(search)) {
    const heading = await getHeadingById(search.category_filter);
    if (heading?.slug) redirect(`/headings/${heading.slug}`);
  }

  // Parallel fetch results and filter data
  const [results, categories, towns] = await Promise.all([
    getBusinessesSearch(search),
    getBusinessCategories().catch(() => []),
    getBusinessTowns().catch(() => []),
  ]);

  const featuredResults = results?.featured || [];
  const normalResults = results?.normal || [];
  const totalResults = featuredResults.length + normalResults.length;
  // Chains with several branches show as one card, same as on heading pages
  const normalEntries = groupBusinesses(normalResults);

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

            {normalEntries.map((entry) =>
              entry.type === "group" ? (
                <BusinessGroupCard key={entry.key} group={entry} />
              ) : (
                <BusinessCard key={entry.item.id} item={entry.item} />
              ),
            )}
          </div>
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
