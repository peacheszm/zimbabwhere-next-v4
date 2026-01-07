import SiteSideBar from "@/components/global/Sidebar";
import { getCurrentUserBusinesses } from "@/lib/endpoints/account";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import NoBusiness from "@/components/my-account/NoBusiness";
import MyBusinessList from "@/components/my-account/MyBusinessList";

export default async function MyAccountPage() {
  const session = await getServerSession(authOptions);

  const response = await getCurrentUserBusinesses(session.jwt);
  console.log(response);
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          {!response?.data && <NoBusiness />}
          {response?.data && <MyBusinessList data={response.data} />}
          
          
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
