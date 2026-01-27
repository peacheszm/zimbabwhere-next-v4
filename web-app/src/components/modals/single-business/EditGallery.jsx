"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { IconTrash, IconPlus, IconFile } from "@tabler/icons-react";
import Image from "next/image";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import Dropzone from "@/components/ui/Dropzone";
import {
  uploadBusinessGallery,
  updateCurrentUserBusinesses,
} from "@/lib/endpoints/account";

const UPLOAD_TYPES = ["Menu", "Brochure", "Flyer", "Price List", "Image"];

export default function EditGallery() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditGallery");
  const businessData = getModalProps("EditGallery");

  const normalizedUploads = (businessData?.acf?.uploads || []).map((r) => ({
    upload_type: r.upload_type || "Image",
    file_url: r.file?.url || r.file || "",
    file_name:
      r.file?.filename ||
      r.file?.name ||
      (typeof r.file === "string" ? r.file.split("/").pop() : ""),
    mime_type: r.file?.mime_type || "",
    gallery_row_id: r.gallery_row_id || "",
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm({
    values: {
      uploads: normalizedUploads,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "uploads",
  });

  const handleClose = () => {
    reset();
    closeModal("EditGallery");
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      append({
        upload_type: "Image",
        file: file,
        file_url: URL.createObjectURL(file), // This is for preview
        file_name: file.name,
        mime_type: file.type,
        gallery_row_id: "",
      });
    });
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      const fileRows = data.uploads.filter((r) => r.file);
      const urlRows = data.uploads.filter((r) => !r.file && r.file_url);

      if (fileRows.length > 0) {
        const formData = new FormData();
        fileRows.forEach((row) => {
          formData.append("gallery_files[]", row.file);
        });

        const fileMetadata = fileRows.map((r) => ({
          upload_type: r.upload_type,
          gallery_row_id: r.gallery_row_id || "",
        }));
        formData.append("gallery_files_metadata", JSON.stringify(fileMetadata));

        // Add existing URL-based rows to preserve them
        if (urlRows.length > 0) {
          const existing = urlRows.map((r) => ({
            upload_type: r.upload_type,
            file: r.file_url,
            gallery_row_id: r.gallery_row_id,
          }));
          formData.append("uploads_existing_json", JSON.stringify(existing));
        }

        await uploadBusinessGallery(session.jwt, businessData.id, formData);
      } else {
        // No new files, just update the JSON
        const updateData = {
          acf: {
            uploads: urlRows.map((r) => ({
              upload_type: r.upload_type,
              file: r.file_url,
              gallery_row_id: r.gallery_row_id,
            })),
          },
        };
        await updateCurrentUserBusinesses(
          session.jwt,
          businessData.id,
          updateData,
        );
      }

      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update gallery:", error);
      alert("Failed to update gallery. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Gallery & Files" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label>Upload New Files</label>
            <Dropzone
              onDrop={onDrop}
              multiple={true}
              subtitle="...or click to select any Images, flyers, Menus & Price lists file from your computer."
            />
          </div>

          <div className="gallery_sections">
            {/* Image Grid Section */}
            <div className="gallery_section">
              <label>Images</label>
              <div className="gallery_grid">
                {fields.map((field, index) => {
                  const previewUrl =
                    field.file_url ||
                    (field.file ? URL.createObjectURL(field.file) : "");
                  const mimeType =
                    field.mime_type || (field.file ? field.file.type : "");
                  const isImage =
                    mimeType?.startsWith("image/") ||
                    /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(previewUrl || "");

                  if (!isImage) return null;

                  return (
                    <div key={field.id} className="gallery_grid_item">
                      <div className="preview_box">
                        <img src={previewUrl} alt="Preview" />
                        <button
                          type="button"
                          className="remove_btn_overlay"
                          onClick={() => remove(index)}
                          title="Remove Image"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                      <div className="type_select">
                        <select {...register(`uploads.${index}.upload_type`)}>
                          {UPLOAD_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Files Section */}
            <div className="gallery_section">
              <label>Documents & Other Files</label>
              <div className="file_list">
                {fields.map((field, index) => {
                  const previewUrl =
                    field.file_url ||
                    (field.file ? URL.createObjectURL(field.file) : "");
                  const mimeType =
                    field.mime_type || (field.file ? field.file.type : "");
                  const isImage =
                    mimeType?.startsWith("image/") ||
                    /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(previewUrl || "");

                  if (isImage) return null;

                  return (
                    <div key={field.id} className="file_list_row">
                      <div className="file_info">
                        <IconFile size={20} />
                        <span className="file_name" title={field.file_name}>
                          {field.file_name || "Unknown File"}
                        </span>
                      </div>
                      <div className="form_row">
                        <select {...register(`uploads.${index}.upload_type`)}>
                          {UPLOAD_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        className="remove_btn"
                        onClick={() => remove(index)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
