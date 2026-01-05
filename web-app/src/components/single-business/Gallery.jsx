"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

import Image from "next/image";
import {
  IconMapPin,
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
  IconEye,
  IconFileText,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
export default function Gallery({ post }) {
  return (
    <>
      {Array.isArray(post.acf?.uploads) && post.acf.uploads.length > 0 && (
        <div className="gallery" id="uploads">
          {/* Image Gallery Swiper */}
          {post.acf.uploads.filter((file) => file.file.subtype !== "pdf")
            .length > 0 && (
            <div className="gallery_swiper_container">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation={true}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
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
