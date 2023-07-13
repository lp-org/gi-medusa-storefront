import { useFeaturedProductsQuery } from "@lib/hooks/use-layout-data"
import UnderlineLink from "@modules/common/components/underline-link"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { Navigation, FreeMode } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

import useCurrentWidth from "@lib/hooks/use-current-width"
import ArrowRight from "@modules/common/icons/arrow-right"
import { ChevronLeft, ChevronRight } from "lucide-react"

const FeaturedProducts = () => {
  const { data } = useFeaturedProductsQuery()
  const windowWidth = useCurrentWidth()
  return (
    <div className="py-12">
      <div className="content-container py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-base-regular text-gray-600 mb-6">
            Latest products
          </span>
          <p className="text-2xl-regular text-gray-900 max-w-lg mb-4">
            Our newest styles are here to help you look your best.
          </p>
          <UnderlineLink href="/store">Explore products</UnderlineLink>
        </div>

        <Swiper
          navigation={{
            nextEl: ".image-swiper-button-next",
            prevEl: ".image-swiper-button-prev",
            disabledClass: "swiper-button-disabled",
          }}
          slidesPerView={windowWidth < 768 ? 2 : 3}
          modules={[Navigation, FreeMode]}
          spaceBetween={20}
          freeMode={true}
          className="mySwiper"
        >
          <div className=" image-swiper-button-next">
            <ChevronRight className="text-cyan-500" />
          </div>
          <div className=" image-swiper-button-prev">
            <ChevronLeft className="text-cyan-500" />
          </div>
          {data
            ? data.map((product, i) => (
                <SwiperSlide key={i} className="hover:cursor-pointer">
                  <ProductPreview {...product} />
                </SwiperSlide>
              ))
            : Array.from(Array(4).keys()).map((i) => (
                <li key={i}>
                  <SkeletonProductPreview />
                </li>
              ))}
        </Swiper>
      </div>
    </div>
  )
}

export default FeaturedProducts
