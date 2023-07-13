import React from "react"
import { Pagination, Autoplay } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css/pagination"
import Image from "next/image"
import useCurrentWidth from "@lib/hooks/use-current-width"
import { useAppStore } from "store"
import { useRouter } from "next/router"
const HomepageSwiper = () => {
  const windowWidth = useCurrentWidth()
  const storeContent = useAppStore((state) => state.storeContent)
  const router = useRouter()
  const sliders = storeContent?.slider
  return (
    <div>
      <Swiper
        style={{
          // @ts-ignore
          "--swiper-pagination-color": "#a5f3fc",
          "--swiper-navigation-color": "#a5f3fc",
        }}
        pagination={{
          dynamicBullets: true,
        }}
        slidesPerView={windowWidth < 768 ? 1 : 2}
        loop={true}
        loopFillGroupWithBlank={true}
        modules={[Pagination, Autoplay]}
        className="lg:h-44 h-32 "
        spaceBetween={20}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          reverseDirection: !(windowWidth < 768),
        }}
      >
        {sliders
          .filter((el) => el.is_active)
          .map((el, i) => (
            <SwiperSlide
              key={i}
              onClick={() => {
                if (el.url) {
                  if (!el.open_new) router.push(el.url)
                  else window.open(el.url, "_blank")
                }
              }}
              className="hover:cursor-pointer"
            >
              <Image
                src={el.image}
                className="lg:rounded-lg"
                layout="fill"
                alt="banner"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  )
}

export default HomepageSwiper
