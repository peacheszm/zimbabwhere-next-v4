"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { IconTrash, IconPlus } from "@tabler/icons-react";
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
        file_url: URL.createObjectURL(file),
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
            <Dropzone onDrop={onDrop} multiple={true} />
          </div>

          <div className="gallery_edit_list">
            {fields.map((field, index) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(
                field.file_url,
              );
              return (
                <div key={field.id} className="gallery_edit_row">
                  <div className="preview_box">
                    {isImage ? (
                      <img src={field.file_url} alt="Preview" />
                    ) : (
                      <div className="no_preview">No Preview</div>
                    )}
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
                    Remove
                  </button>
                </div>
              );
            })}
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
