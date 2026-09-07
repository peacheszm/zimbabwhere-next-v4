"use client";

import { useCallback, useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

// Static reference so the loader's option object never changes identity.
const LIBRARIES = ["places"];

// Pulls the fields the rest of the app cares about out of a Google Place.
function parsePlace(place) {
  const components = place?.address_components || [];

  const getComponent = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const streetNumber = getComponent("street_number");
  const route = getComponent("route");
  const suburb =
    getComponent("sublocality") ||
    getComponent("neighborhood") ||
    getComponent("locality");
  const town = getComponent("locality") || getComponent("administrative_area_level_2");
  const country = getComponent("country");

  const lat =
    typeof place?.geometry?.location?.lat === "function"
      ? place.geometry.location.lat()
      : null;
  const lng =
    typeof place?.geometry?.location?.lng === "function"
      ? place.geometry.location.lng()
      : null;

  return {
    streetNumber,
    streetName: route,
    suburb,
    town,
    country,
    formattedAddress: place?.formatted_address || "",
    lat,
    lng,
  };
}

export default function AddressAutocomplete({
  id,
  value,
  onTextChange,
  onPlaceSelected,
  countryCode,
  placeholder = "Start typing your business address...",
  className = "",
}) {
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-places-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const handleLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;
    onPlaceSelected?.(parsePlace(place));
  }, [onPlaceSelected]);

  // Fall back to a plain text input if Maps fails to load, so the field
  // never blocks the form.
  if (loadError || !isLoaded) {
    return (
      <input
        id={id}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onTextChange?.(e.target.value)}
      />
    );
  }

  return (
    <Autocomplete
      onLoad={handleLoad}
      onPlaceChanged={handlePlaceChanged}
      options={{
        // No `types` restriction: plain "address" excludes named places like
        // shopping centers/landmarks, which is how many businesses here are
        // actually found (e.g. "Sam Levy's Village").
        componentRestrictions: countryCode ? { country: countryCode } : undefined,
      }}
    >
      <input
        id={id}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onTextChange?.(e.target.value)}
      />
    </Autocomplete>
  );
}
