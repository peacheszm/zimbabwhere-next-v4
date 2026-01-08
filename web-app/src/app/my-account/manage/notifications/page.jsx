import SiteSideBar from "@/components/global/Sidebar";

import { getCurrentUserNotifications } from "@/lib/endpoints/account";
import { getBusinessCategories } from "@/lib/endpoints/json/json";

import { getCurrentUserBusinesses } from "@/lib/endpoints/account";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import FreeCategories from "@/components/my-account/manage/notifications/FreeCategories";
import PaidIndependantCategories from "@/components/my-account/manage/notifications/PaidIndependantCategories";
import PaidBusinessCategories from "@/components/my-account/manage/notifications/PaidBusinessCategories";

export default async function ManageNotifications() {
  const session = await getServerSession(authOptions);

  const [businessCats, userData, userBusiness] = await Promise.all([
    getBusinessCategories(),
    getCurrentUserNotifications(session.jwt),
    getCurrentUserBusinesses(session.jwt),
  ]);

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Manage my Independent section headings</h1>
          </div>
          {userBusiness.data?.length === 0 ? (
            <>
              {/* Free Headings  */}
              <FreeCategories
                cats={businessCats}
                userData={userData}
                token={session.jwt}
              />
              <PaidIndependantCategories
                cats={businessCats}
                userData={userData}
                token={session.jwt}
              />
            </>
          ) : (
            <PaidBusinessCategories
              cats={businessCats}
              userData={userData}
              token={session.jwt}
            />
          )}
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
