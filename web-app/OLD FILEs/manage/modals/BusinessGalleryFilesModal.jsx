"use client";
import { useEffect, useState } from "react";
import {
  IconX,
  IconPlus,
  IconTrash,
  IconFileUpload,
} from "@tabler/icons-react";
import Dropzone from "@/components/ui/Dropzone";
import { uploadBusinessGallery } from "@/lib/endpoints/account";

const UPLOAD_TYPES = ["Menu", "Brochure", "Flyer", "Price List", "Image"];

export default function BusinessGalleryFilesModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
  session,
}) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!data?.acf?.uploads) {
      setRows([]);
      return;
    }
    const normalized = (data.acf.uploads || []).map((r) => ({
      upload_type: r.upload_type || "Image",
      // For now we allow entering/keeping URL. Real uploads should use media endpoint.
      file_url: r.file?.url || "",
      gallery_row_id: r.gallery_row_id || "",
    }));
    setRows(normalized);
  }, [data]);

  const updateRow = (index, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { upload_type: "Image", file_url: "", gallery_row_id: "" },
    ]);
  };

  const handleDrop = (acceptedFiles) => {
    // Convert dropped files to rows with default upload type
    const newRows = acceptedFiles.map((file) => ({
      upload_type: "Image",
      file_url: "", // Will be handled by file upload
      gallery_row_id: "",
      file: file, // Store the actual file object
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setRows((prev) => [...prev, ...newRows]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Separate files from URL-based rows
    const fileRows = rows.filter((r) => r.file);
    const urlRows = rows.filter((r) => r.upload_type && r.file_url && !r.file);

    // If we have files to upload, send as FormData
    if (fileRows.length > 0) {
      const formData = new FormData();

      // Add file uploads
      fileRows.forEach((row) => {
        formData.append("gallery_files[]", row.file);
      });

      // Send URL-based uploads separately (they will be handled by the API)
      if (urlRows.length > 0) {
        const existing = urlRows.map((r) => ({
          upload_type: r.upload_type,
          file: r.file_url,
          gallery_row_id: r.gallery_row_id,
        }));
        formData.append("uploads_existing_json", JSON.stringify(existing));
      }

      // Send metadata for file uploads as a separate parameter
      if (fileRows.length > 0) {
        const fileMetadata = fileRows.map((r) => ({
          upload_type: r.upload_type,
          gallery_row_id: r.gallery_row_id || "",
        }));
        formData.append("gallery_files_metadata", JSON.stringify(fileMetadata));
      }

      // Use dedicated gallery upload endpoint
      const response = await uploadBusinessGallery(
        session.jwt,
        data.id,
        formData
      );
      console.log("Gallery upload response:", response);

      // Call onSave to refresh the business data
      await onSave({});
    } else if (urlRows.length > 0) {
      // No files selected: send URL rows only
      const payload = urlRows.map((r) => ({
        upload_type: r.upload_type,
        file: r.file_url,
        gallery_row_id: r.gallery_row_id,
      }));
      await onSave({ uploads: payload });
    } else {
      // No valid rows to save
      await onSave({ uploads: [] });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        /* Mobile responsive styles for gallery files modal */
        .gallery-entry {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 1rem;
          display: grid;
          grid-template-columns: 1fr 2fr 1fr auto;
          gap: 0.75rem;
          align-items: end;
          margin-bottom: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .gallery-entry {
            grid-template-columns: 1fr;
            gap: 1rem;
            align-items: stretch;
          }

          .gallery-entry .field-container {
            width: 100%;
          }

          .gallery-entry .actions-container {
            display: flex;
            justify-content: flex-end;
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
          .gallery-entry {
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
            maxWidth: "800px",
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
              <IconFileUpload size={24} /> Edit Uploads
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  Add Files
                </label>
                <Dropzone
                  files={[]}
                  onDrop={handleDrop}
                  maxFiles={20}
                  disabled={loading}
                />
              </div>

              {rows.map((row, index) => (
                <div key={index} className="gallery-entry">
                  <div className="field-container">
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Upload Type
                    </label>
                    <select
                      value={row.upload_type}
                      onChange={(e) =>
                        updateRow(index, "upload_type", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    >
                      {UPLOAD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-container">
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {row.file ? "File" : "File URL"}
                    </label>
                    {row.file ? (
                      // NEWLY DROPPED FILE
                      <div
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {row.type?.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(row.file)}
                            alt={row.name}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: "500", fontSize: "0.875rem" }}
                          >
                            {row.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#666" }}>
                            {Math.round(row.size / 1024)} KB
                          </div>
                        </div>
                      </div>
                    ) : row.file_url &&
                      /\.(jpg|jpeg|png|gif|webp|avif|heic)$/i.test(
                        row.file_url
                      ) ? (
                      // EXISTING IMAGE FILE URL
                      <div
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <img
                          src={row.file_url}
                          alt={`Preview ${index}`}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <div
                          style={{ flex: 1, fontSize: "0.8rem", color: "#555" }}
                        >
                          Image preview
                        </div>
                      </div>
                    ) : (
                      // NON-IMAGE URL (e.g. PDF)
                      <input
                        type="url"
                        placeholder="https://..."
                        value={row.file_url}
                        onChange={(e) =>
                          updateRow(index, "file_url", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="actions-container"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#dc3545",
                        padding: "0.5rem",
                      }}
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addRow}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  border: "2px dashed #ddd",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                <IconPlus size={20} /> Add Upload
              </button>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer",
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
                }}
              >
                {loading ? "Saving..." : "Save Uploads"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
