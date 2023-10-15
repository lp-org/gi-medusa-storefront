import Head from "@modules/common/components/head"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import HomepageSwiper from "@modules/layout/components/swiper"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { useAppStore } from "store"
import { NextPageWithLayout } from "types/global"

const Home: NextPageWithLayout = (props) => {
  const storeContent = useAppStore((state) => state.storeContent)
  return (
    <>
      <Head
        title="Home"
        description={`Shop all available models only at the ${storeContent.name}. Worldwide Shipping. Secure Payment.`}
      />

      <Hero storeContent={storeContent} />
      <div className="max-w-6xl mx-auto lg:mt-4">
        <HomepageSwiper />
      </div>

      <FeaturedProducts />
    </>
  )
}

export default Home
