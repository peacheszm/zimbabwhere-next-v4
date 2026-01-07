"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { IconTrash, IconPlus } from "@tabler/icons-react";

import Modal from "@/components/global/Modal";
import { useModal } from "@/contexts/ModalContext";
import { updateCurrentUserBusinesses } from "@/lib/endpoints/account";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Public Holidays",
];

export default function EditHours() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditHours");
  const businessData = getModalProps("EditHours");

  const initialHours = businessData?.acf?.opening_times || DAYS_OF_WEEK.map(day => ({
    day,
    opening_time: "",
    closing_time: "",
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    values: {
      opening_times: initialHours,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "opening_times",
  });

  const handleClose = () => {
    reset();
    closeModal("EditHours");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      // Filter out empty entries
      const filteredTimes = data.opening_times.filter(
        (time) => time.day && (time.opening_time || time.closing_time)
      );

      const updateData = {
        acf: {
          opening_times: filteredTimes,
        },
      };

      await updateCurrentUserBusinesses(session.jwt, businessData.id, updateData);
      router.refresh();
      handleClose();
    } catch (error) {
      console.error("Failed to update business hours:", error);
      alert("Failed to update hours. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Business Hours" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form_wrapper">
          <div className="hours_edit_list">
            {fields.map((field, index) => (
              <div key={field.id} className="hours_edit_row">
                <div className="form_row">
                  <select {...register(`opening_times.${index}.day`)}>
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form_row">
                  <input
                    type="time"
                    {...register(`opening_times.${index}.opening_time`)}
                  />
                </div>
                <div className="form_row">
                  <input
                    type="time"
                    {...register(`opening_times.${index}.closing_time`)}
                  />
                </div>
                <button
                  type="button"
                  className="remove_btn"
                  onClick={() => remove(index)}
                >
                  <IconTrash size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add_btn secondary"
            onClick={() => append({ day: "Monday", opening_time: "", closing_time: "" })}
          >
            <IconPlus size={18} /> Add Hour Slot
          </button>

          <div className="form_row btn_group">
            <button
              type="submit"
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Hours"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
