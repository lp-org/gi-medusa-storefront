import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"
import { motion } from "framer-motion"
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

const Hero = () => {
  return (
    <div className="h-screen w-full relative">
      <motion.div
        {...motionStyle}
        className="mx-4 text-white absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:text-left small:justify-end small:items-start small:p-32"
      >
        {" "}
        <h1 className="text-2xl-semi mb-4 drop-shadow-md shadow-black">
          Summer styles are finally here
        </h1>
        <p
          {...motionStyle}
          className="text-base-regular max-w-[32rem] mb-6 drop-shadow-md shadow-black"
        >
          This year, our new summer collection will shelter you from the harsh
          elements of a world that doesn&apos;t care if you live or die.
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
      <video
        src="/1073636654-preview.mp4"
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
      />
      <div
        className="h-screen absolute top-0  w-screen bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "radial-gradient( closest-side at 50% 50%, rgba(255, 255, 255, 0), #000 130% )",
        }}
      ></div>
    </div>
  )
}

export default Hero
