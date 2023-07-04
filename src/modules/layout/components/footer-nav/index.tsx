import clsx from "clsx"
import { useCollections } from "medusa-react"
import Link from "next/link"
import CountrySelect from "../country-select"
import { StoreContent } from "types/global"
import { useAppStore } from "store"
import dayjs from "dayjs"
import { Instagram, Facebook } from "lucide-react"
const FooterNav = () => {
  const { collections } = useCollections()
  const storeContent = useAppStore((state) => state.storeContent)

  return (
    <div className="content-container flex flex-col gap-y-8 pt-16 pb-8">
      <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between">
        <div>
          <Link href="/">
            <a className="text-xl-semi uppercase">{storeContent?.name}</a>
          </Link>
          <div className="flex flex-row gap-4 mt-4">
            {storeContent?.instagram_url && (
              <Link href={storeContent.instagram_url} passHref>
                <a target="_blank">
                  <Instagram className="cursor-pointer text-cyan-600" />
                </a>
              </Link>
            )}

            {storeContent?.facebook_url && (
              <Link href={storeContent.facebook_url} passHref>
                <a target="_blank">
                  <Facebook className="cursor-pointer text-cyan-600" />
                </a>
              </Link>
            )}
          </div>
        </div>
        <div className="text-small-regular grid grid-cols-2 gap-x-16">
          <div className="flex flex-col gap-y-2">
            <span className="text-base-semi">Collections</span>
            <ul
              className={clsx("grid grid-cols-1 gap-y-2", {
                "grid-cols-2": (collections?.length || 0) > 4,
              })}
            >
              {collections?.map((c) => (
                <li key={c.id}>
                  <Link href={`/collections/${c.id}`}>
                    <a>{c.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-base-semi">Support</span>
            <ul className="grid grid-cols-1 gap-y-2">
              {storeContent?.pages.map((el) => (
                <li key={el.id}>
                  <a href={`/${el.handle}`}>{el.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-y-4 justify-center xsmall:items-center xsmall:flex-row xsmall:items-end xsmall:justify-between">
        <span className="text-xsmall-regular text-gray-500">
          © Copyright {dayjs().year()} {storeContent?.name}
        </span>
        <div className="min-w-[316px] flex xsmall:justify-end">
          <CountrySelect />
        </div>
      </div>
    </div>
  )
}

export default FooterNav
