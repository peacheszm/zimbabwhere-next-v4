import { getPagesBySlug } from "@/lib/endpoints/pages";
import SiteSideBar from "@/components/global/Sidebar";

export default async function PrivacyPolicyPage() {
  const data = await getPagesBySlug("privacy-policy-2");

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <h1
            dangerouslySetInnerHTML={{
              __html: data[0]?.title?.rendered,
            }}
          ></h1>
          <div
            className="body_content"
            dangerouslySetInnerHTML={{
              __html: data[0]?.content?.rendered,
            }}
          ></div>
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
