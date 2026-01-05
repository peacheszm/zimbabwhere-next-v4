import FeaturedBusinessBanner from "@/components/home/FeaturedBusinessBanner";
import FeaturedBusinessLogos from "@/components/home/FeaturedBusinessLogos";
import Quotes from "@/components/home/Quotes";

import SiteSideBar from "@/components/global/Sidebar";

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
      <div className="page_wrapper small_pad">
        <div className="container">
          <main className="main">
            <Quotes />
          </main>
          <aside className="aside">
            <SiteSideBar />
          </aside>
        </div>
      </div>
    </div>
  );
}
