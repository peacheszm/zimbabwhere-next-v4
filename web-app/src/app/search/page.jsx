import { getBusinessesSearch } from "@/lib/endpoints/search";

import SiteSideBar from "@/components/global/Sidebar";

export default async function PrivacyPolicyPage({ searchParams }) {
  const search = await searchParams;
  const results = await getBusinessesSearch(search);
  //   const ss = searchParams();
  console.log(results);
  //   const data = await getPagesBySlug("privacy-policy-2");

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main"></main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
