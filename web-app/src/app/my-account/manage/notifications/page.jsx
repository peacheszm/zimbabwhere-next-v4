import SiteSideBar from "@/components/global/Sidebar";

import { getCurrentUserNotifications } from "@/lib/endpoints/account";
import { getBusinessCategories } from "@/lib/endpoints/json/json";

import { getCurrentUserBusinesses } from "@/lib/endpoints/account";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import FreeCategories from "@/components/my-account/manage/notifications/FreeCategories";
import PaidIndependantCategories from "@/components/my-account/manage/notifications/PaidIndependantCategories";
import PaidBusinessCategories from "@/components/my-account/manage/notifications/PaidBusinessCategories";
import BuyButton from "@/components/global/BuyButton";

export default async function ManageNotifications() {
  const session = await getServerSession(authOptions);

  const [businessCats, userData, userBusiness] = await Promise.all([
    getBusinessCategories(),
    getCurrentUserNotifications(session.jwt),
    getCurrentUserBusinesses(session.jwt),
  ]);

  const hasBusiness = userBusiness.data?.length > 0;
  const hasPaidCategories = hasBusiness
    ? userData.data?.additional_business_categories?.length > 0
    : userData.data?.sign_up_to_notifications?.length > 0;

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          {userBusiness.data?.length === 0 ? (
            <>
              <div className="page_title">
                <h1>Manage my Independent section headings</h1>
              </div>
              {/* Free Headings  */}
              <FreeCategories
                cats={businessCats}
                userData={userData}
                token={session.jwt}
              />

              <h1>Additional Independent Headings</h1>
              <p>$35 / Year / Heading</p>
              <BuyButton title="Buy additional Independent Headings" />
              {hasPaidCategories && (
                <div className="page_title premium_section_header">
                  <h1>Premium Notification Headings</h1>
                  <p className="premium_blurb">
                    You have unlocked premium notification headings! Select your
                    additional categories below to stay informed about the
                    sectors that matter most to you. These headings are part of
                    your paid subscription and allow you to expand your
                    notification reach.
                  </p>
                </div>
              )}

              <PaidIndependantCategories
                cats={businessCats}
                userData={userData}
                token={session.jwt}
              />
            </>
          ) : (
            <>
              {hasPaidCategories && (
                <div className="page_title premium_section_header">
                  <h1>Premium Notification Headings</h1>
                  <p className="premium_blurb">
                    You have unlocked premium notification headings! Select your
                    additional categories below to stay informed about the
                    sectors that matter most to you. These headings are part of
                    your paid subscription and allow you to expand your
                    notification reach.
                  </p>
                </div>
              )}
              <PaidBusinessCategories
                cats={businessCats}
                userData={userData}
                token={session.jwt}
              />
            </>
          )}
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
