"use client";
import { useState } from "react";
import Dropzone from "@/components/ui/Dropzone";
import { uploadBusinessBanner } from "@/lib/endpoints/account";

export default function BusinessBannerModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
  session,
}) {
  const [bannerFile, setBannerFile] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const currentBanner = data?.business_banner;
  const bannerUrl = currentBanner?.url || currentBanner;

  const validateForm = () => {
    const newErrors = {};

    if (!bannerFile || bannerFile.length === 0) {
      newErrors.banner = "Please select a banner file";
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
      // Use dedicated banner upload endpoint
      const response = await uploadBusinessBanner(
        session.jwt,
        data.id,
        bannerFile[0]
      );

      console.log("Banner upload response:", response);

      if (response.success) {
        // Call onSave to refresh the business data
        await onSave({});
        onClose();
      } else {
        throw new Error(response.message || "Failed to upload banner");
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner: " + error.message);
    } finally {
      // Reset uploading state
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setBannerFile([]);
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
            Update Business Banner
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
            {bannerUrl && (
              <div className="current_banner_preview">
                <h4>Current Banner:</h4>
                <img
                  src={bannerUrl}
                  alt="Current business banner"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
              </div>
            )}

            <div className="form_group">
              <h4>Upload New Banner</h4>
              <Dropzone
                files={bannerFile}
                onFilesChange={setBannerFile}
                maxFiles={1}
                disabled={loading || isUploading}
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
                }}
              />
              {errors.banner && (
                <div className="error-message">{errors.banner}</div>
              )}
              {bannerFile && bannerFile.length > 0 && (
                <div className="help" style={{ marginTop: "0.5rem" }}>
                  Selected: {bannerFile[0]?.name} (
                  {Math.round(bannerFile[0]?.size / 1024)} KB)
                </div>
              )}
            </div>

            <div className="help">
              <strong>Banner Guidelines:</strong>
              <ul>
                <li>Recommended size: 1200x400 pixels or larger</li>
                <li>Supported formats: JPEG, PNG, GIF, WebP, SVG</li>
                <li>Maximum file size: 5MB</li>
                <li>Wide rectangular format works best for banners</li>
                <li>Consider how it will look on different screen sizes</li>
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
                loading || isUploading || !bannerFile || bannerFile.length === 0
              }
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                backgroundColor:
                  loading ||
                  isUploading ||
                  !bannerFile ||
                  bannerFile.length === 0
                    ? "#ccc"
                    : "#007bff",
                color: "white",
                cursor:
                  loading ||
                  isUploading ||
                  !bannerFile ||
                  bannerFile.length === 0
                    ? "not-allowed"
                    : "pointer",
                fontSize: "1rem",
              }}
            >
              {loading || isUploading ? "Uploading..." : "Upload Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
