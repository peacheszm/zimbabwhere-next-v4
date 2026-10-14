"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";
import { decodeHtml } from "@/lib/utils/decodeHtml";

const decodeCats = (list) =>
  list.map((cat) => ({
    ...cat,
    label: decodeHtml(cat.label),
  }));

export default function EditCategories() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditCategories");
  const modalProps = getModalProps("EditCategories");
  const businessData = modalProps?.business;
  const [submitError, setSubmitError] = useState(null);

  // Full list: used to show the headings the business already has
  const cats = modalProps?.cats || [];
  // Parent headings are removed from this one, same as the add business form
  const selectableCats = modalProps?.selectableCats || cats;

  const decodedSelectableCats = useMemo(
    () => decodeCats(selectableCats),
    [selectableCats],
  );

  // Map initial categories to react-select values
  const initialCategoryIds = (businessData?.["business_cat"] || []).map((id) =>
    String(id),
  );
  const initialSelected = decodeCats(
    cats.filter((cat) => initialCategoryIds.includes(String(cat.value))),
  );

  // Headings the business already has that can no longer be picked (parent headings)
  const selectableIds = new Set(selectableCats.map((cat) => String(cat.value)));
  const hasLegacyHeadings = initialSelected.some(
    (cat) => !selectableIds.has(String(cat.value)),
  );

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
    setSubmitError(null);
    closeModal("EditCategories");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    setSubmitError(null);
    try {
      // For categories, we often need to send them as an array of IDs
      const categoryIds = data.categories.map((cat) => cat.value);

      const updateData = {
        business_cat: categoryIds,
      };

      await updateCurrentUserBusinesses(
        session.jwt,
        businessData.id,
        updateData,
      );
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update business categories:", error);
      setSubmitError(
        error.message || "Failed to update headings. Please try again.",
      );
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
              Choose up to 3 headings that best represent your business.
            </p>
            <Controller
              name="categories"
              control={control}
              rules={{
                required: "Select at least one heading",
                validate: (val) =>
                  val.length <= 3 || "Maximum 3 headings allowed",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={decodedSelectableCats}
                  isOptionDisabled={() => selectedCategories.length >= 3}
                  placeholder="Search/Select Headings"
                  classNamePrefix="react-select"
                />
              )}
            />
            <p className="info_msg">
              Can't find the heading you're looking for?{" "}
              <Link href="/request-headings">Request one here</Link>.{" "}
              ({selectedCategories.length}/3 selected)
            </p>
            {hasLegacyHeadings && (
              <p className="info_msg">
                Some of your headings are general headings that can no longer be
                chosen. You can keep them, but once removed they can't be added
                back. Pick the more specific heading instead.
              </p>
            )}
            {errors.categories && (
              <span className="error_msg">{errors.categories.message}</span>
            )}
          </div>

          {submitError && (
            <div className="form_row error_box">
              <p>{submitError}</p>
            </div>
          )}

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
