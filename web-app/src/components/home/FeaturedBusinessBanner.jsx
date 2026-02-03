"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";

import Link from "next/link";

export default function FeaturedBusinessbanner({ businesses }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
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
      effect="fade"
      className="featured_business_banner"
    >
      {businesses.data.map(
        (bus) =>
          bus.meta.business_banner && (
            <SwiperSlide key={bus.id}>
              <div className="featured_business_slide">
                <Link
                  href={`/business/${bus.slug}`}
                  title="Click to view Business"
                  style={{
                    backgroundImage: `url(${bus.meta.business_banner.url})`,
                  }}
                >
                  <Image
                    src="/img/shims/banner_shim.png"
                    alt={bus.meta.business_banner.name}
                    width="1600"
                    height="1000"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ),
      )}
    </Swiper>
  );
}
