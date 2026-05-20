import RequestHeadingsForm from "@/components/request-headings/RequestHeadingsForm";
import SiteSideBar from "@/components/global/Sidebar";

export const dynamic = "force-dynamic";

export default async function RequestHeadingsPage() {
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Request a Heading</h1>
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#bbb" }}>
              Can't find the business category or heading you are looking for?
              Suggest a new heading below, and we'll review and add it as soon
              as possible.
            </p>
          </div>
          <RequestHeadingsForm />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
