"use client";
import { useState, useEffect } from "react";
import {
  IconX,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

const SOCIAL_PLATFORMS = [
  { value: "Facebook", icon: IconBrandFacebook, color: "#1877F2" },
  { value: "Twitter", icon: IconBrandTwitter, color: "#1DA1F2" },
  { value: "Instagram", icon: IconBrandInstagram, color: "#E4405F" },
  { value: "Linkedin", icon: IconBrandLinkedin, color: "#0077B5" },
  { value: "Youtube", icon: IconBrandYoutube, color: "#FF0000" },
];

export default function BusinessSocialModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
}) {
  const [socialProfiles, setSocialProfiles] = useState([]);

  useEffect(() => {
    if (data?.acf?.social && Array.isArray(data.acf.social)) {
      setSocialProfiles(data.acf.social);
    } else {
      setSocialProfiles([]);
    }
  }, [data]);

  const handleProfileChange = (index, field, value) => {
    const updated = [...socialProfiles];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSocialProfiles(updated);
  };

  const addSocialProfile = () => {
    setSocialProfiles([
      ...socialProfiles,
      {
        social_platform: "Facebook",
        url: "",
      },
    ]);
  };

  const removeSocialProfile = (index) => {
    const updated = socialProfiles.filter((_, i) => i !== index);
    setSocialProfiles(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Filter out empty entries
      const filteredProfiles = socialProfiles.filter(
        (profile) => profile.social_platform && profile.url
      );

      await onSave({ social: filteredProfiles });
      onClose();
    } catch (error) {
      console.error("Error saving social profiles:", error);
    }
  };

  const validateUrl = (url) => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        /* Mobile responsive styles for social modal */
        .social-entry {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .social-entry {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .social-entry .field-container {
            min-width: unset;
            width: 100%;
          }

          .social-entry .actions-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
          .social-entry {
            padding: 0.75rem;
          }
        }
      `}</style>
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
              <IconBrandFacebook size={24} />
              Edit Social Media Profiles
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
            <div className="social-list" style={{ marginBottom: "1.5rem" }}>
              {socialProfiles.map((profile, index) => {
                const platform = SOCIAL_PLATFORMS.find(
                  (p) => p.value === profile.social_platform
                );
                const IconComponent = platform?.icon || IconBrandFacebook;
                const isValidUrl = validateUrl(profile.url);

                return (
                  <div key={index} className="social-entry">
                    <div
                      className="field-container"
                      style={{ minWidth: "150px" }}
                    >
                      <select
                        value={profile.social_platform}
                        onChange={(e) =>
                          handleProfileChange(
                            index,
                            "social_platform",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field-container" style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        URL
                      </label>
                      <input
                        type="url"
                        value={profile.url}
                        onChange={(e) =>
                          handleProfileChange(index, "url", e.target.value)
                        }
                        placeholder="https://..."
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: `1px solid ${
                            isValidUrl ? "#ddd" : "#dc3545"
                          }`,
                          borderRadius: "4px",
                        }}
                      />
                      {!isValidUrl && profile.url && (
                        <span style={{ color: "#dc3545", fontSize: "0.75rem" }}>
                          Please enter a valid URL
                        </span>
                      )}
                    </div>

                    <div
                      className="actions-container"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {platform && (
                        <IconComponent
                          size={20}
                          style={{ color: platform.color }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeSocialProfile(index)}
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
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addSocialProfile}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  border: "2px dashed #ddd",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <IconPlus size={20} />
                Add Social Media Profile
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
                {loading ? "Saving..." : "Save Profiles"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
