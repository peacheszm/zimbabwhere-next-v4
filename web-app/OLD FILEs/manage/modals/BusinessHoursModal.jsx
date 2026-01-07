"use client";
import { useState, useEffect } from "react";
import { IconX, IconClock, IconPlus, IconTrash } from "@tabler/icons-react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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

export default function BusinessHoursModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
}) {
  const [openingTimes, setOpeningTimes] = useState([]);

  useEffect(() => {
    if (data?.acf?.opening_times) {
      setOpeningTimes(data.acf.opening_times);
    } else {
      // Initialize with empty entries for each day
      setOpeningTimes(
        DAYS_OF_WEEK.map((day) => ({
          day,
          opening_time: "",
          closing_time: "",
        }))
      );
    }
  }, [data]);

  const handleTimeChange = (index, field, value) => {
    const updated = [...openingTimes];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setOpeningTimes(updated);
  };

  const addTimeSlot = () => {
    setOpeningTimes([
      ...openingTimes,
      {
        day: "Monday",
        opening_time: "",
        closing_time: "",
      },
    ]);
  };

  const removeTimeSlot = (index) => {
    const updated = openingTimes.filter((_, i) => i !== index);
    setOpeningTimes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Filter out empty entries
      const filteredTimes = openingTimes.filter(
        (time) => time.day && (time.opening_time || time.closing_time)
      );

      await onSave({ opening_times: filteredTimes });
      onClose();
    } catch (error) {
      console.error("Error saving business hours:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .MuiPickersPopper-paper {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid #e5e7eb !important;
        }

        .MuiClock-root {
          background: #ffffff !important;
        }

        .MuiClock-meridiemText {
          color: #3b82f6 !important;
          font-weight: 600 !important;
        }

        .MuiClock-meridiemText.Mui-selected {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }

        /* Mobile responsive styles */
        .hours-entry {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        @media (max-width: 768px) {
          .hours-entry {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .hours-entry .field-container {
            min-width: unset;
            width: 100%;
          }

          .modal-content {
            padding: 1rem !important;
            margin: 1rem !important;
            width: calc(100% - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
          }

          .modal-actions {
            flex-direction: column !important;
          }

          .modal-actions button {
            width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .hours-entry {
            padding: 1rem;
          }
        }
      `}</style>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "700px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <IconClock size={24} />
                Edit Business Hours
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                }}
              >
                <IconX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="hours-list" style={{ marginBottom: "1.5rem" }}>
                {openingTimes.map((time, index) => (
                  <div key={index} className="hours-entry">
                    <div
                      className="field-container"
                      style={{ minWidth: "150px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Day
                      </label>
                      <select
                        value={time.day}
                        onChange={(e) =>
                          handleTimeChange(index, "day", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          backgroundColor: "#ffffff",
                          transition: "all 0.2s ease",
                          outline: "none",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#3b82f6";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(59, 130, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      className="field-container"
                      style={{ minWidth: "120px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Opening Time
                      </label>
                      <TimePicker
                        value={
                          time.opening_time
                            ? dayjs(time.opening_time, "HH:mm")
                            : null
                        }
                        onChange={(newValue) =>
                          handleTimeChange(
                            index,
                            "opening_time",
                            newValue ? newValue.format("HH:mm") : ""
                          )
                        }
                        format="HH:mm"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            variant: "outlined",
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": {
                                  borderColor: "#e5e7eb",
                                  borderWidth: "2px",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#d1d5db",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#3b82f6",
                                  boxShadow:
                                    "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    <div
                      className="field-container"
                      style={{ minWidth: "120px" }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Closing Time
                      </label>
                      <TimePicker
                        value={
                          time.closing_time
                            ? dayjs(time.closing_time, "HH:mm")
                            : null
                        }
                        onChange={(newValue) =>
                          handleTimeChange(
                            index,
                            "closing_time",
                            newValue ? newValue.format("HH:mm") : ""
                          )
                        }
                        format="HH:mm"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            variant: "outlined",
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "& fieldset": {
                                  borderColor: "#e5e7eb",
                                  borderWidth: "2px",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#d1d5db",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#3b82f6",
                                  boxShadow:
                                    "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                        color: "#dc3545",
                      }}
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTimeSlot}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                    border: "2px dashed #3b82f6",
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "center",
                    color: "#3b82f6",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f0f9ff";
                    e.target.style.borderColor = "#1d4ed8";
                    e.target.style.color = "#1d4ed8";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#f8fafc";
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.color = "#3b82f6";
                  }}
                >
                  <IconPlus size={20} />
                  Add Another Time Slot
                </button>
              </div>

              <div
                className="modal-actions"
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: loading ? "#ccc" : "#007bff",
                    color: "white",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "1rem",
                  }}
                >
                  {loading ? "Saving..." : "Save Hours"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}
