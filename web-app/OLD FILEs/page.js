"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getBusinessBySlug } from "@/lib/endpoints/business";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";

import Sidebar from "@/components/global/Sidebar";
import BusinessOverview from "@/components/my-account/manage/BusinessOverview";
import BusinessHours from "@/components/my-account/manage/BusinessHours";
import BusinessSocial from "@/components/my-account/manage/BusinessSocial";
import BusinessGalleryFiles from "@/components/my-account/manage/BusinessGalleryFiles";
import BusinessVideos from "@/components/my-account/manage/BusinessVideos";
import BusinessLogo from "@/components/my-account/manage/BusinessLogo";
import BusinessBanner from "@/components/my-account/manage/BusinessBanner";
import BusinessCategories from "@/components/my-account/manage/BusinessCategories";
import BusinessOverviewModal from "@/components/my-account/manage/modals/BusinessOverviewModal";
import BusinessHoursModal from "@/components/my-account/manage/modals/BusinessHoursModal";
import BusinessSocialModal from "@/components/my-account/manage/modals/BusinessSocialModal";
import BusinessVideosModal from "@/components/my-account/manage/modals/BusinessVideosModal";
import BusinessGalleryFilesModal from "@/components/my-account/manage/modals/BusinessGalleryFilesModal";
import BusinessLogoModal from "@/components/my-account/manage/modals/BusinessLogoModal";
import BusinessBannerModal from "@/components/my-account/manage/modals/BusinessBannerModal";

export default function EditSingleBusiness() {
  const params = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isVideosModalOpen, setIsVideosModalOpen] = useState(false);
  const [isUploadsModalOpen, setIsUploadsModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const businessData = await getBusinessBySlug(params.slug);

        if (businessData && businessData.length > 0) {
          const business = businessData[0];
          setPost(business);
        } else {
          setError("Business not found");
        }
      } catch (err) {
        setError(err?.message || "Failed to load business");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadBusiness();
    }
  }, [params.slug]);

  const handleSave = async (formData) => {
    if (!session?.jwt || !post?.id) {
      throw new Error("No session or business ID available");
    }

    setIsSaving(true);
    try {
      const response = await updateCurrentUserBusinesses(
        session.jwt,
        post.id,
        formData
      );

      if (response.success) {
        // Reload the business data to get updated information
        const businessData = await getBusinessBySlug(params.slug);
        if (businessData && businessData.length > 0) {
          setPost(businessData[0]);
        }
      } else {
        throw new Error(response.message || "Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="my_account_page business_list">
      <div className="body_wrapper aside_left">
        <div className="container">
          <main className="main">
            {loading && (
              <div
                className="loading-container"
                style={{ textAlign: "center", padding: "2rem" }}
              >
                <p>Loading business...</p>
              </div>
            )}

            {!loading && error && (
              <div
                className="error-container"
                style={{ textAlign: "center", padding: "2rem", color: "red" }}
              >
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && post && (
              <div className="business_information">
                <BusinessLogo
                  data={post}
                  onEditClick={() => setIsLogoModalOpen(true)}
                />
                <BusinessBanner
                  data={post}
                  onEditClick={() => setIsBannerModalOpen(true)}
                  token={session.jwt}
                />
                <BusinessCategories
                  data={post}
                  onEditClick={handleSave}
                  token={session.jwt}
                />
                <BusinessOverview
                  data={post}
                  onEditClick={() => setIsOverviewModalOpen(true)}
                />
                <BusinessHours
                  data={post}
                  onEditClick={() => setIsHoursModalOpen(true)}
                />
                <BusinessSocial
                  data={post}
                  onEditClick={() => setIsSocialModalOpen(true)}
                />
                <BusinessVideos
                  data={post}
                  onEditClick={() => setIsVideosModalOpen(true)}
                />
                <BusinessGalleryFiles
                  data={post}
                  onEditClick={() => setIsUploadsModalOpen(true)}
                />
              </div>
            )}
          </main>
          <aside className="aside">
            <Sidebar />
          </aside>
        </div>
      </div>

      <BusinessOverviewModal
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
      />

      <BusinessHoursModal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
      />

      <BusinessSocialModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
      />

      <BusinessVideosModal
        isOpen={isVideosModalOpen}
        onClose={() => setIsVideosModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
      />

      <BusinessGalleryFilesModal
        isOpen={isUploadsModalOpen}
        onClose={() => setIsUploadsModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
        session={session}
      />

      <BusinessLogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
        session={session}
      />

      <BusinessBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        data={post}
        onSave={handleSave}
        loading={isSaving}
        session={session}
      />
    </div>
  );
}
