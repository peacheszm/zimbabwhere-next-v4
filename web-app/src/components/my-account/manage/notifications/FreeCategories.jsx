"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { updateCurrentUserNotifications } from "@/lib/endpoints/account";

export default function FreeCategories({ cats = [], userData = {}, token }) {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize selected categories from userData
  const initialCategories = (userData.data?.users_free_categories || [])
    .map((cat) => {
      // Handle both object structure (term_id) and simple ID
      const catId = typeof cat === "object" ? cat.term_id : cat;
      return cats.find((c) => c.value === catId || c.value === String(catId));
    })
    .filter(Boolean);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      free_categories: initialCategories,
    },
  });

  const selectedCategories = watch("free_categories") || [];

  const onSubmit = async (formData) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const payload = {
        users_free_categories: formData.free_categories.map((cat) => cat.value),
      };

      await updateCurrentUserNotifications(payload, token);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("❌ Notification update failed:", error);
      setSubmitError(
        error.message || "Failed to update categories. Please try again."
      );
    }
  };

  return (
    <div className="free_categories_container">
      <div className="account_selector">
        <div className="section_title">
          <h2>Free Headings</h2>
          <p>
            You have access to free business headings. Select up to 3 headings
            to receive notifications for.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="add_business_form_container"
        >
          <div className="form_wrapper">
            <div className="form_row">
              <label>Select Headings</label>
              <p className="field_desc">
                Choose up to 3 categories you want to be notified about...
              </p>
              <Controller
                name="free_categories"
                control={control}
                rules={{
                  validate: (val) =>
                    val.length <= 3 || "Maximum 3 categories allowed",
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
              {selectedCategories.length === 3 && (
                <p className="info_msg">Maximum 3 categories reached.</p>
              )}
            </div>

            {submitError && (
              <div className="form_row error_box">
                <p>{submitError}</p>
              </div>
            )}

            {submitSuccess && (
              <div className="form_row success_box">
                <p>Headings updated successfully!</p>
              </div>
            )}

            <div className="form_row btn_group">
              <button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Headings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
