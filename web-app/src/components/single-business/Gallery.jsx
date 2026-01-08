"use client";
import Image from "next/image";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";

export default function Gallery({ post }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  return (
    <>
      {Array.isArray(post.acf?.uploads) && post.acf.uploads.length > 0 && (
        <div className="gallery" id="uploads">
          {/* Image Gallery Swiper */}
          {post.acf.uploads.filter((file) => file.file.subtype !== "pdf")
            .length > 0 && (
            <div className="gallery_slider">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                pagination={{
                  el: paginationRef.current,
                  clickable: true,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.params.pagination.el = paginationRef.current;
                }}
                spaceBetween={10}
                slidesPerView={3}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                }}
                className="gallery_swiper"
              >
                {post.acf.uploads
                  .filter((file) => file.file.subtype !== "pdf")
                  .map((file, i) => (
                    <SwiperSlide key={i}>
                      <div className="gallery_item">
                        <Image
                          src={file.file.url}
                          alt={`Gallery image ${i + 1}`}
                          width={200}
                          height={150}
                          onClick={() => galleryOpen(i)}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>

              {/* Custom Navigation & Pagination - Outside Swiper */}
              <div className="pagination_wrapper">
                <button
                  ref={prevRef}
                  className="prev"
                  aria-label="Previous slide"
                >
                  <IconChevronLeft />
                </button>
                <div ref={paginationRef} className="navigation"></div>
                <button ref={nextRef} className="next" aria-label="Next slide">
                  <IconChevronRight />
                </button>
              </div>
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
    </>
  );
}
