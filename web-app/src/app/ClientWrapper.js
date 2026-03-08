"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/contexts/ModalContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { UserProvider } from "@/contexts/UserContext";

import Navigation from "@/components/global/Navigation";
import Footer from "@/components/global/Footer";
import CreateBusinessReview from "@/components/modals/CreateBusinessReview";
import OneSignalInitializer from "@/components/OneSignalInitializer";

export default function ClientWrapper({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <SessionProvider>
      <OneSignalInitializer />
      <UserProvider>
        <SearchProvider>
          <ModalProvider>
            <Navigation />
            {children}
            <Footer />
            <CreateBusinessReview />
          </ModalProvider>
        </SearchProvider>
      </UserProvider>
    </SessionProvider>
  );
}
