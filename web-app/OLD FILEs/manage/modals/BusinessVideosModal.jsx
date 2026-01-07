"use client";
import { useState, useEffect } from "react";
import {
  IconX,
  IconBrandYoutube,
  IconPlus,
  IconTrash,
  IconPlayerPlay,
} from "@tabler/icons-react";

export default function BusinessVideosModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
}) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (data?.acf?.youtube_videos && Array.isArray(data.acf.youtube_videos)) {
      setVideos(data.acf.youtube_videos);
    } else {
      setVideos([]);
    }
  }, [data]);

  const handleVideoChange = (index, field, value) => {
    const updated = [...videos];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setVideos(updated);
  };

  const addVideo = () => {
    setVideos([
      ...videos,
      {
        video_title: "",
        video_url: "",
      },
    ]);
  };

  const removeVideo = (index) => {
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
  };

  const extractVideoId = (url) => {
    if (!url) return "";

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // If it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    return url; // Return as-is if no pattern matches
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Filter out empty entries and extract video IDs
      const filteredVideos = videos
        .filter((video) => video.video_title && video.video_url)
        .map((video) => ({
          ...video,
          video_url: extractVideoId(video.video_url),
        }));

      await onSave({ youtube_videos: filteredVideos });
      onClose();
    } catch (error) {
      console.error("Error saving videos:", error);
    }
  };

  const getVideoThumbnail = (videoUrl) => {
    const videoId = extractVideoId(videoUrl);
    if (videoId && videoId !== videoUrl) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <IconBrandYoutube size={24} style={{ color: "#FF0000" }} />
            Edit YouTube Videos
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            <IconX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="videos-list" style={{ marginBottom: "1.5rem" }}>
            {videos.map((video, index) => {
              const thumbnail = getVideoThumbnail(video.video_url);
              const videoId = extractVideoId(video.video_url);

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  {thumbnail && (
                    <div style={{ minWidth: "120px" }}>
                      <img
                        src={thumbnail}
                        alt="Video thumbnail"
                        style={{
                          width: "120px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                          fontWeight: "bold",
                        }}
                      >
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={video.video_title}
                        onChange={(e) =>
                          handleVideoChange(
                            index,
                            "video_title",
                            e.target.value
                          )
                        }
                        placeholder="Enter video title"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                          fontWeight: "bold",
                        }}
                      >
                        YouTube URL or Video ID
                      </label>
                      <input
                        type="text"
                        value={video.video_url}
                        onChange={(e) =>
                          handleVideoChange(index, "video_url", e.target.value)
                        }
                        placeholder="https://www.youtube.com/watch?v=... or video ID"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      {videoId && videoId !== video.video_url && (
                        <div
                          style={{
                            marginTop: "0.25rem",
                            fontSize: "0.75rem",
                            color: "#666",
                          }}
                        >
                          Video ID: {videoId}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {videoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.5rem",
                          backgroundColor: "#FF0000",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                        }}
                      >
                        <IconPlayerPlay size={16} />
                        Watch
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                        color: "#dc3545",
                      }}
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addVideo}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                border: "2px dashed #ddd",
                borderRadius: "4px",
                backgroundColor: "transparent",
                cursor: "pointer",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <IconPlus size={20} />
              Add YouTube Video
            </button>
          </div>

          <div
            className="modal-actions"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem",
              }}
            >
              {loading ? "Saving..." : "Save Videos"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
