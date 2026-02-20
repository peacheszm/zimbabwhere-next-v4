import {
  getBusinessBySlug,
  getAllBusinesses,
  getBusinessById,
} from "@/lib/endpoints/business";
import { redirect, notFound } from "next/navigation";

import Title from "@/components/single-business/Title";
import Gallery from "@/components/single-business/Gallery";
import ContactUs from "@/components/single-business/ContactUs";
import Overview from "@/components/single-business/Overview";
import WebSocial from "@/components/single-business/WebSocial";
import Hours from "@/components/single-business/Hours";
import Map from "@/components/single-business/Map";
import Share from "@/components/single-business/Share";
import Categorys from "@/components/single-business/Categorys";
import BusinessReviews from "@/components/single-business/BusinessReviews";

import { yoastToMetadata } from "@/lib/seo/seo";

// export async function generateStaticParams() {
//   const businesses = await getAllBusinesses();
//   return businesses.map((business) => ({
//     slug: business.slug,
//   }));
// }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let page = null;

  try {
    const pages = await getBusinessBySlug(`${slug}`);
    if (pages && pages.length > 0) {
      page = pages[0];
    } else if (/^\d+$/.test(slug)) {
      // If not found by slug, and slug is numeric, we might be redirecting
      try {
        const business = await getBusinessById(slug);
        if (business && business.slug) {
          return {}; // Will redirect in the component
        }
      } catch (e) {
        return {};
      }
    }
  } catch (error) {
    return {};
  }

  if (!page) return {};

  return yoastToMetadata(page.yoast_head_json, `/business/${slug}`);
}

export default async function SingleBusiness({ params }) {
  const { slug } = await params;
  let post = null;
  let redirectUrl = null;

  try {
    const posts = await getBusinessBySlug(slug);
    if (posts && posts.length > 0) {
      post = posts[0];
    } else if (/^\d+$/.test(slug)) {
      // Check if the slug is numeric and fetch by ID
      try {
        const business = await getBusinessById(slug);

        if (business && business.slug) {
          redirectUrl = `/business/${business.slug}`;
        }
      } catch (e) {
        // ID not found either
      }
    }
  } catch (error) {
    // Fetch failed entirely
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="single_business_page_wrapper">
      <div className="container">
        <main className="main">
          {/* Business Title */}
          <Title post={post} />

          {/* Business Gallery */}
          <Gallery post={post} />

          {/* Business Contact */}
          <ContactUs post={post} />

          {/* Business OverView */}
          <Overview post={post} />
          <div className="mobile_only">
            <Categorys post={post} />
            <br />
          </div>

          {/* Reviews */}
          <BusinessReviews
            business_id={post.id}
            business_title={post.title?.rendered}
          />
        </main>
        <aside className="aside">
          <WebSocial post={post} />
          <Hours post={post} />
          <Map post={post} />
          <Share post={post} />
        </aside>
      </div>
    </div>
  );
}
