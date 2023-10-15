import { isVideoURL } from "@lib/util/is-video"
import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"
import { useAppStore } from "store"

const FooterCTA = () => {
  const storeContent = useAppStore((state) => state.storeContent)
  return (
    <div className="bg-cyan-50 mt-8 w-full h-[480px]">
      <div className="grid lg:grid-cols-2 grid-cols-1 h-full">
        <div className="relative w-full sm:h-[220px] lg:h-full">
          {storeContent?.banner_2 && isVideoURL(storeContent?.banner_2) ? (
            <video
              src={storeContent?.banner_2 || "/cta.jpg"}
              autoPlay
              loop
              className="object-cover h-full"
            />
          ) : (
            <Image
              src={storeContent?.banner_2 || "/cta.jpg"}
              alt=""
              layout="fill"
              objectFit="cover"
              className=""
            />
          )}
        </div>
        <div className="justify-center items-center flex flex-col text-cyan-900 font-bold">
          <h3 className="text-2xl-semi text-center">
            {storeContent?.wording_3 || `Shop the latest products`}
          </h3>
          <div className="mt-6">
            <UnderlineLink href="/store">Explore products</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterCTA
