import { forwardRef, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSearch } from "@/contexts/SearchContext";

import {
  getAllTaxonomies,
  formatTaxonomyForSelect,
} from "@/lib/endpoints/taxonomies";
// import { filterFarms } from "@/lib/endpoints/farms";
// import FilterModal from "@/components/modals/FilterModal";

import { IconX } from "@tabler/icons-react";

const SiteFilter = forwardRef(function SiteFilter(props, ref) {
  const {
    setSubmittedQuery,
    selectedRegions,
    setSelectedRegions,
    selectedActivities,
    setSelectedActivities,
    setFilterResults,
    setIsFiltering,
  } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const [taxonomyData, setTaxonomyData] = useState({});
  const [taxonomyLoading, setTaxonomyLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'region' | 'activity' | null

  // Load taxonomy data on component mount
  useEffect(() => {
    loadTaxonomyData();
  }, []);

  const loadTaxonomyData = async () => {
    try {
      setTaxonomyLoading(true);
      const taxonomies = await getAllTaxonomies(["region", "activity_type"]);

      const formattedTaxonomies = formatTaxonomyForSelect(taxonomies);
      setTaxonomyData(formattedTaxonomies);
    } catch (error) {
      console.error("Error loading taxonomy data:", error);
      setMessage("Error loading taxonomy data");
    } finally {
      setTaxonomyLoading(false);
    }
  };

  // Location Services

  const toggleRegion = (slug) => {
    setSelectedRegions((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug]
    );
    setSubmittedQuery("");
  };

  const toggleActivity = (slug) => {
    setSelectedActivities((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug]
    );
    setSubmittedQuery("");
  };

  const hasActiveFilters =
    selectedRegions.length > 0 || selectedActivities.length > 0;

  const clearFilters = () => {
    setSelectedRegions([]);
    setSelectedActivities([]);
    setFilterResults(null);
    setSubmittedQuery("");
    setMessage(null);
    setError(null);
    setIsFiltering(false);
  };

  const fetchFilteredFarms = useCallback(async () => {
    if (!hasActiveFilters) {
      setIsFiltering(false);
      setFilterResults(null);
      if (message) {
        setMessage(null);
      }
      setError(null);
      return;
    }

    if (pathname !== "/farms") {
      router.push("/farms");
      return;
    }

    setIsFiltering(true);
    setError(null);

    try {
      const response = await filterFarms({
        regions: selectedRegions,
        activities: selectedActivities,
      });

      const farms = Array.isArray(response?.farms) ? response.farms : [];
      setFilterResults(farms);

      if (farms.length === 0) {
        setMessage("No farms matched your filters.");
      } else if (message) {
        setMessage(null);
      }
    } catch (err) {
      console.error("Error fetching filtered farms:", err);
      setError(err.message || "Something went wrong while filtering farms.");
    } finally {
      setIsFiltering(false);
    }
  }, [
    hasActiveFilters,
    message,
    pathname,
    router,
    selectedActivities,
    selectedRegions,
    setFilterResults,
    setIsFiltering,
  ]);

  useEffect(() => {
    fetchFilteredFarms();
  }, [fetchFilteredFarms]);

  const handleKeyToggle = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const handleFilterTitleClick = (filterType) => {
    setOpenModal(filterType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handleModalToggleRegion = (slug) => {
    toggleRegion(slug);
  };

  const handleModalToggleActivity = (slug) => {
    toggleActivity(slug);
  };

  return (
    <div className="site_filter" ref={ref}>
      <div className="site_filter_inner">
        <form>
          <div className="form_inner">
            {(error || message) && (
              <div
                className="filter_feedback"
                role={error ? "alert" : "status"}
              >
                {error || message}
              </div>
            )}

            <div className="form_filter">
              <div
                className={`filter_title ${
                  selectedRegions.length > 0 ? "filter_title_active" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => handleFilterTitleClick("region")}
                onKeyDown={(event) =>
                  handleKeyToggle(event, () => handleFilterTitleClick("region"))
                }
              >
                <span>Region</span>
                {selectedRegions.length > 0 && (
                  <span className="filter_title_count">
                    {selectedRegions.length}
                  </span>
                )}
              </div>
            </div>

            <div className="form_filter">
              <div
                className={`filter_title ${
                  selectedActivities.length > 0 ? "filter_title_active" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => handleFilterTitleClick("activity")}
                onKeyDown={(event) =>
                  handleKeyToggle(event, () =>
                    handleFilterTitleClick("activity")
                  )
                }
              >
                <span>Activities</span>
                {selectedActivities.length > 0 && (
                  <span className="filter_title_count">
                    {selectedActivities.length}
                  </span>
                )}
              </div>
            </div>
            {hasActiveFilters && (
              <div className="filter_actions">
                <div onClick={clearFilters} className="filter_clear_button">
                  <div className="icon">
                    <IconX />
                  </div>
                  Clear
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Region Filter Modal */}
      {/* <FilterModal
        isOpen={openModal === "region"}
        onClose={handleCloseModal}
        title="Select Regions"
        items={taxonomyData?.region || []}
        selectedItems={selectedRegions}
        onToggleItem={handleModalToggleRegion}
        isLoading={taxonomyLoading}
      /> */}

      {/* Activity Filter Modal */}
      {/* <FilterModal
        isOpen={openModal === "activity"}
        onClose={handleCloseModal}
        title="Select Activities"
        items={taxonomyData?.activity_type || []}
        selectedItems={selectedActivities}
        onToggleItem={handleModalToggleActivity}
        isLoading={taxonomyLoading}
      /> */}
    </div>
  );
});

export default SiteFilter;
