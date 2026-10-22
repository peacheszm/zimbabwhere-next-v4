import Link from "next/link";
import { notFound } from "next/navigation";

import { getHeadingBySlug } from "@/lib/endpoints/headings";
import { getBusinessesSearch } from "@/lib/endpoints/search";
import {
  headingMetadata,
  getHeadingPath,
  HEADING_IMAGE_PATH,
} from "@/lib/seo/headings";
import { decodeHtml } from "@/lib/utils/decodeHtml";

import SiteSideBar from "@/components/global/Sidebar";
import BusinessCard from "@/components/search/BusinessCard";
import ShareHeading from "@/components/headings/ShareHeading";

const SITE_URL = process.env.SITE_URL || "https://zimbabwhere.com";

// Rebuild the page in the background at most every 10 minutes
export const revalidate = 600;

// Both generateMetadata and the page call this. The identical fetch is only
// made once per request.
async function getHeadingResults(headingId) {
  try {
    return await getBusinessesSearch({ category_filter: headingId });
  } catch (error) {
    console.error("Error fetching businesses for heading:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const heading = await getHeadingBySlug(slug);

  if (!heading) {
    return {
      title: "Heading not found | Zimbabwhere",
      robots: { index: false, follow: true },
    };
  }

  const results = await getHeadingResults(heading.id);
  const count = results
    ? (results.featured?.length || 0) + (results.normal?.length || 0)
    : null;

  return headingMetadata({
    name: decodeHtml(heading.label || heading.title),
    slug,
    count,
  });
}

// Escape "<" so a business name can't close the script tag
const toJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export default async function HeadingPage({ params }) {
  const { slug } = await params;
  const heading = await getHeadingBySlug(slug);

  if (!heading) notFound();

  const name = decodeHtml(heading.label || heading.title);
  const results = await getHeadingResults(heading.id);

  const featuredResults = results?.featured || [];
  const normalResults = results?.normal || [];
  const total = featuredResults.length + normalResults.length;

  const pageUrl = `${SITE_URL}${getHeadingPath(slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `${name} in Zimbabwe`,
        image: `${SITE_URL}${HEADING_IMAGE_PATH}`,
        isPartOf: { "@type": "WebSite", name: "Zimbabwhere", url: SITE_URL },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        ...(total > 0
          ? {
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: total,
                itemListElement: [...featuredResults, ...normalResults]
                  .slice(0, 20)
                  .map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/business/${item.slug}`,
                    name: decodeHtml(item.title),
                  })),
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="page_wrapper heading_page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
      />
      <div className="container">
        <main className="main search_listings_wrapper">
          <nav className="heading_breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{name}</span>
          </nav>

          <div className="page_title">
            <h1>{name}</h1>
            <p className="heading_intro">
              {results === null
                ? `We couldn't load the businesses listed under ${name} right now. Please try again shortly.`
                : total > 0
                  ? `${total} ${
                      total === 1 ? "business is" : "businesses are"
                    } listed under ${name} in Zimbabwe. Contact them directly or request a free quote.`
                  : `No businesses are listed under ${name} yet.`}
            </p>
          </div>

          {total === 0 && results !== null && (
            <div className="heading_empty">
              <p>
                Need {name}? <Link href="/get-a-quote">Request a free quote</Link>{" "}
                and we'll pass it on to the right businesses. Run a business
                that fits this heading?{" "}
                <Link href="/add-a-business">Add your business for free</Link>.
              </p>
            </div>
          )}

          <div className="search_listings">
            {featuredResults.map((item) => (
              <BusinessCard key={item.id} item={item} premium={true} />
            ))}

            {normalResults.map((item) => (
              <BusinessCard key={item.id} item={item} />
            ))}
          </div>

          <ShareHeading title={name} url={pageUrl} />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
