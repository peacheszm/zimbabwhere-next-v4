"use client";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Dropzone from "@/components/ui/Dropzone";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { createUsersBusinesses } from "@/lib/endpoints/account";
import { decodeHtml } from "@/lib/utils/decodeHtml";
import { COUNTRIES } from "@/lib/utils/countries";
import NotificationPrompt from "@/components/ui/NotificationPrompt";

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.value === "Zimbabwe");

export default function AddNewBusiness({ cats = [], towns = [] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);

  const decodedCats = useMemo(
    () =>
      cats.map((cat) => ({
        ...cat,
        label: decodeHtml(cat.label),
      })),
    [cats],
  );

  const decodedTowns = useMemo(
    () =>
      towns.map((town) => ({
        ...town,
        label: decodeHtml(town.label || town.title),
      })),
    [towns],
  );

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
      business_country: DEFAULT_COUNTRY,
      business_address: "",
      street_number: "",
      street_name: "",
      latitude: "",
      longitude: "",
      business_suburb: null,
      business_description: "",
      business_overview: "",
      business_categories: [],
      business_logo: [],
    },
  });

  const selectedCategories = watch("business_categories") || [];
  const selectedLogo = watch("business_logo") || [];
  const selectedCountry = watch("business_country");

  const handleAddressSelected = (parsed) => {
    setValue("street_number", parsed.streetNumber);
    setValue("street_name", parsed.streetName);
    if (parsed.lat) setValue("latitude", parsed.lat);
    if (parsed.lng) setValue("longitude", parsed.lng);

    const matchedCountry = COUNTRIES.find((c) => c.value === parsed.country);
    if (matchedCountry) {
      setValue("business_country", matchedCountry);
    }
  };

  const onSubmit = async (formData) => {
    setSubmitError(null);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.business_name);
      formDataPayload.append(
        "business_description",
        formData.business_description,
      );
      formDataPayload.append("business_motto", formData.business_motto || "");
      formDataPayload.append("phone_number", formData.phone_number || "");
      formDataPayload.append(
        "business_whatsapp",
        formData.business_whatsapp || "",
      );
      formDataPayload.append("business_email", formData.business_email || "");
      formDataPayload.append(
        "business_website",
        formData.business_website || "",
      );
      formDataPayload.append(
        "business_overview",
        formData.business_overview || "",
      );
      formDataPayload.append("business_address", formData.business_address || "");
      formDataPayload.append("street_number", formData.street_number || "");
      formDataPayload.append(
        "street_name",
        formData.street_name || formData.business_address || "",
      );
      formDataPayload.append("suburb", formData.business_suburb?.title || "");
      formDataPayload.append("area", formData.business_suburb?.title || "");
      formDataPayload.append("town", formData.business_suburb?.title || "");
      formDataPayload.append("country", formData.business_country?.value || "");
      formDataPayload.append("province", "");
      formDataPayload.append("latitude", formData.latitude || "");
      formDataPayload.append("longitude", formData.longitude || "");

      // Append categories
      if (formData.business_categories) {
        formData.business_categories.forEach((cat) => {
          formDataPayload.append("business_cat[]", cat.value);
        });
      }

      // Append logo if exists
      if (selectedLogo && selectedLogo.length > 0) {
        formDataPayload.append("logo", selectedLogo[0]);
      }

      const response = await createUsersBusinesses(
        session?.jwt,
        formDataPayload,
      );

      // Redirect to my-account or success page
      router.push("/my-account");
    } catch (error) {
      console.error("❌ Submission failed:", error);
      setSubmitError(
        error.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="add_business_form_container">
      <NotificationPrompt 
        title="Stay Updated!" 
        message="Sign up to get notifications based on your headings and stay alert to new quote requests." 
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          {/* Business Info */}
          <div className="form_row">
            <label htmlFor="business_name">Business Name *</label>
            <input
              id="business_name"
              type="text"
              className={errors.business_name ? "error" : ""}
              {...register("business_name", {
                required: "Business name is required",
              })}
            />
            {errors.business_name && (
              <span className="error_msg">{errors.business_name.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_motto">Business Motto</label>
            <p className="field_desc">
              This will show up on your business page...
            </p>
            <input
              id="business_motto"
              type="text"
              {...register("business_motto")}
            />
          </div>

          {/* Logo */}
          <div className="form_row">
            <label>Business Logo *</label>
            <p className="field_desc">
              This will show up on your business listing and business page
            </p>
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
            {errors.business_logo && (
              <span className="error_msg">{errors.business_logo.message}</span>
            )}
          </div>

          {/* Contact Details */}
          <div className="form_row">
            <label htmlFor="phone_number">Phone Number *</label>
            <p className="field_desc">
              Main number for notifications & calls...
            </p>
            <input
              id="phone_number"
              type="tel"
              className={errors.phone_number ? "error" : ""}
              {...register("phone_number", {
                required: "Phone number is required",
              })}
            />
            {errors.phone_number && (
              <span className="error_msg">{errors.phone_number.message}</span>
            )}
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
            {errors.business_email && (
              <span className="error_msg">{errors.business_email.message}</span>
            )}
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
            <label htmlFor="business_country">Country *</label>
            <Controller
              name="business_country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="business_country"
                  instanceId="business_country"
                  options={COUNTRIES}
                  placeholder="Select country..."
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            {errors.business_country && (
              <span className="error_msg">
                {errors.business_country.message}
              </span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_address">Business Address *</label>
            <p className="field_desc">
              Start typing and select your address from the suggestions.
            </p>
            <Controller
              name="business_address"
              control={control}
              rules={{ required: "Business address is required" }}
              render={({ field }) => (
                <AddressAutocomplete
                  id="business_address"
                  className={errors.business_address ? "error" : ""}
                  value={field.value}
                  onTextChange={field.onChange}
                  onPlaceSelected={(parsed) => {
                    field.onChange(parsed.formattedAddress);
                    handleAddressSelected(parsed);
                  }}
                  countryCode={selectedCountry?.code}
                />
              )}
            />
            {errors.business_address && (
              <span className="error_msg">
                {errors.business_address.message}
              </span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_suburb">Suburb / & Town *</label>
            <p className="field_desc">
              This will connect your business to map and directions...
            </p>
            <Controller
              name="business_suburb"
              control={control}
              rules={{ required: "Suburb is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="business_suburb"
                  options={decodedTowns}
                  placeholder="Select suburb..."
                  isClearable
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            {errors.business_suburb && (
              <span className="error_msg">
                {errors.business_suburb.message}
              </span>
            )}
          </div>

          {/* Descriptions */}
          <div className="form_row">
            <label htmlFor="business_description">Business Description *</label>
            <p className="field_desc">
              Short description for your free listing
            </p>
            <textarea
              id="business_description"
              rows={3}
              className={errors.business_description ? "error" : ""}
              {...register("business_description", {
                required: "Description is required",
              })}
            />
            {errors.business_description && (
              <span className="error_msg">
                {errors.business_description.message}
              </span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_overview">Business Overview</label>
            <p className="field_desc">
              Add detailed information, services and products.
            </p>
            <textarea
              id="business_overview"
              rows={5}
              {...register("business_overview")}
            />
          </div>

          {/* Categories */}
          <div className="form_row">
            <label>Select Headings *</label>
            <p className="field_desc">
              {/* Select any 3 free headings that best represent your company... */}
            </p>
            <Controller
              name="business_categories"
              control={control}
              rules={{
                required: "Select at least one category",
                validate: (val) =>
                  val.length <= 3 || "Maximum 3 headingss reached",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="business_categories"
                  isMulti
                  options={decodedCats}
                  isOptionDisabled={() => selectedCategories.length >= 3}
                  placeholder="Search/Select Headings"
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            <p className="info_msg">
              Can't find the heading you're looking for?{" "}
              <Link href="/request-headings">Request one here</Link>. (3/3 selected)
            </p>
            {selectedCategories.length === 3 && (
              <p className="info_msg">
                Maximum 3 headings reached. Three headings not enough? Upgrade
                options available after submission.
              </p>
            )}
            {errors.business_categories && (
              <span className="error_msg">
                {errors.business_categories.message}
              </span>
            )}
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
