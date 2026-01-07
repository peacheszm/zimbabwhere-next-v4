"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import Dropzone from "@/components/ui/Dropzone";
import { uploadBusinessLogo } from "@/lib/endpoints/account";

export default function EditLogo() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();
  
  const isOpen = isModalOpen("EditLogo");
  const businessData = getModalProps("EditLogo");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      logo: [],
    },
  });

  const handleClose = () => {
    reset();
    closeModal("EditLogo");
  };

  const onSubmit = async (data) => {
    if (!data.logo || data.logo.length === 0 || !session?.jwt) return;

    try {
      await uploadBusinessLogo(session.jwt, businessData.id, data.logo[0]);
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to upload logo:", error);
      alert("Failed to upload logo. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Business Logo" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label>Business Logo</label>
            <p className="field_desc">
              Recommended: Square image (at least 200x200px).
            </p>
            <Controller
              name="logo"
              control={control}
              rules={{ required: "A logo file is required" }}
              render={({ field }) => (
                <Dropzone
                  title="Upload New Logo"
                  maxFiles={1}
                  files={field.value}
                  onFilesChange={(files) => field.onChange(files)}
                />
              )}
            />
            {errors.logo && (
              <span className="error_msg">{errors.logo.message}</span>
            )}
          </div>

          <div className="form_row btn_group">
            <button
              type="submit"
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Save Logo"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
