import SiteSideBar from "@/components/global/Sidebar";

export default async function AddNewBusinessPage() {
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <h2>Add a New Business</h2>
          {/* Add your business form component here */}
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
