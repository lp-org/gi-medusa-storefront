import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React from "react"
import { StoreContent } from "types/global"

const Layout: React.FC<{
  children: React.ReactNode
  storeContent: StoreContent
}> = ({ children, storeContent }) => {
  return (
    <div>
      <Nav storeContent={storeContent} />

      <main className="relative">{children}</main>
      <Footer storeContent={storeContent} />
    </div>
  )
}

export default Layout
