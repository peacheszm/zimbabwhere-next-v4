import { getBusinessBySlug, getAllBusinesses } from "@/lib/endpoints/business";

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
  const pages = await getBusinessBySlug(`${slug}`);
  const page = pages[0];
  if (!page) return {};

  return yoastToMetadata(page.yoast_head_json, `/business/${slug}`);
}

export default async function SingleBusiness({ params }) {
  const { slug } = await params;
  const posts = await getBusinessBySlug(slug);
  const post = posts[0];

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
          <Categorys post={post} />
        </aside>
      </div>
    </div>
  );
}
