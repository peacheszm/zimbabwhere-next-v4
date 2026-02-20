"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";

import Link from "next/link";

export default function FeaturedBusinessbanner({ businesses }) {
  console.log(businesses.data);
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
      {businesses.data.map((bus) => {
        const bgImageUrl =
          bus.meta?.business_banner?.url || bus.meta?.logo?.url;

        if (!bgImageUrl) return null;

        return (
          <SwiperSlide key={bus.id}>
            <div className="featured_business_slide">
              <Link
                href={`/business/${bus.slug}`}
                title="Click to view Business"
                style={{
                  backgroundImage: `url(${bgImageUrl})`,
                }}
              >
                {/* <Image
                    src="/img/shims/banner_shim.png"
                    alt={bus.meta.business_banner?.name || bus.meta.logo?.name || bus.title}
                    width="1600"
                    height="1000"
                  /> */}
              </Link>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
