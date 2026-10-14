"use client";
import React, { useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Modal from "@/components/global/Modal";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";
import { decodeHtml } from "@/lib/utils/decodeHtml";
import { COUNTRIES } from "@/lib/utils/countries";

export default function EditInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();
  const [submitError, setSubmitError] = useState(null);

  // The address the owner picked from the Google suggestions (if any). Only
  // a picked address gives us proper street details and map coordinates.
  const pickedAddressRef = useRef(null);

  const isOpen = isModalOpen("EditInfo");
  const props = getModalProps("EditInfo");

  // Handle both the old format (just data) and new format ({ business, towns })
  const businessData = props?.business || props;
  const towns = props?.towns || [];

  const decodedTowns = useMemo(
    () =>
      towns.map((town) => ({
        ...town,
        label: decodeHtml(town.label || town.title),
      })),
    [towns],
  );

  const getInitialSuburb = () => {
    const suburbData = businessData?.acf?.suburb;
    if (!suburbData) return null;

    // If it's an object with term_id and name
    if (suburbData.term_id && suburbData.name) {
      return { value: suburbData.term_id, label: decodeHtml(suburbData.name) };
    }

    // Try to find it in towns if it's just an ID or string
    const found = decodedTowns.find(
      (t) =>
        t.value == suburbData || t.label == suburbData || t.title == suburbData,
    );
    if (found) return found;

    return { value: suburbData, label: decodeHtml(String(suburbData)) };
  };

  const initialAddress = [
    businessData?.acf?.street_number,
    businessData?.acf?.street_name,
  ]
    .filter(Boolean)
    .join(" ");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    values: {
      title: businessData?.title?.rendered
        ? decodeHtml(businessData.title.rendered)
        : "",
      business_motto: businessData?.acf?.business_motto || "",
      business_description: businessData?.acf?.business_description || "",
      business_overview: businessData?.acf?.business_overview || "",
      email: businessData?.acf?.business_email || "",
      phone: businessData?.acf?.phone_number || "",
      whatsapp: businessData?.acf?.business_whatsapp || "",
      website: businessData?.acf?.business_website || "",
      country:
        COUNTRIES.find((c) => c.value === businessData?.acf?.country) || null,
      business_address: initialAddress,
      street_number: businessData?.acf?.street_number || "",
      street_name: businessData?.acf?.street_name || "",
      latitude: businessData?.acf?.latitude || "",
      longitude: businessData?.acf?.longitude || "",
      suburb: getInitialSuburb(),
    },
  });

  const selectedCountry = watch("country");

  const handleAddressSelected = (parsed) => {
    pickedAddressRef.current = parsed.formattedAddress;
    setValue("street_number", parsed.streetNumber);
    setValue("street_name", parsed.streetName);
    if (parsed.lat) setValue("latitude", parsed.lat);
    if (parsed.lng) setValue("longitude", parsed.lng);

    const matchedCountry = COUNTRIES.find((c) => c.value === parsed.country);
    if (matchedCountry) {
      setValue("country", matchedCountry);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError(null);
    pickedAddressRef.current = null;
    closeModal("EditInfo");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    setSubmitError(null);
    try {
      const acf = {
        business_description: data.business_description,
        business_overview: data.business_overview,
        business_email: data.email,
        phone_number: data.phone,
        business_whatsapp: data.whatsapp,
        business_website: data.website,
        business_motto: data.business_motto,
      };

      if (data.country?.value) acf.country = data.country.value;

      // Address: use the picked suggestion's details when there is one. If the
      // text was changed without picking a suggestion we can only save what
      // was typed, and the map location stays as it was.
      const addressText = data.business_address.trim();
      const pickedAnAddress =
        pickedAddressRef.current && pickedAddressRef.current === addressText;

      if (pickedAnAddress) {
        acf.street_number = data.street_number;
        acf.street_name = data.street_name || addressText;
        if (data.latitude) acf.latitude = String(data.latitude);
        if (data.longitude) acf.longitude = String(data.longitude);
      } else if (addressText !== initialAddress) {
        acf.street_number = "";
        acf.street_name = addressText;
      }

      const updateData = { title: data.title, acf };

      // Handle suburb passing the label to match AddNewBusiness and backend behavior
      if (data.suburb) {
        updateData.acf.suburb =
          data.suburb.label || data.suburb.title || data.suburb.value;
      }

      await updateCurrentUserBusinesses(
        session.jwt,
        businessData.id,
        updateData,
      );
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update business info:", error);
      setSubmitError(
        error.message || "Failed to update business info. Please try again.",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Business Information" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="form_row">
            <label htmlFor="title">Business Name *</label>
            <input
              id="title"
              type="text"
              className={errors.title ? "error" : ""}
              {...register("title", { required: "Business name is required" })}
            />
            {errors.title && (
              <span className="error_msg">{errors.title.message}</span>
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

          <div className="form_row">
            <label htmlFor="phone">Phone Number *</label>
            <p className="field_desc">
              Main number for notifications & calls...
            </p>
            <input
              id="phone"
              type="tel"
              className={errors.phone ? "error" : ""}
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <span className="error_msg">{errors.phone.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="whatsapp">Business WhatsApp</label>
            <p className="field_desc">WhatsApp number (if different)...</p>
            <input id="whatsapp" type="tel" {...register("whatsapp")} />
          </div>

          <div className="form_row">
            <label htmlFor="email">Business Email *</label>
            <p className="field_desc">For quote notifications...</p>
            <input
              id="email"
              type="email"
              className={errors.email ? "error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />
            {errors.email && (
              <span className="error_msg">{errors.email.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="website">Business Website</label>
            <p className="field_desc">Link to your website...</p>
            <input id="website" type="url" {...register("website")} />
          </div>

          <div className="form_row">
            <label htmlFor="country">Country *</label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="country"
                  instanceId="edit_country"
                  options={COUNTRIES}
                  placeholder="Select country..."
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            {errors.country && (
              <span className="error_msg">{errors.country.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_address">Business Address *</label>
            <p className="field_desc">
              Start typing and select your address from the suggestions. This
              updates the map and directions on your business page.
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
            <label htmlFor="suburb">Suburb / & Town *</label>
            <p className="field_desc">
              This will connect your business to map and directions...
            </p>
            <Controller
              name="suburb"
              control={control}
              rules={{ required: "Suburb is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="suburb"
                  instanceId="edit_suburb"
                  options={decodedTowns}
                  placeholder="Select suburb..."
                  isClearable
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
            {errors.suburb && (
              <span className="error_msg">{errors.suburb.message}</span>
            )}
          </div>

          <div className="form_row">
            <label htmlFor="business_description">Business Description *</label>
            <p className="field_desc">Short description for your free listing</p>
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
