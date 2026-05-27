"use client";
import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";
import { decodeHtml } from "@/lib/utils/decodeHtml";

export default function EditInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

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
      (t) => t.value == suburbData || t.label == suburbData || t.title == suburbData
    );
    if (found) return found;

    return { value: suburbData, label: decodeHtml(String(suburbData)) };
  };

  const {
    register,
    handleSubmit,
    control,
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
      street_number: businessData?.acf?.street_number || "",
      street_name: businessData?.acf?.street_name || "",
      suburb: getInitialSuburb(),
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
          street_number: data.street_number,
          street_name: data.street_name,
        },
      };

      // Handle suburb passing the label to match AddNewBusiness and backend behavior
      if (data.suburb) {
        updateData.acf.suburb = data.suburb.label || data.suburb.title || data.suburb.value;
      }

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

          <div className="form_row">
            <label htmlFor="street_number">Street Number</label>
            <input
              id="street_number"
              type="text"
              {...register("street_number")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="street_name">Street Name</label>
            <input
              id="street_name"
              type="text"
              {...register("street_name")}
            />
          </div>

          <div className="form_row">
            <label htmlFor="suburb">Suburb & Town</label>
            <Controller
              name="suburb"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={decodedTowns}
                  placeholder="Select suburb..."
                  isClearable
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              )}
            />
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
