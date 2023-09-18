import clsx from "clsx"
import { useCollections } from "medusa-react"
import Link from "next/link"
import CountrySelect from "../country-select"
import { StoreContent } from "types/global"
import { useAppStore } from "store"
import dayjs from "dayjs"
import { Instagram, Facebook, LocateIcon, Mail, Phone } from "lucide-react"
const FooterNav = () => {
  const { collections } = useCollections()
  const storeContent = useAppStore((state) => state.storeContent)

  return (
    <div className="bg-cyan-900 text-white  flex flex-col gap-y-8 pt-16 pb-8">
      <div className="content-container">
        {" "}
        <div className="flex flex-col gap-6 xsmall:flex-row items-start justify-between">
          <div>
            <Link href="/" className="text-xl-semi">
              Savemax Store by GI Tech Nano Solution Sdn Bhd.
            </Link>
            <span className="text-[8px]"> 201501045034(1170356-X)</span>
            <ul className="flex flex-col gap-4 mt-4 text-xs">
              {storeContent?.address && (
                <li className="flex flex-row items-center">
                  <LocateIcon className="text-cyan-600 min-w-[24px]" />
                  <span className="ml-2">{storeContent?.address}</span>
                </li>
              )}

              {storeContent?.email && (
                <li className="flex flex-row items-center">
                  <Mail className="text-cyan-600 min-w-[20px]" />
                  <span className="ml-2">{storeContent?.email}</span>
                </li>
              )}

              {storeContent?.phone_no && (
                <li className="flex flex-row items-center">
                  <Phone className="text-cyan-600 min-w-[20px]" />
                  <span className="ml-2">{storeContent?.phone_no}</span>
                </li>
              )}
            </ul>
            <div className="flex flex-row gap-4 mt-4">
              {storeContent?.instagram_url && (
                <Link
                  href={storeContent.instagram_url}
                  passHref
                  target="_blank"
                >
                  <Instagram className="cursor-pointer text-cyan-600" />
                </Link>
              )}

              {storeContent?.facebook_url && (
                <Link href={storeContent.facebook_url} passHref target="_blank">
                  <Facebook className="cursor-pointer text-cyan-600" />
                </Link>
              )}
            </div>
          </div>
          <div className="text-small-regular grid grid-cols-2 gap-x-16 xsmall:min-w-[300px] small:min-w-[400px] medium:min-w-[700px]">
            <div className="flex flex-col gap-y-2">
              <span className="text-base-semi">Collections</span>
              <ul
                className={clsx("grid grid-cols-1 gap-y-2", {
                  "grid-cols-2": (collections?.length || 0) > 4,
                })}
              >
                {collections?.map((c) => (
                  <li key={c.id}>
                    <Link href={`/collections/${c.id}`}>{c.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-base-semi">Support</span>
              <ul className="grid grid-cols-1 gap-y-2">
                <li>
                  <a href={`/terms-of-use`}>{"Terms of use"}</a>
                </li>
                {storeContent?.pages.map((el) => (
                  <li key={el.id}>
                    <a href={`/${el.handle}`}>{el.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-y-4 justify-center xsmall:flex-row xsmall:items-end xsmall:justify-between">
          <span className="text-xsmall-regular text-gray-500">
            © Copyright {dayjs().year()} {storeContent?.name}
          </span>
          <div className="min-w-[316px] flex xsmall:justify-end">
            <CountrySelect />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterNav
