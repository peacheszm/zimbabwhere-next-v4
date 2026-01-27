"use client";
import React from "react";
import Image from "next/image";
import { IconFileDescription } from "@tabler/icons-react";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditGallery from "@/components/modals/single-business/EditGallery";

export default function Gallery({ data }) {
  const { openModal } = useModal();

  const uploads = data?.acf?.uploads || [];

  const handleOpenModal = () => {
    openModal("EditGallery", data);
  };

  return (
    <div className="manage_section gallery">
      <div className="ms_title">
        <h3>Menu, Price List & Gallery</h3>
      </div>
      <div className="ms_desc">
        <h4>Business window shop - FREE UPLOADS</h4>
        <p>
          Images & Photos / Flyers / Brochures / Menus / Price Lists go a long
          way in showing what you do or how you look. Please add as many of
          these and use the other free options provided to best represent your
          business. These will be seen on your business page.
        </p>
      </div>

      <div className="ms_body">
        <div className="gallery_list">
          {uploads.length > 0 ? (
            <div className="gallery_sections">
              {/* Images Section */}
              {uploads.some(item => {
                const fileUrl = item.file?.url || item.file;
                const mimeType = item.file?.mime_type || "";
                return mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(fileUrl || "");
              }) && (
                <div className="gallery_section">
                  <div className="gallery_grid">
                    {uploads.map((item, index) => {
                      const fileUrl = item.file?.url || item.file;
                      const mimeType = item.file?.mime_type || "";
                      const isImage = mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(fileUrl || "");
                      
                      if (!isImage) return null;

                      return (
                        <div key={index} className="gallery_item">
                          <div className="img_preview">
                            <Image
                              src={fileUrl}
                              alt={item.upload_type || "Gallery Image"}
                              width={500}
                              height={500}
                            />
                          </div>
                          <div className="label">{item.upload_type}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Files Section */}
              {uploads.some(item => {
                const fileUrl = item.file?.url || item.file;
                const mimeType = item.file?.mime_type || "";
                return !(mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(fileUrl || ""));
              }) && (
                <div className="gallery_section docs_section">
                  <div className="file_list">
                    {uploads.map((item, index) => {
                      const fileUrl = item.file?.url || item.file;
                      const mimeType = item.file?.mime_type || "";
                      const isImage = mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(fileUrl || "");
                      
                      if (isImage) return null;

                      const fileName = item.file?.filename || item.file?.name || (typeof item.file === 'string' ? item.file.split('/').pop() : "Unknown File");

                      return (
                        <div key={index} className="file_list_row">
                          <div className="file_info">
                            <IconFileDescription size={24} />
                            <div className="file_details">
                              <span className="file_name" title={fileName}>{fileName}</span>
                              <span className="file_type">{item.upload_type}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>No gallery files added yet</p>
          )}
        </div>
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Gallery & Files</button>
      </div>

      <EditGallery />
    </div>
  );
}
