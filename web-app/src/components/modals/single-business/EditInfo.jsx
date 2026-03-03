"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";

export default function EditInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditInfo");
  const businessData = getModalProps("EditInfo");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    values: {
      title: businessData?.title?.rendered || "",
      business_description: businessData?.acf?.business_description || "",
      business_overview: businessData?.acf?.business_overview || "",
      email: businessData?.acf?.business_email || "",
      phone: businessData?.acf?.phone_number || "",
      website: businessData?.acf?.business_website || "",
    },
  });

  const handleClose = () => {
    reset();
    closeModal("EditInfo");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      const updateData = {
        title: data.title,
        acf: {
          business_description: data.business_description,
          business_overview: data.business_overview,
          business_email: data.email,
          phone_number: data.phone,
          business_website: data.website,
        },
      };

      await updateCurrentUserBusinesses(session.jwt, businessData.id, updateData);
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update business info:", error);
      alert("Failed to update business info. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Business Information" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label htmlFor="title">Business Name</label>
            <input
              id="title"
              type="text"
              {...register("title", { required: "Business name is required" })}
            />
            {errors.title && (
              <span className="error_msg">{errors.title.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_description">Business Description</label>
            <textarea
              id="business_description"
              rows={3}
              {...register("business_description")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="business_overview">Business Overview</label>
            <textarea
              id="business_overview"
              rows={5}
              {...register("business_overview")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="email">Business Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="website">Business Website</label>
            <input
              id="website"
              type="url"
              {...register("website")}
            />
          </div>

          <div className="form_row btn_group">
            <button
              type="submit"
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
