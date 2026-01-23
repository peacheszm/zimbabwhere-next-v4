"use client";
import Image from "next/image";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Modal from "@/components/global/Modal";

import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";

export default function Gallery({ post }) {
  if (!post.acf.uploads) return;

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const images =
    post.acf?.uploads?.filter((file) => file.file.subtype !== "pdf") || [];

  const galleryOpen = (index) => {
    setSelectedImageIndex(index);
  };

  const galleryClose = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      {Array.isArray(post.acf?.uploads) && post.acf.uploads.length > 0 && (
        <div className="gallery" id="uploads">
          {/* Image Gallery Swiper */}
          {images.length > 0 && (
            <div className="gallery_grid">
              {images.map((file, i) => (
                <div className="gallery_item" key={i}>
                  <Image
                    src={file.file.url}
                    alt={`Gallery image ${i + 1}`}
                    width={200}
                    height={150}
                    onClick={() => galleryOpen(i)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* PDF Links */}
          {post.acf.uploads.filter((file) => file.file.subtype === "pdf")
            .length > 0 && (
            <ul className="pdf_links">
              {post.acf.uploads
                .filter((file) => file.file.subtype === "pdf")
                .map((file, i) => (
                  <li key={i}>
                    <a
                      href={file.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="file"
                    >
                      <span className="icon">
                        <Image
                          src={file.file.icon}
                          alt=""
                          width={20}
                          height={20}
                        />
                      </span>
                      {file.file.filename}
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {selectedImageIndex !== null && (
        <Modal
          onClose={galleryClose}
          title={`Gallery`}
          maxWidth="1200px"
        >
          <div className="gallery_modal_content">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{ clickable: true }}
              initialSlide={selectedImageIndex}
              className="modal_swiper"
              spaceBetween={20}
            >
              {images.map((file, i) => (
                <SwiperSlide key={i}>
                  <div className="modal_image_container">
                    <Image
                      src={file.file.url}
                      alt={`Gallery image ${i + 1}`}
                      width={1200}
                      height={800}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        maxHeight: "80vh",
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-button-prev">
                <IconChevronLeft size={30} />
              </div>
              <div className="swiper-button-next">
                <IconChevronRight size={30} />
              </div>
            </Swiper>
          </div>
        </Modal>
      )}
    </>
  );
}
