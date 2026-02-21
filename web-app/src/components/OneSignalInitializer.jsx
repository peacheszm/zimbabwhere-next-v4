'use client';

import { useEffect, useRef } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
      OneSignal.init({
        appId: "01595039-d840-4721-b8bf-96b3e36e7399",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });
      initialized.current = true;
    }
  }, []);

  return null;
}
