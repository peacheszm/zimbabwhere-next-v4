import { useJsApiLoader } from "@react-google-maps/api";

// The Maps script loader is a singleton that throws if it is ever called with
// options different from the first call ("Loader must not be called again with
// different options"). So every component that needs Google Maps has to load it
// through this hook, with these exact options. Don't pass your own id or
// libraries from a component; add the library here instead.
const LOADER_OPTIONS = {
  id: "google-maps-script",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  libraries: ["places"],
};

export default function useGoogleMapsLoader() {
  return useJsApiLoader(LOADER_OPTIONS);
}
