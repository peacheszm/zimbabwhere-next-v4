"use client";
import React from "react";
import { IconBrandYoutube, IconPlayerPlay } from "@tabler/icons-react";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditVideos from "@/components/modals/single-business/EditVideos";

export default function Videos({ data }) {
  const { openModal } = useModal();

  const videos = data?.acf?.youtube_videos || [];

  const handleOpenModal = () => {
    openModal("EditVideos", data);
  };

  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  return (
    <div className="manage_section videos">
      <div className="ms_title">
        <h3>YouTube Videos</h3>
      </div>
      <div className="ms_desc">
        <h4>Visual Storytelling</h4>
        <p>
          Showcase your business with YouTube videos. Please add any videos or
          promos that best showcase what you do. These will be accessible
          through your business page.
        </p>
      </div>

      <div className="ms_body">
        <div className="videos_list">
          {videos.length > 0 ? (
            <div className="videos_grid">
              {videos.map((video, index) => (
                <div key={index} className="video_card">
                  <div className="video_thumbnail">
                    <img
                      src={getYouTubeThumbnail(video.video_url)}
                      alt={video.video_title}
                    />
                    <div className="play_overlay">
                      <IconPlayerPlay size={32} />
                    </div>
                  </div>
                  <div className="video_info">
                    <h5>{video.video_title}</h5>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#b9db96" }}>No videos provided yet.</p>
          )}
        </div>
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Videos</button>
      </div>

      <EditVideos />
    </div>
  );
}
