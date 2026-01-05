import { getBusinessBySlug } from "@/lib/endpoints/business";

import Title from "@/components/single-business/Title";
import Gallery from "@/components/single-business/Gallery";

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
        </main>
        <aside className="aside"></aside>
      </div>
    </div>
  );
}
