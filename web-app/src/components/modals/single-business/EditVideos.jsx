"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { IconTrash, IconPlus } from "@tabler/icons-react";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";

export default function EditVideos() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditVideos");
  const businessData = getModalProps("EditVideos");

  const initialVideos = businessData?.acf?.youtube_videos || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    values: {
      youtube_videos: initialVideos,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "youtube_videos",
  });

  const handleClose = () => {
    reset();
    closeModal("EditVideos");
  };

  const extractVideoId = (url) => {
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

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      const filteredVideos = data.youtube_videos
        .filter((video) => video.video_title && video.video_url)
        .map((video) => ({
          ...video,
          video_url: extractVideoId(video.video_url),
        }));

      const updateData = {
        acf: {
          youtube_videos: filteredVideos,
        },
      };

      await updateCurrentUserBusinesses(
        session.jwt,
        businessData.id,
        updateData,
      );
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update videos:", error);
      alert("Failed to update videos. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit YouTube Videos" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="videos_edit_list">
            {fields.map((field, index) => (
              <div key={field.id} className="videos_edit_row">
                <div className="form_row">
                  <label>Video Title</label>
                  <input
                    type="text"
                    placeholder="Enter video title"
                    {...register(`youtube_videos.${index}.video_title`)}
                  />
                </div>
                <div className="form_row">
                  <label>YouTube URL or Video ID</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or ID"
                    {...register(`youtube_videos.${index}.video_url`)}
                  />
                </div>
                <button
                  type="button"
                  className="remove_btn icon"
                  onClick={() => remove(index)}
                >
                  <IconTrash size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add_btn secondary"
            onClick={() => append({ video_title: "", video_url: "" })}
          >
            <div className="icon">
              <IconPlus size={18} />
            </div>{" "}
            Add Video
          </button>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Videos"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
