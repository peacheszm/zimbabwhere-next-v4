"use client";

import { useState, useEffect } from "react";
import OneSignal from "react-onesignal";

export default function NotificationPrompt({ 
  title = "Enable Notifications", 
  message = "Stay updated with our latest news and alerts." 
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (typeof window !== "undefined") {
          // Fallback to native Notification API for permission check if OneSignal properties are still loading
          const nativePermission = window.Notification?.permission;
          
          if (nativePermission === "default") {
            setShowPrompt(true);
          }
        }
      } catch (e) {
        console.error("Notification permission check error:", e);
      }
    };

    const timer = setTimeout(checkPermission, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    try {
      if (typeof window !== "undefined" && window.OneSignal) {
        await OneSignal.Slidedown.promptPush();
        // The browser typically takes over here, and we can hide our custom prompt
        setShowPrompt(false);
      }
    } catch (e) {
      console.error("OneSignal prompt error:", e);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="notification_prompt_banner" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#f0fdf4', // subtle green background
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div className="notification_prompt_content">
        <h4 style={{ margin: '0 0 0.25rem 0', color: '#166534', fontSize: '1.1rem' }}>{title}</h4>
        <p style={{ margin: 0, color: '#15803d', fontSize: '0.9rem' }}>{message}</p>
      </div>
      <div className="notification_prompt_actions" style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          className="primary" 
          onClick={handleSubscribe} 
          type="button"
          style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#e63946', color: 'white', cursor: 'pointer', fontWeight: 500 }}
        >
          Allow Notifications
        </button>
        <button 
          className="secondary" 
          onClick={() => setShowPrompt(false)} 
          type="button"
          style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', background: 'white', color: '#333', cursor: 'pointer', fontWeight: 500 }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
