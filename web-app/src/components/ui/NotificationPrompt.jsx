"use client";

import { useState, useEffect } from "react";
import { initOneSignal, OneSignal } from "@/lib/onesignal";

export default function NotificationPrompt({
  title = "Stay Updated!",
  message = "Get notified when a potential customer requests a new quote under your business headings.",
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPermission = () => {
      // Only ask people who haven't decided yet
      if (
        typeof window !== "undefined" &&
        window.Notification?.permission === "default"
      ) {
        setShowPrompt(true);
      }
    };

    const timer = setTimeout(checkPermission, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    if (isBusy) return;
    setError(null);

    if (typeof window === "undefined" || !("Notification" in window)) {
      setError("This browser doesn't support notifications.");
      return;
    }

    // Once blocked, only the browser's site settings can change it
    if (window.Notification.permission === "denied") {
      setError(
        "Notifications are blocked for this site. Click the padlock next to the address bar, set Notifications to Allow, then reload the page.",
      );
      return;
    }

    setIsBusy(true);
    try {
      // Wait until OneSignal has finished starting, then ask for permission.
      // This opens the browser's own "Allow notifications" prompt.
      await initOneSignal();
      await OneSignal.Notifications.requestPermission();

      if (window.Notification.permission === "granted") {
        await OneSignal.User.PushSubscription.optIn();
        setIsDone(true);
        setTimeout(() => setShowPrompt(false), 4000);
      } else if (window.Notification.permission === "denied") {
        setError(
          "Notifications were blocked. You can allow them any time from the padlock next to the address bar.",
        );
      }
      // "default" means the browser prompt was dismissed; the button stays
      // so they can try again
    } catch (e) {
      console.error("OneSignal prompt error:", e);
      setError(
        "We couldn't turn on notifications. Please reload the page and try again.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div
      className="notification_prompt_banner"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#f0fdf4", // subtle green background
        border: "1px solid #bbf7d0",
        borderRadius: "8px",
        padding: "1rem 1.5rem",
        marginBottom: "1.5rem",
        gap: "1rem",
      }}
    >
      <div className="notification_prompt_content">
        <h4
          style={{
            margin: "0 0 0.25rem 0",
            color: "#166534",
            fontSize: "1.1rem",
          }}
        >
          {isDone ? "Notifications are on" : title}
        </h4>
        <p style={{ margin: 0, color: "#15803d", fontSize: "0.9rem" }}>
          {isDone
            ? "You'll be notified when a customer requests a quote under your headings."
            : message}
        </p>
        {error && (
          <p
            role="alert"
            style={{
              margin: "0.5rem 0 0 0",
              color: "#b91c1c",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}
      </div>
      {!isDone && (
        <div
          className="notification_prompt_actions"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
        >
          <button
            className="primary"
            onClick={handleSubscribe}
            disabled={isBusy}
            type="button"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              background: "#e63946",
              color: "white",
              cursor: isBusy ? "wait" : "pointer",
              fontWeight: 500,
              opacity: isBusy ? 0.7 : 1,
            }}
          >
            {isBusy ? "Please wait..." : "Allow Notifications"}
          </button>
          <button
            className="secondary"
            onClick={() => setShowPrompt(false)}
            type="button"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "white",
              color: "#333",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Maybe Later
          </button>
        </div>
      )}
    </div>
  );
}
