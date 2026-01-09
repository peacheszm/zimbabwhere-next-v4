import { getPagesBySlug } from "@/lib/endpoints/pages";
import SiteSideBar from "@/components/global/Sidebar";

export default async function Quotes() {
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
