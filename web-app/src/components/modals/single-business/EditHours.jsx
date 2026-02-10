"use client";
import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { IconClock } from "@tabler/icons-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

const formatTime = (date) => {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function EditHours() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isModalOpen, getModalProps, closeModal } = useModal();

  const isOpen = isModalOpen("EditHours");
  const businessData = getModalProps("EditHours");

  const initialHours = useMemo(() => {
    const existing = businessData?.acf?.opening_times || [];
    return DAYS_OF_WEEK.map((day) => {
      const found = existing.find((item) => item.day === day);
      return {
        day,
        opening_time: parseTime(found?.opening_time),
        closing_time: parseTime(found?.closing_time),
      };
    });
  }, [businessData]);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    values: {
      opening_times: initialHours,
    },
  });

  const handleClose = () => {
    reset();
    closeModal("EditHours");
  };

  const onSubmit = async (data) => {
    if (!session?.jwt || !businessData?.id) return;

    try {
      // Filter out empty entries and format times back to strings
      const filteredTimes = data.opening_times
        .map((item) => ({
          day: item.day,
          opening_time: formatTime(item.opening_time),
          closing_time: formatTime(item.closing_time),
        }))
        .filter((time) => time.opening_time || time.closing_time);

      const updateData = {
        acf: {
          opening_times: filteredTimes,
        },
      };

      await updateCurrentUserBusinesses(
        session.jwt,
        businessData.id,
        updateData,
      );
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
          <div className="hours_edit_list fixed_rows">
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={day} className="hours_edit_row">
                <div className="day_label">
                  <strong>{day}</strong>
                </div>
                <div className="form_row">
                  <div className="time_input_wrapper">
                    <Controller
                      name={`opening_times.${index}.opening_time`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Opening"
                          dateFormat="HH:mm"
                          placeholderText="Opening"
                        />
                      )}
                    />
                    <IconClock size={16} />
                  </div>
                </div>
                <div className="form_row">
                  <div className="time_input_wrapper">
                    <Controller
                      name={`opening_times.${index}.closing_time`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Closing"
                          dateFormat="HH:mm"
                          placeholderText="Closing"
                        />
                      )}
                    />
                    <IconClock size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form_row btn_group">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Hours"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
