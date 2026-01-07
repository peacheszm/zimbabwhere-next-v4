import SiteSideBar from "@/components/global/Sidebar";

import { getCurrentUserNotifications } from "@/lib/endpoints/account";
import { getBusinessCategories } from "@/lib/endpoints/json/json";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import FreeCategories from "@/components/my-account/manage/notifications/FreeCategories";

export default async function ManageNotifications() {
  const session = await getServerSession(authOptions);

  const [businessCats, userData] = await Promise.all([
    getBusinessCategories(),
    getCurrentUserNotifications(session.jwt),
  ]);

  // console.log(userData)

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Manage my Independent section headings</h1>
          </div>

          <FreeCategories cats={businessCats} userData={userData} token={session.jwt} />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
