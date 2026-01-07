"use client";
import { useState, useEffect } from "react";
import {
  IconX,
  IconBuilding,
  IconPhone,
  IconMail,
  IconWorld,
  IconMapPin,
} from "@tabler/icons-react";

export default function BusinessOverviewModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    business_motto: "",
    phone_number: "",
    business_whatsapp: "",
    business_email: "",
    business_website: "",
    street_number: "",
    street_name: "",
    business_overview: "",
    business_description: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title?.rendered || "",
        business_motto: data.acf?.business_motto || "",
        phone_number: data.acf?.phone_number || "",
        business_whatsapp: data.acf?.business_whatsapp || "",
        business_email: data.acf?.business_email || "",
        business_website: data.acf?.business_website || "",
        street_number: data.acf?.street_number || "",
        street_name: data.acf?.street_name || "",
        business_overview: data.acf?.business_overview || "",
        business_description: data.acf?.business_description || "",
        country: data.acf?.country || "",
        latitude: data.acf?.latitude || "",
        longitude: data.acf?.longitude || "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Business name is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (!formData.business_email.trim()) {
      newErrors.business_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.business_email)) {
      newErrors.business_email = "Please enter a valid email";
    }

    if (
      formData.business_website &&
      !/^https?:\/\/.+/.test(formData.business_website)
    ) {
      newErrors.business_website =
        "Please enter a valid URL (include http:// or https://)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Send both business_description and description (for post_content) for compatibility
      await onSave({
        ...formData,
        description:
          formData.business_description && formData.business_description.trim()
            ? formData.business_description
            : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error saving business:", error);
    }
  };

  if (!isOpen) return null;

  return (
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
          maxWidth: "600px",
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
            <IconBuilding size={24} />
            Edit Business Information
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
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="title"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Business Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${errors.title ? "#dc3545" : "#ddd"}`,
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
            {errors.title && (
              <span style={{ color: "#dc3545", fontSize: "0.875rem" }}>
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="business_motto"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Business Motto
            </label>
            <input
              type="text"
              id="business_motto"
              name="business_motto"
              value={formData.business_motto}
              onChange={handleInputChange}
              placeholder="Your business tagline or motto"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div
            className="form-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="phone_number"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${
                    errors.phone_number ? "#dc3545" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
              {errors.phone_number && (
                <span style={{ color: "#dc3545", fontSize: "0.875rem" }}>
                  {errors.phone_number}
                </span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="business_whatsapp"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="business_whatsapp"
                name="business_whatsapp"
                value={formData.business_whatsapp}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="business_email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Email Address *
            </label>
            <input
              type="email"
              id="business_email"
              name="business_email"
              value={formData.business_email}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${
                  errors.business_email ? "#dc3545" : "#ddd"
                }`,
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
            {errors.business_email && (
              <span style={{ color: "#dc3545", fontSize: "0.875rem" }}>
                {errors.business_email}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="business_website"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Website
            </label>
            <input
              type="url"
              id="business_website"
              name="business_website"
              value={formData.business_website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${
                  errors.business_website ? "#dc3545" : "#ddd"
                }`,
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
            {errors.business_website && (
              <span style={{ color: "#dc3545", fontSize: "0.875rem" }}>
                {errors.business_website}
              </span>
            )}
          </div>

          <div
            className="form-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="street_number"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Street Number
              </label>
              <input
                type="text"
                id="street_number"
                name="street_number"
                value={formData.street_number}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="street_name"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Street Name
              </label>
              <input
                type="text"
                id="street_name"
                name="street_name"
                value={formData.street_name}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div
            className="form-row"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="country"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="latitude"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Latitude
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="e.g. -17.8252"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="longitude"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Longitude
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="e.g. 31.0335"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="business_overview"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Business Overview
            </label>
            <textarea
              id="business_overview"
              name="business_overview"
              value={formData.business_overview}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of your business"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="business_description"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Business Description
            </label>
            <textarea
              id="business_description"
              name="business_description"
              value={formData.business_description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detailed description of your business services"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
