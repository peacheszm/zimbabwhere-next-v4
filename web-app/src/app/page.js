import FeaturedBusinessBanner from "@/components/home/FeaturedBusinessBanner";
import FeaturedBusinessLogos from "@/components/home/FeaturedBusinessLogos";

import {
  getBillboardAds,
  getFeaturedLogoAds,
} from "@/lib/endpoints/ads/adverts";

export default async function Home() {
  const [featuredBusiness, businessLogos] = await Promise.all([
    getBillboardAds(),
    getFeaturedLogoAds(),
  ]);

  return (
    <div className="home_page">
      <FeaturedBusinessBanner businesses={featuredBusiness} />
      <FeaturedBusinessLogos businesses={businessLogos} />
    </div>
  );
}
