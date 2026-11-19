"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initOneSignal, OneSignal } from "@/lib/onesignal";

export default function OneSignalInitializer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    initOneSignal().catch((error) =>
      console.error("OneSignal init error:", error),
    );
  }, []);

  // Keep OneSignal's user in step with the logged in user, once it is ready
  useEffect(() => {
    if (status === "loading") return;

    let cancelled = false;

    initOneSignal()
      .then(() => {
        if (cancelled) return;
        if (status === "authenticated" && session?.user?.id) {
          return OneSignal.login("zw_user_" + session.user.id.toString());
        }
        if (status === "unauthenticated") {
          return OneSignal.logout();
        }
      })
      .catch((error) => console.log("OneSignal user sync error:", error));

    return () => {
      cancelled = true;
    };
  }, [session, status]);

  return null;
}
