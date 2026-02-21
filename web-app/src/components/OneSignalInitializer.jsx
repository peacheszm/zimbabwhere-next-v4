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
      }).then(() => {
        OneSignal.Slidedown.promptPush();
      });
    }
  }, []);

  // Sync user ID with OneSignal when session changes
  useEffect(() => {
    console.log('[OneSignal] Session check:', {
      isInitialized: initialized.current,
      sessionStatus: status,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id
    });

    if (initialized.current && session?.user?.id) {
      console.log('[OneSignal] Logging in user:', session.user.id.toString());
      OneSignal.login(session.user.id.toString())
        .then(() => console.log('[OneSignal] User login successful'))
        .catch(err => console.error('[OneSignal] User login failed:', err));
    } else if (initialized.current && status === 'unauthenticated') {
      console.log('[OneSignal] User unauthenticated, logging out device from user profile');
      OneSignal.logout();
    }
  }, [session, status]);

  return null;
}
