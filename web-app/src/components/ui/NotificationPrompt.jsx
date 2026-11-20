"use client";

import { useState, useEffect } from "react";
import { initOneSignal, OneSignal } from "@/lib/onesignal";

// How long to wait for OneSignal before giving up with a message
const SETUP_TIMEOUT_MS = 15000;

// Rejects if `promise` hasn't settled in `ms`, so nothing can wait forever
function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms / 1000}s`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export default function NotificationPrompt({
  title = "Stay Updated!",
  message = "Get notified when a potential customer requests a new quote under your business headings.",
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  // null (idle) | "browser" (waiting for the browser's own Allow/Block
  // prompt) | "setup" (permission granted, signing up with OneSignal)
  const [step, setStep] = useState(null);
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
    if (step === "setup") return;
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

    setStep("browser");
    try {
      // 1. Ask the browser straight away, while we are still inside the click.
      //    Browsers only reliably show their prompt for a real click, and
      //    waiting for OneSignal to start first could let that moment pass (or
      //    hang for good). This does not depend on OneSignal at all.
      let permission = window.Notification.permission;
      if (permission === "default") {
        permission = await window.Notification.requestPermission();
      }

      if (permission === "denied") {
        setError(
          "Notifications were blocked. You can allow them any time from the padlock next to the address bar.",
        );
        return;
      }
      if (permission !== "granted") {
        // The prompt was closed without an answer; the button stays so they
        // can try again
        setError(
          "No problem. Click Allow Notifications again and choose Allow when your browser asks.",
        );
        return;
      }

      // 2. Allowed. Now sign this browser up with OneSignal. Each wait has a
      //    limit so a stuck connection ends in a message, not a spinner.
      setStep("setup");
      await withTimeout(initOneSignal(), SETUP_TIMEOUT_MS, "OneSignal start");
      await withTimeout(
        OneSignal.User.PushSubscription.optIn(),
        SETUP_TIMEOUT_MS,
        "OneSignal opt in",
      );

      setIsDone(true);
      setTimeout(() => setShowPrompt(false), 4000);
    } catch (e) {
      console.error("Notification prompt error:", e);
      setError(
        "Notifications are allowed, but we couldn't finish setting them up. Please reload the page and click Allow Notifications again.",
      );
    } finally {
      setStep(null);
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
        {step === "browser" && (
          <p
            role="status"
            style={{ margin: "0.5rem 0 0 0", color: "#166534", fontSize: "0.9rem" }}
          >
            Your browser is asking for permission. Look near the address bar
            and choose <strong>Allow</strong>.
          </p>
        )}
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
            disabled={step === "setup"}
            type="button"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              background: "#e63946",
              color: "white",
              // Only the short sign-up step is a real "wait"; while the browser
              // prompt is open the button stays clickable, so it never traps
              // anyone behind a spinner
              cursor: step === "setup" ? "wait" : "pointer",
              fontWeight: 500,
              opacity: step ? 0.7 : 1,
            }}
          >
            {step === "setup"
              ? "Turning on..."
              : step === "browser"
                ? "Waiting for your browser..."
                : "Allow Notifications"}
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
