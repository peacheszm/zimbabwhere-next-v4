import GetQuote from "@/components/get-a-quote/GetQuote";
import SiteSideBar from "@/components/global/Sidebar";
import {
  getBusinessCategories,
  getBusinessTowns,
} from "@/lib/endpoints/json/json";

import { getBusinessById } from "@/lib/endpoints/business";

export default async function GetAQuotePage({ searchParams }) {
  const params = await searchParams;
  const bid = params?.bid;

  let business = null;
  if (bid) {
    try {
      business = await getBusinessById(bid);
    } catch (error) {
      console.error("Error fetching business for quote:", error);
    }
  }

  const [businessCats, businessTowns] = await Promise.all([
    getBusinessCategories(),
    getBusinessTowns(),
  ]);
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title" style={{ paddingBottom: "45px" }}>
            <h1>Welcome to the quote me application page</h1>
            <p>
              Write down your item/s or shopping list of what you need in one
              quote form and we aim to assist you with putting you in touch with
              the businesses on our platform that can help for any service or
              product you need, based on the requirements you have. This is a
              completely FREE service, its simple to use and FREE to quote !
            </p>
          </div>

          <GetQuote
            cats={businessCats}
            towns={businessTowns}
            business={business}
          />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
