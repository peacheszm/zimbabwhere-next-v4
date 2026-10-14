import { getAllBusinesses } from "@/lib/endpoints/business";
import { getAllQuotes } from "@/lib/endpoints/quotes";
import { getHeadingsWithBusinesses } from "@/lib/endpoints/headings";

const BASE_URL = process.env.SITE_URL || "https://zimbabwhere.com";

const staticRoutes = [
  "",
  "/add-a-business",
  "/contact",
  "/get-a-quote",
  "/premium-services",
  "/privacy-policy",
  "/quotes",
  "/request-headings",
  "/search",
  "/terms-and-conditions",
];

export default async function sitemap() {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  let businessEntries = [];
  try {
    const businesses = await getAllBusinesses();
    businessEntries = (businesses || [])
      .filter((business) => business?.slug)
      .map((business) => ({
        url: `${BASE_URL}/business/${business.slug}`,
        lastModified: business.modified
          ? new Date(business.modified)
          : new Date(),
      }));
  } catch (error) {
    console.error("Error building business sitemap entries:", error);
  }

  let quoteEntries = [];
  try {
    const quotes = await getAllQuotes();
    quoteEntries = (quotes || [])
      .filter((quote) => quote?.slug)
      .map((quote) => ({
        url: `${BASE_URL}/quotes/${quote.slug}`,
        lastModified: quote.modified ? new Date(quote.modified) : new Date(),
      }));
  } catch (error) {
    console.error("Error building quote sitemap entries:", error);
  }

  // Only headings with at least one business, to avoid submitting empty pages
  const headings = await getHeadingsWithBusinesses();
  const headingEntries = headings
    .filter((heading) => heading?.slug)
    .map((heading) => ({
      url: `${BASE_URL}/headings/${heading.slug}`,
      lastModified: new Date(),
    }));

  return [
    ...staticEntries,
    ...headingEntries,
    ...businessEntries,
    ...quoteEntries,
  ];
}
