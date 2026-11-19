import OneSignal from "react-onesignal";

const APP_ID = "01595039-d840-4721-b8bf-96b3e36e7399";

let initPromise = null;

/**
 * Start OneSignal once and hand back the same promise to everyone who asks.
 *
 * Both the page-level initializer and the "Allow Notifications" button need
 * OneSignal to be ready. Starting it from one place and waiting on this
 * promise means a click can never reach OneSignal before it has finished
 * starting (which is what made the button do nothing).
 */
export function initOneSignal() {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (!initPromise) {
    initPromise = OneSignal.init({
      appId: APP_ID,
      notifyButton: {
        enable: true,
        size: "medium",
        theme: "default",
        position: "bottom-right",
      },
      allowLocalhostAsSecureOrigin: true,
      // One service worker for the whole site (see public/sw.js). Two workers
      // on the same scope replace each other, which breaks push.
      serviceWorkerPath: "sw.js",
      serviceWorkerParam: { scope: "/" },
    })
      .then(() => OneSignal)
      .catch((error) => {
        // Let the next caller try again
        initPromise = null;
        throw error;
      });
  }

  return initPromise;
}

export { OneSignal };
