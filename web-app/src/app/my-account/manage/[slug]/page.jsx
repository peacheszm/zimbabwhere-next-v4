import Link from "next/link";
import { getBusinessBySlug } from "@/lib/endpoints/business";

import SiteSideBar from "@/components/global/Sidebar";

import Logo from "@/components/my-account/manage/single-business/Logo";
import Banner from "@/components/my-account/manage/single-business/Banner";
import Categories from "@/components/my-account/manage/single-business/Categories";
import Info from "@/components/my-account/manage/single-business/Info";
import Hours from "@/components/my-account/manage/single-business/Hours";
import Social from "@/components/my-account/manage/single-business/Social";
import Videos from "@/components/my-account/manage/single-business/Videos";
import Gallery from "@/components/my-account/manage/single-business/Gallery";

import { getBusinessCategories } from "@/lib/endpoints/json/json";

export default async function ManageSingleBusiness({ params }) {
  const { slug } = await params;
  const [businessData, businessCats] = await Promise.all([
    getBusinessBySlug(slug),
    getBusinessCategories(),
  ]);
  const business = businessData[0];

  return (
    <div className="page_wrapper manage_single_business">
      <div className="container">
        <main className="main">
          <Logo data={business} />
          <Gallery data={business} />

          <Hours data={business} />
          <Social data={business} />
          <Videos data={business} />

          <Categories data={business} cats={businessCats} />
          <Banner data={business} />

          <Info data={business} />

          <div className="see_more_links">
            <Link href={`/add-a-business`}>Add New Business</Link>
            <Link href={`/business/${business.slug}`}>View Business</Link>
          </div>
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
