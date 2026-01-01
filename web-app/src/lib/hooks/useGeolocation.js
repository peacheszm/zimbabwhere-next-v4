import { useState, useEffect } from "react";

/**
 * Hook for getting user's geolocation
 * Asks for permission and returns coordinates
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null); // null = not asked, true = granted, false = denied
  const [isSupported, setIsSupported] = useState(false);

  // Check if geolocation is supported (client-side only)
  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "geolocation" in navigator);
  }, []);

  const requestLocation = () => {
    if (!isSupported) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(coords);
        setHasPermission(true);
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = "Unable to get your location";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location services in your browser.";
            setHasPermission(false);
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
    setHasPermission(null);
  };

  return {
    location,
    error,
    isLoading,
    hasPermission,
    isSupported,
    requestLocation,
    clearLocation,
  };
}
