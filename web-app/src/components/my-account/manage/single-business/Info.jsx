"use client";
import React from "react";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditInfo from "@/components/modals/single-business/EditInfo";

export default function Info({ data }) {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    openModal("EditInfo", data);
  };

  return (
    <div className="manage_section info">
      <div className="ms_title">
        <h3>Business Information</h3>
      </div>
      <div className="ms_desc">
        <h4>General Details</h4>
        <p>
          Update your business name, description, and contact information. This
          information is public and helps customers find and contact you.
        </p>
      </div>

      <div className="ms_body">
        <div className="info_display">
          <div className="info_item">
            <strong>Name:</strong> <span>{data?.title?.rendered}</span>
          </div>
          <div className="info_item">
            <strong>Email:</strong> <span>{data?.acf?.business_email || "Not set"}</span>
          </div>
          <div className="info_item">
            <strong>Phone:</strong>{" "}
            <span>{data?.acf?.phone_number || "Not set"}</span>
          </div>
          <div className="info_item">
            <strong>Website:</strong>{" "}
            <span>{data?.acf?.business_website || "Not set"}</span>
          </div>
        </div>
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Information</button>
      </div>

      <EditInfo />
    </div>
  );
}
