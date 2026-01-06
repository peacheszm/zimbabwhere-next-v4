"use client";

import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/contexts/ModalContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { UserProvider } from "@/contexts/UserContext";

import Navigation from "@/components/global/Navigation";
import Footer from "@/components/global/Footer";
import CreateBusinessReview from "@/components/modals/CreateBusinessReview";

export default function ClientWrapper({ children }) {
  return (
    <SessionProvider>
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
