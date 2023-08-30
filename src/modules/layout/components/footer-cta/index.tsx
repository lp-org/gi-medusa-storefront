import UnderlineLink from "@modules/common/components/underline-link"
import Image from "next/image"

const FooterCTA = () => {
  return (
    <div className="bg-cyan-50 mt-8 w-full h-[480px]">
      <div className="grid lg:grid-cols-2 grid-cols-1 h-full">
        <div className="relative w-full sm:h-[220px] lg:h-full">
          <Image
            src="/cta.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>
        <div className="justify-center items-center flex flex-col text-cyan-900 font-bold">
          <h3 className="text-2xl-semi">Shop the latest products</h3>
          <div className="mt-6">
            <UnderlineLink href="/store">Explore products</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterCTA
