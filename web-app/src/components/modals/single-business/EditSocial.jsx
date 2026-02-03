"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { IconTrash, IconPlus } from "@tabler/icons-react";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";

const SOCIAL_PLATFORMS = [
  "Facebook",
  "Twitter",
  "Instagram",
  "Linkedin",
  "Youtube",
];

export default function EditSocial() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditSocial");
  const businessData = getModalProps("EditSocial");

  const initialSocial = businessData?.acf?.social || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    values: {
      social: initialSocial,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const handleClose = () => {
    reset();
    closeModal("EditSocial");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      // Filter out empty entries
      const filteredProfiles = data.social.filter(
        (profile) => profile.social_platform && profile.url,
      );

      const updateData = {
        acf: {
          social: filteredProfiles,
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
      console.error("Failed to update social profiles:", error);
      alert("Failed to update social links. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Social Media Links" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="social_edit_list">
            {fields.map((field, index) => (
              <div key={field.id} className="social_edit_row">
                <div className="form_row">
                  <select {...register(`social.${index}.social_platform`)}>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form_row">
                  <input
                    type="url"
                    placeholder="https://..."
                    {...register(`social.${index}.url`)}
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
            onClick={() => append({ social_platform: "Facebook", url: "" })}
          >
            <div className="icon">
              <IconPlus size={18} />
            </div>{" "}
            Add Social Profile
          </button>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Social Links"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
