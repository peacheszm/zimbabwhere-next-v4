import { forwardRef, useEffect } from "react";
import { IconSearch, IconCurrentLocation } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { useGeolocation } from "@/lib/hooks/useGeolocation";

import { useSearch } from "@/contexts/SearchContext";

const SiteFilter = forwardRef(function SiteFilter(props, ref) {
  const { query, setQuery, setSubmittedQuery, setLocation } = useSearch();
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setSubmittedQuery(query);
    router.push("/farms");
  }

  // Location Services

  const {
    location,
    error: locationError,
    isLoading: isLoadingLocation,
    hasPermission,
    isSupported,
    requestLocation,
    clearLocation,
  } = useGeolocation();

  // Sync geolocation to SearchContext
  useEffect(() => {
    setLocation(location);
  }, [location, setLocation]);

  const handleNearMeClick = () => {
    if (location) {
      // Already have location, clear it
      clearLocation();
    } else {
      // Request location
      requestLocation();
    }
  };
  // Best farms for red wine tastings in Stellenbosch?
  // Where can I stay overnight?
  // Which farms have picnics or kids’ areas?
  // Ask about wine farms, experiences, or events...
  return (
    <div className="site_filter" ref={ref}>
      <div className="site_filter_inner">
        <form onSubmit={handleSubmit}>
          <div className="form_inner">
            <div className="form_search">
              {isSupported && (
                <button
                  className="location"
                  type="button"
                  onClick={handleNearMeClick}
                  disabled={isLoadingLocation}
                  title={
                    location
                      ? "Location enabled"
                      : "Enable location for nearby recommendations"
                  }
                >
                  <IconCurrentLocation size={16} />
                  {isLoadingLocation ? "..." : location ? "✓" : ""}
                </button>
              )}
              <div className="form_row">
                <label htmlFor="aiSearch">Ask Rae</label>
                <input
                  id="aiSearch"
                  type="text"
                  placeholder="Best farms for red wine tastings in Stellenbosch?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button type="submit">
                <IconSearch />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default SiteFilter;
