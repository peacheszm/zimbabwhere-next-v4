"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { updateCurrentUserNotifications } from "@/lib/endpoints/account";

import NoticeMessage from "@/components/global/Notice";

export default function PaidCategories({ cats = [], userData = {}, token }) {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  console.log(userData);

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
    <div className="account_selector">
      <div className="section_title">
        <h2>Select headings for Order #</h2>
        <p>You can select up to ### headings.</p>
      </div>

      <NoticeMessage title="No Paid For Categoriesx" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="add_business_form_container"
      ></form>
    </div>
  );
}
