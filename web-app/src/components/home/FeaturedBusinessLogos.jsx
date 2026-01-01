"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";

import Link from "next/link";

export default function FeaturedBusinessLogos({ businesses }) {
  return (
    <div className="featured_business_logo">
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          speed={3000}
          autoplay={{
            delay: 5000, // 5 seconds instead of 5ms
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          slidesPerView="auto"
          watchSlidesProgress={true}
          spaceBetween={27}
          grabCursor={true}
          className="featured_business_caro"
        >
          {businesses.data.map(
            (bus) =>
              bus.meta.logo && (
                <SwiperSlide key={bus.id}>
                  <div className="featured_business_slide">
                    <Link
                      href={`/business/${bus.slug}`}
                      title="Click to view Business"
                    >
                      <Image
                        src={bus.meta.logo.url}
                        alt={bus.slug}
                        width="500"
                        height="500"
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>
    </div>
  );
}
