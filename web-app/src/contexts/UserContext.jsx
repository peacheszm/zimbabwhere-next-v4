"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getCurrentUserProfile } from "@/lib/endpoints/users";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user profile when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.jwt && session?.user?.id) {
      loadUserProfile();
    } else if (status === "unauthenticated") {
      // Clear profile when user logs out
      setUserProfile(null);
      setError(null);
    }
  }, [session, status]);

  const loadUserProfile = async () => {
    if (!session?.jwt || !session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const profile = await getCurrentUserProfile(session.user.id, session.jwt);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const refreshUserProfile = () => {
    if (session?.jwt && session?.user?.id) {
      loadUserProfile();
    }
  };

  const value = {
    userProfile,
    loading,
    error,
    updateUserProfile,
    refreshUserProfile,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
