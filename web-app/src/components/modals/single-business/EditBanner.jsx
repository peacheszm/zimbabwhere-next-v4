"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import Dropzone from "@/components/ui/Dropzone";
import { uploadBusinessBanner } from "@/lib/endpoints/account";

export default function EditBanner() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditBanner");
  const businessData = getModalProps("EditBanner");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      banner: [],
    },
  });

  const handleClose = () => {
    reset();
    closeModal("EditBanner");
  };

  const onSubmit = async (data) => {
    if (!data.banner || data.banner.length === 0 || !session?.jwt) return;

    try {
      await uploadBusinessBanner(session.jwt, businessData.id, data.banner[0]);
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to upload banner:", error);
      alert("Failed to upload banner. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Business Banner" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label>Business Banner</label>
            <p className="field_desc">
              Recommended: Landscape image (e.g., 1200x400px).
            </p>
            <Controller
              name="banner"
              control={control}
              rules={{ required: "A banner file is required" }}
              render={({ field }) => (
                <Dropzone
                  title="Upload New Banner"
                  maxFiles={1}
                  files={field.value}
                  onFilesChange={(files) => field.onChange(files)}
                />
              )}
            />
            {errors.banner && (
              <span className="error_msg">{errors.banner.message}</span>
            )}
          </div>

          <div className="form_row btn_group">
            <button
              type="submit"
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Save Banner"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
