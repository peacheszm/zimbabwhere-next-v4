"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";

export default function EditCategories() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditCategories");
  const modalProps = getModalProps("EditCategories");
  const businessData = modalProps?.business;
  const cats = modalProps?.cats || [];

  // Map initial categories to react-select values
  const initialCategoryIds = (businessData?.["business_cat"] || []).map(id => String(id));
  const initialSelected = cats.filter(cat => initialCategoryIds.includes(String(cat.value)));

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    values: {
      categories: initialSelected,
    },
  });

  const selectedCategories = watch("categories") || [];

  const handleClose = () => {
    reset();
    closeModal("EditCategories");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      // For categories, we often need to send them as an array of IDs
      const categoryIds = data.categories.map(cat => cat.value);
      
      const updateData = {
        "business_cat": categoryIds,
      };

      await updateCurrentUserBusinesses(session.jwt, businessData.id, updateData);
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update business categories:", error);
      alert("Failed to update categories. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Business Categories" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label>Select Headings (Max 3)</label>
            <p className="field_desc">
              Choose up to 3 categories that best represent your business.
            </p>
            <Controller
              name="categories"
              control={control}
              rules={{
                required: "Select at least one category",
                validate: (val) => val.length <= 3 || "Maximum 3 categories allowed",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={cats}
                  isOptionDisabled={() => selectedCategories.length >= 3}
                  placeholder="Search/Select Categories"
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.categories && (
              <span className="error_msg">{errors.categories.message}</span>
            )}
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
