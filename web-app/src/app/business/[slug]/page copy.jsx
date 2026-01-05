"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  IconMapPin,
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
  IconEye,
  IconFileText,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { getBusinessBySlug } from "@/lib/endpoints/business";
import BusinessRatings from "@/components/business/BusinessRatings";
import BusinessReviews from "@/components/business/BusinessReviews";
import BusinessReviewModal from "@/components/business/BusinessReviewModal";
import BusinessGalleryModal from "@/components/business/BusinessGalleryModal";
import GoogleMap from "@/components/business/GoogleMap";

export default function SingleBusiness() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [slideNo, setSlideNo] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Load business data
  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setLoading(true);
        const businessData = await getBusinessBySlug(params.slug);

        if (businessData && businessData.length > 0) {
          const business = businessData[0];
          setPost(business);
        } else {
          setError("Business not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadBusiness();
    }
  }, [params.slug]);

  // Memoize coordinates to prevent unnecessary map re-renders
  const mapCenter =
    typeof window !== "undefined"
      ? post?.acf?.latitude &&
        post?.acf?.longitude &&
        post.acf.latitude !== "NULL" &&
        post.acf.longitude !== "NULL"
        ? {
            lat: parseFloat(post.acf.latitude),
            lng: parseFloat(post.acf.longitude),
          }
        : null
      : null;

  const mapLocations =
    typeof window !== "undefined"
      ? mapCenter
        ? [
            {
              id: post.id,
              lat: mapCenter.lat,
              lng: mapCenter.lng,
              title: post.title?.rendered,
              address: `${post.acf?.street_number || ""} ${
                post.acf?.street_name || ""
              }, ${post.acf?.town?.name || ""}`,
            },
          ]
        : []
      : [];

  useEffect(() => {
    if (mapCenter && !currentLocation) {
      setCurrentLocation(mapLocations[0]);
    }
  }, [mapCenter, mapLocations, currentLocation]);

  // Helper functions
  const phoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  const pageurl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const galleryOpen = (index) => {
    setSlideNo(index);
    setShowGallery(true);
  };

  return (
    <div className="single_business">
      <div className="body_wrapper aside_right">
        <div className="container">
          <main className="main">
            {/* (Images) */}

            {/* Reviews */}
            <BusinessReviews
              business_id={post.id}
              business_title={post.title?.rendered}
              onRateClick={() => setShowModal(true)}
            />
          </main>

          {/* Sidebar */}
          <aside className="aside business_aside">
            {/* Business Hours */}

            {/* Location */}
            {mapCenter && (
              <div className="map_section" id="map_section">
                <h4>Location</h4>
                <GoogleMap
                  center={mapCenter}
                  zoom={14}
                  locations={mapLocations}
                  currentLocation={currentLocation}
                  onLocationClick={setCurrentLocation}
                />
              </div>
            )}

            {/* Share Listing */}
            <div className="b_share">
              <h4>Share Listing</h4>
              <div className="share_items">
                <a
                  className="icon_w"
                  href={`https://wa.me/?text=I found this business on Zimbabwhere that you might be interested in. Check it out at: ${pageurl()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandWhatsapp size={20} />
                </a>
                <a
                  className="icon_m"
                  href={`mailto:?subject=${
                    post.title?.rendered
                  }&body=${pageurl()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconMail size={20} />
                </a>
                <a
                  className="icon_f"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${pageurl()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandFacebook size={20} />
                </a>
                <a
                  className="icon_t"
                  href={`https://twitter.com/intent/tweet?text=${
                    post.title?.rendered
                  }&url=${pageurl()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandTwitter size={20} />
                </a>
              </div>
            </div>

            {/* Headings */}
            {post._embedded?.["wp:term"] && (
              <div className="b_categorys">
                {post._embedded["wp:term"][0]?.map((cat, ct) => (
                  <Link
                    key={ct}
                    href={`/search?category_filter=${cat.id}`}
                    dangerouslySetInnerHTML={{ __html: cat.name }}
                  />
                ))}
              </div>
            )}
          </aside>

          {/* Modals */}
          <BusinessReviewModal
            show={showModal}
            onClose={() => setShowModal(false)}
            business_id={post.id}
            business_name={post.title?.rendered}
          />

          <BusinessGalleryModal
            show={showGallery}
            onClose={() => setShowGallery(false)}
            slideId={slideNo}
            gallery={post.acf?.uploads}
          />
        </div>
      </div>
    </div>
  );
}
