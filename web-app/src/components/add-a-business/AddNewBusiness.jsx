"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Dropzone from "@/components/ui/Dropzone";
import {
  createUsersBusinesses,
  uploadBusinessLogo,
} from "@/lib/endpoints/account";

export default function AddNewBusiness({ cats = [], towns = [] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      business_name: "",
      business_motto: "",
      phone_number: "",
      business_whatsapp: "",
      business_email: "",
      business_website: "",
      street_number: "",
      street_name: "",
      business_suburb: null,
      business_description: "",
      business_overview: "",
      business_categories: [],
      business_logo: [],
    },
  });

  const selectedCategories = watch("business_categories") || [];
  const selectedLogo = watch("business_logo") || [];

  const categoryOptions = cats.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const suburbOptions = towns.map((town) => ({
    value: town.id,
    label: town.title,
    title: town.title,
  }));

  const onSubmit = async (formData) => {
    setSubmitError(null);
    try {
      const payload = {
        title: formData.business_name,
        description:
          formData.business_description || formData.business_overview,
        business_description: formData.business_description,
        business_cat: formData.business_categories.map((cat) => cat.value),
        business_motto: formData.business_motto,
        phone_number: formData.phone_number,
        business_whatsapp: formData.business_whatsapp,
        business_email: formData.business_email,
        business_website: formData.business_website,
        business_overview: formData.business_overview,
        street_number: formData.street_number,
        street_name: formData.street_name,
        suburb: formData.business_suburb?.title || "",
        area: formData.business_suburb?.title || "",
        town: formData.business_suburb?.title || "",
        province: "",
      };

      const response = await createUsersBusinesses(session?.jwt, payload);

      if (response && response.id && selectedLogo.length > 0) {
        await uploadBusinessLogo(session?.jwt, response.id, selectedLogo[0]);
      }

      // Redirect to my-account or success page
      router.push("/my-account");
    } catch (error) {
      console.error("❌ Submission failed:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="add_business_form_container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          {/* Business Info */}
          <div className="form_row">
            <label htmlFor="business_name">Business Name *</label>
            <input
              id="business_name"
              type="text"
              className={errors.business_name ? "error" : ""}
              {...register("business_name", { required: "Business name is required" })}
            />
            {errors.business_name && <span className="error_msg">{errors.business_name.message}</span>}
          </div>

          <div className="form_row">
            <label htmlFor="business_motto">Business Motto</label>
            <p className="field_desc">This will show up on your business page...</p>
            <input
              id="business_motto"
              type="text"
              {...register("business_motto")}
            />
          </div>

          {/* Logo */}
          <div className="form_row">
            <label>Business Logo *</label>
            <p className="field_desc">This will show up on your business listing and business page</p>
            <Controller
              name="business_logo"
              control={control}
              rules={{ required: "Business logo is required" }}
              render={({ field }) => (
                <Dropzone
                  title="Upload Logo"
                  maxFiles={1}
                  files={field.value}
                  onFilesChange={(files) => field.onChange(files)}
                />
              )}
            />
            {errors.business_logo && <span className="error_msg">{errors.business_logo.message}</span>}
          </div>

          {/* Contact Details */}
          <div className="form_row">
            <label htmlFor="phone_number">Phone Number *</label>
            <p className="field_desc">Main number for notifications & calls...</p>
            <input
              id="phone_number"
              type="tel"
              className={errors.phone_number ? "error" : ""}
              {...register("phone_number", { required: "Phone number is required" })}
            />
            {errors.phone_number && <span className="error_msg">{errors.phone_number.message}</span>}
          </div>

          <div className="form_row">
            <label htmlFor="business_whatsapp">Business WhatsApp</label>
            <p className="field_desc">WhatsApp number (if different)...</p>
            <input
              id="business_whatsapp"
              type="tel"
              {...register("business_whatsapp")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="business_email">Business Email *</label>
            <p className="field_desc">For quote notifications...</p>
            <input
              id="business_email"
              type="email"
              className={errors.business_email ? "error" : ""}
              {...register("business_email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />
            {errors.business_email && <span className="error_msg">{errors.business_email.message}</span>}
          </div>

          <div className="form_row">
            <label htmlFor="business_website">Business Website</label>
            <p className="field_desc">Link to your website...</p>
            <input
              id="business_website"
              type="url"
              {...register("business_website")}
            />
          </div>

          {/* Address */}
          <div className="form_row">
            <label htmlFor="street_number">Street Number *</label>
            <input
              id="street_number"
              type="text"
              className={errors.street_number ? "error" : ""}
              {...register("street_number", { required: "Required" })}
            />
            {errors.street_number && <span className="error_msg">{errors.street_number.message}</span>}
          </div>

          <div className="form_row">
            <label htmlFor="street_name">Street Name *</label>
            <input
              id="street_name"
              type="text"
              className={errors.street_name ? "error" : ""}
              {...register("street_name", { required: "Required" })}
            />
            {errors.street_name && <span className="error_msg">{errors.street_name.message}</span>}
          </div>

          <div className="form_row">
            <label htmlFor="business_suburb">Suburb *</label>
            <p className="field_desc">This will connect your business to map and directions...</p>
            <Controller
              name="business_suburb"
              control={control}
              rules={{ required: "Suburb is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={suburbOptions}
                  placeholder="Select suburb..."
                  isClearable
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.business_suburb && <span className="error_msg">{errors.business_suburb.message}</span>}
          </div>

          {/* Descriptions */}
          <div className="form_row">
            <label htmlFor="business_description">Business Description *</label>
            <p className="field_desc">Short description for your free listing</p>
            <textarea
              id="business_description"
              rows={3}
              className={errors.business_description ? "error" : ""}
              {...register("business_description", { required: "Description is required" })}
            />
            {errors.business_description && <span className="error_msg">{errors.business_description.message}</span>}
          </div>

          <div className="form_row">
            <label htmlFor="business_overview">Business Overview</label>
            <p className="field_desc">Add detailed information, services and products.</p>
            <textarea
              id="business_overview"
              rows={5}
              {...register("business_overview")}
            />
          </div>

          {/* Categories */}
          <div className="form_row">
            <label>Select Headings *</label>
            <p className="field_desc">Select any 3 free headings that best represent your company...</p>
            <Controller
              name="business_categories"
              control={control}
              rules={{
                required: "Select at least one category",
                validate: (val) => val.length <= 3 || "Maximum 3 categories reached",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={categoryOptions}
                  isOptionDisabled={() => selectedCategories.length >= 3}
                  placeholder="Search/Select Categories"
                  classNamePrefix="react-select"
                />
              )}
            />
            {selectedCategories.length === 3 && (
              <p className="info_msg">
                Maximum 3 categories reached. Three headings not enough? Upgrade options available after submission.
              </p>
            )}
            {errors.business_categories && <span className="error_msg">{errors.business_categories.message}</span>}
          </div>

          {submitError && (
            <div className="form_row error_box">
              <p>{submitError}</p>
            </div>
          )}

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Business"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
