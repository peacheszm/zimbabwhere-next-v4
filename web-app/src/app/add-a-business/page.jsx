import AddNewBusiness from "@/components/add-a-business/AddNewBusiness";
import SiteSideBar from "@/components/global/Sidebar";

import {
  getBusinessCategories,
  getBusinessSuburbs,
} from "@/lib/endpoints/json/json";

export default async function AddNewBusinessPage() {
  const [businessCats, businessSuburbs] = await Promise.all([
    getBusinessCategories(),
    getBusinessSuburbs(),
  ]);
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Add a Business</h1>
            {/* <p>
              Write down your item/s or shopping list of what you need in one
              quote form and we aim to assist you with putting you in touch with
              the businesses on our platform that can help for any service or
              product you need, based on the requirements you have. This is a
              completely FREE service, its simple to use and FREE to quote !
            </p> */}
          </div>
          <AddNewBusiness cats={businessCats} towns={businessSuburbs} />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
