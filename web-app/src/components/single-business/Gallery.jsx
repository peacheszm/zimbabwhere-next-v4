"use client";
import Image from "next/image";

import { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  const hasAutoOpened = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const imgParam = searchParams.get("img");

  const images =
    post.acf?.uploads?.filter((file) => file.file.subtype !== "pdf") || [];

  useEffect(() => {
    if (imgParam && images.length > 0 && !hasAutoOpened.current) {
      const index = images.findIndex((file) => file.file.url === imgParam);
      if (index !== -1) {
        setSelectedImageIndex(index);
        hasAutoOpened.current = true;
      }
    }
  }, [imgParam, images]);

  const galleryOpen = (index) => {
    setSelectedImageIndex(index);
  };

  const galleryClose = () => {
    setSelectedImageIndex(null);
    // Clear the img param from URL when closing
    if (imgParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("img");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    }
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
