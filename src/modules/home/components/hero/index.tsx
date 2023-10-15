import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"
import { motion } from "framer-motion"
import { StoreContent } from "types/global"
import { isVideoURL } from "@lib/util/is-video"
const motionStyle = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    delay: 0.6,
    duration: 1,
  },
}

const Hero = ({ storeContent }: { storeContent: StoreContent }) => {
  return (
    <div className="h-screen w-full relative">
      <motion.div
        {...motionStyle}
        className="mx-4 text-white absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:text-left small:justify-end small:items-start small:p-32"
      >
        {" "}
        <h1 className="text-2xl-semi mb-4 drop-shadow-md shadow-black">
          {storeContent.wording_1 || `Summer styles are finally here`}
        </h1>
        <p
          {...motionStyle}
          className="text-base-regular max-w-[32rem] mb-6 drop-shadow-md shadow-black"
        >
          {storeContent.wording_2 ||
            `This year, our new summer collection will shelter you from the harsh
          elements of a world that doesn't care if you live or die.`}
        </p>
        <UnderlineLink href="/store">Explore products</UnderlineLink>
      </motion.div>
      {/* <Image
        src="/1073636654-preview.mp4"
        layout="fill"
        loading="eager"
        priority={true}
        quality={90}
        objectFit="cover"
        alt="Photo by @thevoncomplex https://unsplash.com/@thevoncomplex"
        className="absolute inset-0"
        draggable="false"
      /> */}
      {storeContent.banner_1 ? (
        isVideoURL(storeContent.banner_1) ? (
          <video
            src={storeContent.banner_1}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
          />
        ) : (
          <Image
            src={storeContent.banner_1}
            layout="fill"
            loading="eager"
            priority={true}
            quality={90}
            objectFit="cover"
            alt="Banner"
            className="absolute inset-0"
            draggable="false"
          />
        )
      ) : (
        <video
          src={storeContent.banner_1 || "/banner.mp4"}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
        />
      )}

      <div
        className="h-screen absolute top-0  w-full bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "radial-gradient( closest-side at 50% 50%, rgba(255, 255, 255, 0), #000 130% )",
        }}
      ></div>
    </div>
  )
}

export default Hero
