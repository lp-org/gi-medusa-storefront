import { StoreGetProductsParams } from "@medusajs/medusa"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import InfiniteProducts from "@modules/products/components/infinite-products"
import RefinementList from "@modules/store/components/refinement-list"
import Image from "next/image"
import router from "next/router"
import { useState } from "react"

import { useAppStore } from "store"
import { Autoplay, Pagination } from "swiper"
import "swiper/css/pagination"
import { SwiperSlide, Swiper } from "swiper/react"

const Store = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})
  const storeContent = useAppStore((state) => state.storeContent)
  const sliders =
    storeContent?.slider_product?.filter((el) => el.is_active) || []
  return (
    <>
      <Head title="Store" description="Explore all of our products." />
      <div>
        {sliders?.length > 0 && (
          <Swiper
            style={{
              // @ts-ignore
              "--swiper-pagination-color": "#0f766e",
              "--swiper-navigation-color": "#0f766e",
            }}
            pagination={{
              clickable: true,

              renderBullet: function (index, className) {
                return `<span class="dot swiper-pagination-bullet bg-black-900"></span>`
              },
            }}
            loop={true}
            loopFillGroupWithBlank={true}
            modules={[Pagination, Autoplay]}
            className="lg:h-[440px] h-72 "
            spaceBetween={20}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
          >
            {sliders.map((el, i) => (
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
                  layout="fill"
                  alt="banner"
                  className="object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="flex flex-col small:flex-row small:items-start py-6">
        <RefinementList refinementList={params} setRefinementList={setParams} />
        <InfiniteProducts params={params} />
      </div>
    </>
  )
}

export default Store
