"use client";

import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useMemo, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  border: "1px solid #ccc",
};

export default function Map({ post }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const center = useMemo(() => {
    const lat = parseFloat(post?.acf?.latitude);
    const lng = parseFloat(post?.acf?.longitude);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

    return { lat, lng };
  }, [post?.acf?.latitude, post?.acf?.longitude]);

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps Load Error:", loadError);
    }
  }, [loadError]);

  if (!center) {
    console.warn("Map not showing: center is null", post?.acf);
    return null;
  }

  return (
    <div
      className="map_section"
      id="map_section"
      style={{ minHeight: "400px" }}
    >
      <h4>Location</h4>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
          }}
        >
          <MarkerF position={center} />
        </GoogleMap>
      ) : (
        <div
          style={{
            ...containerStyle,
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Loading Map...</p>
        </div>
      )}
    </div>
  );
}
