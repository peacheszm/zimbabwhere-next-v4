/**
 * Utility functions for YouTube integration
 */

/**
 * Extracts the video ID from various YouTube URL formats.
 * @param {string} url - The YouTube URL or video ID.
 * @returns {string} - The extracted video ID or the original string if no match.
 */
export const extractVideoId = (url) => {
  if (!url) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return url;
};

/**
 * Gets the thumbnail URL for a given YouTube URL or ID.
 * @param {string} urlOrId - The YouTube URL or video ID.
 * @param {string} quality - The quality of the thumbnail (default: mqdefault).
 * @returns {string} - The YouTube thumbnail URL.
 */
export const getYouTubeThumbnail = (urlOrId, quality = "mqdefault") => {
  const videoId = extractVideoId(urlOrId);
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Gets the embed URL for a given YouTube URL or ID.
 * @param {string} urlOrId - The YouTube URL or video ID.
 * @returns {string} - The YouTube embed URL.
 */
export const getYouTubeEmbedUrl = (urlOrId) => {
  const videoId = extractVideoId(urlOrId);
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}`;
};
