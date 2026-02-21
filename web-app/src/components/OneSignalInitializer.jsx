'use client';

import { useEffect, useRef } from 'react';
import OneSignal from 'react-onesignal';
import { useSession } from 'next-auth/react';

export default function OneSignalInitializer() {
  const initialized = useRef(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
      initialized.current = true;
      OneSignal.init({
        appId: "01595039-d840-4721-b8bf-96b3e36e7399",
        notifyButton: {
          enable: true,
          size: "medium",
          theme: "default",
          position: "bottom-right",
        },
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        OneSignal.Slidedown.promptPush();
      });
    }
  }, []);

  // Sync user ID with OneSignal when session changes AFTER initialization
  // Sync user ID with OneSignal when session changes AFTER initialization
  useEffect(() => {
    // Only attempt login if initialized has flipped AND we have a valid session
    if (initialized.current) {
        if (status === 'authenticated' && session?.user?.id) {
            const externalId = 'zw_user_' + session.user.id.toString();
            // Wrap in a tiny timeout to ensure OneSignal's internal state is fully ready
            // after the init() promise returns (sometimes there is a race condition)
            setTimeout(() => {
                OneSignal.login(externalId).catch(e => console.log('OneSignal Login Error:', e));
            }, 500);
        } else if (status === 'unauthenticated') {
            setTimeout(() => {
                OneSignal.logout().catch(e => console.log('OneSignal Logout Error:', e));
            }, 500);
        }
    }
  }, [session, status]);

  return null;
}
