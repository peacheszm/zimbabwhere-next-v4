"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconUpload, IconX, IconFile } from "@tabler/icons-react";
import styles from "./Dropzone.module.css";

export default function Dropzone({
  title,
  files = [],
  onFilesChange,
  onDrop,
  maxFiles = 10,
  acceptedFileTypes = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
  className = "",
  disabled = false,
}) {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      if (onDrop) {
        // Use custom onDrop handler if provided
        onDrop(acceptedFiles);
      } else if (onFilesChange) {
        // If maxFiles is 1, replace the selection
        if (maxFiles === 1) {
          onFilesChange(acceptedFiles);
        } else {
          // Otherwise append (default behavior for multiple files)
          onFilesChange((prev) => [...(prev || []), ...acceptedFiles]);
        }
      }
    },
    [onDrop, onFilesChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptedFileTypes,
    maxFiles,
    disabled,
  });

  const removeFile = (index) => {
    if (onFilesChange) {
      onFilesChange((prev) => (prev || []).filter((_, i) => i !== index));
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className={styles.filePreview}
          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
        />
      );
    }
    return <IconFile size={32} className={styles.fileIcon} />;
  };

  return (
    <div className={`${styles.dropzoneContainer} ${className}`}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className={styles.dropzoneContent}>
          <IconUpload size={24} className={styles.uploadIcon} />
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.subtitle}>
            ...or click to select a file from your computer
          </div>
          <p className={styles.fileTypes}>
            Accepted: Images, PDF, Word documents (max {maxFiles} files)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <h5 className={styles.fileListTitle}>
            Selected Files ({files.length}):
          </h5>
          <div className={styles.fileGrid}>
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className={styles.fileItem}>
                <div className={styles.filePreviewContainer}>
                  {getFileIcon(file)}
                </div>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName} title={file.name}>
                    {file.name}
                  </span>
                  <span className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className={styles.removeFile}
                  disabled={disabled}
                >
                  <IconX size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
