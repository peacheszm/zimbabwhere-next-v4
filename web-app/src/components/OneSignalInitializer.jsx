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
          size: "medium",
          theme: "default",
          position: "bottom-right",
          text: {
            "tip.state.unsubscribed": "Allow notifications",
            "tip.state.subscribed": "You're subscribed to notifications",
            "tip.state.blocked": "You've blocked notifications",
            "message.prenotify": "Click to subscribe to notifications",
            "message.action.subscribed": "Thanks for subscribing!",
            "message.action.resubscribed": "You're subscribed to notifications",
            "message.action.unsubscribed": "You won't receive notifications again",
            "dialog.main.title": "Manage Site Notifications",
            "dialog.main.button.subscribe": "SECURE SUBSCRIBE",
            "dialog.main.button.unsubscribe": "UNSUBSCRIBE"
          }
        },
        allowLocalhostAsSecureOrigin: true,
      });
      initialized.current = true;
    }
  }, []);

  return null;
}
