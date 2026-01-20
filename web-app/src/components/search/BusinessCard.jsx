"use client";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  IconMapPin,
  IconChevronRight,
  IconFileText,
  IconChevronLeft,
  IconPhone,
} from "@tabler/icons-react";

import BusinessRatings from "@/components/single-business/BusinessRatings";

export default function BusinessCard({ item, premium = false }) {
  console.log(item);
  return (
    <div
      key={`item-${item.id}`}
      className={`business_listing_item ${premium ? "premium" : ""}`}
    >
      <div className="col col_left">
        <Link href={`/business/${item.slug}`}>
          <Image
            src={item.logo || "/img/placeholder.png"}
            alt={item.title}
            width={200}
            height={200}
          />
        </Link>
      </div>

      <div className="col col_middle">
        <h3>
          <Link
            href={`/business/${item.slug}`}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </h3>

        {/* Business Ratings */}
        <BusinessRatings business_id={item.id} business_title={item.title} />

        {item.business_motto && (
          <div className="motto">{item.business_motto}</div>
        )}

        {item.address && (
          <div className="address">
            <div className="icon">
              <IconMapPin size={16} />
            </div>
            {item.address}
          </div>
        )}

        <div className="description">
          <p
            dangerouslySetInnerHTML={{
              __html: item.business_overview,
            }}
          />
        </div>
      </div>

      {/* Desktop Right Column */}
      <div className="col col_right">
        <div className="btn_group">
          {item?.phone_number && (
            <div className="call">
              <a href={`tel:${item.phone_number}`}>
                <IconPhone />
              </a>
            </div>
          )}

          <div className="get_quote_wrapper">
            <Link
              href={`/get-a-quote?bid=${item.id}`}
              className="btn get_a_quote_button"
            >
              <div className="icon">
                <Image
                  src="/img/logo.png"
                  alt="Zimbabwhere.com"
                  width={100}
                  height={100}
                />
              </div>
              Get A Quote
            </Link>
          </div>

          <Link href={`/business/${item.slug}`} className="btn more-details">
            <Image
              src="/img/read_more_btn.png"
              alt="Read more"
              width={100}
              height={30}
            />
          </Link>
        </div>
      </div>

      {/* Premium Gallery */}
      {premium &&
        item.attachments &&
        item.attachments.filter(
          (attachment) =>
            attachment.file.type === "image" &&
            attachment.file.subtype !== "pdf",
        ).length > 0 && (
          <div className="gallery_swiper_container">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation={{
                nextEl: `.slider-button-next-${item.id}`,
                prevEl: `.slider-button-prev-${item.id}`,
              }}
              pagination={{
                el: `.slider-pagination-${item.id}`,
                clickable: true,
              }}
              spaceBetween={10}
              slidesPerView={3}
              breakpoints={{
                640: { slidesPerView: 4, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="gallery_swiper"
            >
              {item.attachments
                .filter(
                  (attachment) =>
                    attachment.file.type === "image" &&
                    attachment.file.subtype !== "pdf",
                )
                .map((attachment, i) => (
                  <SwiperSlide key={attachment.file.id || i}>
                    <div className="gallery_item">
                      <Image
                        src={attachment.file.url}
                        alt={
                          attachment.file.alt ||
                          `${item.title} gallery image ${i + 1}`
                        }
                        width={200}
                        height={150}
                      />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>

            <div className="slider_nav">
              <div
                className={`slider-button-prev slider-button-prev-${item.id}`}
              >
                <IconChevronLeft />
              </div>

              <div
                className={`slider-pagination slider-pagination-${item.id}`}
              ></div>
              <div
                className={`slider-button-next slider-button-next-${item.id}`}
              >
                <IconChevronRight />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
