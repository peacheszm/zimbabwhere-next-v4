"use client";
import React from "react";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditHours from "@/components/modals/single-business/EditHours";

export default function Hours({ data }) {
  const { openModal } = useModal();

  const openingTimes = data?.acf?.opening_times || [];

  const handleOpenModal = () => {
    openModal("EditHours", data);
  };

  return (
    <div className="manage_section hours">
      <div className="ms_title">
        <h3>Business Hours</h3>
      </div>
      <div className="ms_desc">
        <h4>Business Hours</h4>
        <p>
          Let your customers know when you're available. Please add your opening
          hours to best help those that want to get hold of you. This will be
          displayed on your business page. Clear business hours help set
          expectations and improve customer satisfaction.
        </p>
      </div>

      <div className="ms_body">
        <div className="hours_list">
          {openingTimes.length > 0 ? (
            <div className="hours_grid">
              {openingTimes.map((item, index) => (
                <div key={index} className="hours_row">
                  <span className="day">{item.day}</span>
                  <span className="time">
                    {item.opening_time} - {item.closing_time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No opening times provided yet.</p>
          )}
        </div>
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Hours</button>
      </div>

      <EditHours />
    </div>
  );
}
