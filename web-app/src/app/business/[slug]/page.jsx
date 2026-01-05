import { getBusinessBySlug } from "@/lib/endpoints/business";

import Title from "@/components/single-business/Title";
import Gallery from "@/components/single-business/Gallery";
import ContactUs from "@/components/single-business/ContactUs";
import Overview from "@/components/single-business/Overview";
import WebSocial from "@/components/single-business/WebSocial";
import Hours from "@/components/single-business/Hours";

export default async function SingleBusiness({ params }) {
  const { slug } = await params;

  const posts = await getBusinessBySlug(slug);
  const post = posts[0];
  console.log(post);
  //   const [featuredBusiness, businessLogos] = await Promise.all([
  //     getBillboardAds(),
  //     getFeaturedLogoAds(),
  //   ]);

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
          {/* <BusinessReviews
            business_id={post.id}
            business_title={post.title?.rendered}
            onRateClick={() => setShowModal(true)}
          /> */}
        </main>
        <aside className="aside">
          <WebSocial post={post} />
          <Hours post={post} />
        </aside>
      </div>
    </div>
  );
}
