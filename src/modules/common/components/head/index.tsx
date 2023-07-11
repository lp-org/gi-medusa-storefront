import NextHead from "next/head"
import React from "react"
import { useAppStore } from "store"

type HeadProps = {
  title?: string
  description?: string | null
  image?: string | null
}

const Head: React.FC<HeadProps> = ({ title, description, image }) => {
  const storeContent = useAppStore((state) => state.storeContent)
  return (
    <NextHead>
      <title>
        {title} | {storeContent?.name}
      </title>
      <meta itemProp="name" content={title} />
      {description && <meta itemProp="description" content={description} />}
      {image && <meta itemProp="image" content={storeContent?.favicon} />}
      <link rel="icon" href={storeContent?.favicon} />
    </NextHead>
  )
}

export default Head
