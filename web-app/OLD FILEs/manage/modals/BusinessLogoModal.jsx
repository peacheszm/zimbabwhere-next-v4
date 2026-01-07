"use client";
import { useState } from "react";
import Dropzone from "@/components/ui/Dropzone";
import { uploadBusinessLogo } from "@/lib/endpoints/account";

export default function BusinessLogoModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
  session,
}) {
  const [logoFile, setLogoFile] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const currentLogo = data?.logo;
  const logoUrl = currentLogo?.url || currentLogo;

  const validateForm = () => {
    const newErrors = {};

    if (!logoFile || logoFile.length === 0) {
      newErrors.logo = "Please select a logo file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Set uploading state immediately for better user feedback
    setIsUploading(true);

    try {
      // Use dedicated logo upload endpoint
      const response = await uploadBusinessLogo(
        session.jwt,
        data.id,
        logoFile[0]
      );

      console.log("Logo upload response:", response);

      if (response.success) {
        // Call onSave to refresh the business data
        await onSave({});
        onClose();
      } else {
        throw new Error(response.message || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo: " + error.message);
    } finally {
      // Reset uploading state
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setLogoFile([]);
    setErrors({});
    setIsUploading(false);
    onClose();
  };

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
            Update Business Logo
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {logoUrl && (
              <div className="current_logo_preview">
                <h4>Current Logo:</h4>
                <img
                  src={logoUrl}
                  alt="Current business logo"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
              </div>
            )}

            <div className="form_group">
              <h4>Upload New Logo</h4>
              <Dropzone
                files={logoFile}
                onFilesChange={setLogoFile}
                maxFiles={1}
                disabled={loading || isUploading}
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
                }}
              />
              {errors.logo && (
                <div className="error-message">{errors.logo}</div>
              )}
              {logoFile && logoFile.length > 0 && (
                <div className="help" style={{ marginTop: "0.5rem" }}>
                  Selected: {logoFile[0]?.name} (
                  {Math.round(logoFile[0]?.size / 1024)} KB)
                </div>
              )}
            </div>

            <div className="help">
              <strong>Logo Guidelines:</strong>
              <ul>
                <li>Recommended size: 300x300 pixels or larger</li>
                <li>Supported formats: JPEG, PNG, GIF, WebP, SVG</li>
                <li>Maximum file size: 5MB</li>
                <li>Square or rectangular logos work best</li>
              </ul>
            </div>
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
              onClick={handleClose}
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
              disabled={
                loading || isUploading || !logoFile || logoFile.length === 0
              }
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                backgroundColor:
                  loading || isUploading || !logoFile || logoFile.length === 0
                    ? "#ccc"
                    : "#007bff",
                color: "white",
                cursor:
                  loading || isUploading || !logoFile || logoFile.length === 0
                    ? "not-allowed"
                    : "pointer",
                fontSize: "1rem",
              }}
            >
              {loading || isUploading ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
