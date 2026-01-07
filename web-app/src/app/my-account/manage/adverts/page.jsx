import SiteSideBar from "@/components/global/Sidebar";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { getCurrentUserPurchases } from "@/lib/endpoints/paid-listings";
import { getCurrentUserBusinesses } from "@/lib/endpoints/account";

import PaidAdverts from "@/components/my-account/manage/adverts/PaidAdverts";

export default async function ManageAdvertsPage() {
  const session = await getServerSession(authOptions);

  const [usersPurchases, usersBusiness] = await Promise.all([
    getCurrentUserPurchases(session.jwt),
    getCurrentUserBusinesses(session.jwt),
  ]);

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Manage my Paid for Advertising</h1>
          </div>

          <PaidAdverts
            purchases={usersPurchases}
            businesses={usersBusiness}
            token={session.jwt}
          />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
