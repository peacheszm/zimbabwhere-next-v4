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
            <div className="gallery_grid">
              {uploads.map((item, index) => {
                const fileUrl = item.file?.url || item.file;
                const isImage = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(
                  fileUrl,
                );

                return (
                  <div key={index} className="gallery_item">
                    {isImage ? (
                      <div className="img_preview">
                        <Image
                          src={fileUrl}
                          alt={item.upload_type || "Gallery Image"}
                          width={500}
                          height={500}
                        />
                      </div>
                    ) : (
                      <div className="file_preview">
                        <IconFileDescription size={48} />
                      </div>
                    )}
                    <div className="label">{item.upload_type}</div>
                  </div>
                );
              })}
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
