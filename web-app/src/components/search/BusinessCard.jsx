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
  IconPhone,
  IconFileText,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";

import BusinessRatings from "@/components/single-business/BusinessRatings";

export default function BusinessCard({ item }) {
  return (
    <div key={`item-${item.id}`} className="business_listing_item premium">
      <div className="col col_left">
        <Link href={`/business/${item.slug}`}>
          <Image
            src={item.logo || "/img/placeholder.png"}
            alt={item.title}
            width={200}
            height={150}
          />
        </Link>
      </div>

      <div className="col col_middle">
        <Image
          src={item.logo || "/img/placeholder.png"}
          alt={item.title}
          width={200}
          height={150}
          className="mobile_image"
        />
        <h3>
          <Link
            href={`/business/${item.slug}`}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </h3>

        {/* Business Ratings */}
        <div style={{ marginTop: "0.5rem" }}>
          <BusinessRatings business_id={item.id} business_title={item.title} />
        </div>

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

      {/* Mobile Footer */}
      <div className="card_footer_mobile">
        {item.hasattachments && (
          <div className="attachment">
            {item.attachments.map((att, index) => (
              <>
                {att.type != "Image" && (
                  <Link href={att.file.link} target="_blank" key={index}>
                    <span>{att.type}</span>
                  </Link>
                )}
              </>
            ))}
          </div>
        )}
        <Link
          href={`/get-a-quote?bid=${item.id}`}
          className="btn get_a_quote_button"
        >
          <div className="icon">
            <IconFileText size={20} />
          </div>
          Get A Quote
        </Link>

        <div className="card_footer_mobile_row">
          <Link
            href={`/business/${item.slug}`}
            className="btn btn-green more-details"
          >
            <Image
              src="/images/read_more_btn.png"
              alt="Read more"
              width={100}
              height={30}
            />
          </Link>
        </div>
      </div>

      {/* Desktop Right Column */}
      <div className="col col_right">
        <div className="bus_links">
          {item.hasattachments && (
            <div className="attachment">
              {item.attachments.map((att, index) => (
                <>
                  {att.type != "Image" && (
                    <Link href={att.file.link} target="_blank" key={index}>
                      <span>{att.type}</span>
                    </Link>
                  )}
                </>
              ))}
            </div>
          )}
        </div>

        <div className="btn_group">
          <Link
            href={`/get-a-quote?bid=${item.id}`}
            className="btn get_a_quote_button"
          >
            <div className="icon">
              <IconFileText size={20} />
            </div>
            Get A Quote
          </Link>

          <Link
            href={`/business/${item.slug}`}
            className="btn btn-green more-details"
          >
            <Image
              src="/images/read_more_btn.png"
              alt="Read more"
              width={100}
              height={30}
            />
          </Link>
        </div>
      </div>

      {/* Premium Gallery */}
      {item.attachments &&
        item.attachments.filter(
          (attachment) =>
            attachment.file.type === "image" &&
            attachment.file.subtype !== "pdf"
        ).length > 0 && (
          <div className="gallery_swiper_container">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation={true}
              pagination={{ clickable: true }}
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
                    attachment.file.subtype !== "pdf"
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
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        )}
    </div>
  );
}
