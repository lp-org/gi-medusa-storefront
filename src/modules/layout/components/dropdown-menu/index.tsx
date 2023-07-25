import { Popover, Transition } from "@headlessui/react"
import {
  useFeaturedProductsQuery,
  useNavigationCollections,
  useNavigationCategories,
} from "@lib/hooks/use-layout-data"
import repeat from "@lib/util/repeat"
import { ProductCategory } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { Menu, MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu"
import clsx from "clsx"
import { chunk } from "lodash"

import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import "@szhsin/react-menu/dist/index.css"
import { ChevronRight } from "lucide-react"
const DropdownMenu = () => {
  const [open, setOpen] = useState(false)

  const { push } = useRouter()
  const { data: collections, isLoading: loadingCollections } =
    useNavigationCollections()
  const { data: categories, isLoading: loadingCategories } =
    useNavigationCategories()

  const { data: products, isLoading: loadingProducts } =
    useFeaturedProductsQuery()

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="h-full"
    >
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          <>
            <Link href="/shop" passHref className="relative flex h-full">
              <Popover.Button
                className={clsx(
                  "relative h-full flex items-center transition-all ease-out duration-200"
                )}
                onClick={() => push("/store")}
              >
                Store
              </Popover.Button>
            </Link>

            <Transition
              show={open}
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel
                static
                className="absolute top-full inset-x-0 text-sm text-gray-700 z-30 border-y border-gray-200"
              >
                <div className="relative bg-white py-8">
                  <div className="flex items-start content-container">
                    <div className="flex flex-col flex-1 max-w-[30%]">
                      <h3 className="text-base-semi text-gray-900 mb-4">
                        Collections
                      </h3>
                      <div className="flex items-start">
                        {collections &&
                          chunk(collections, 6).map((chunk, index) => {
                            return (
                              <ul
                                key={index}
                                className="min-w-[152px] max-w-[200px] pr-4"
                              >
                                {chunk.map((collection) => {
                                  return (
                                    <div key={collection.id} className="pb-3">
                                      <Link
                                        href={`/collections/${collection.id}`}
                                        onClick={() => setOpen(false)}
                                      >
                                        {collection.title}
                                      </Link>
                                    </div>
                                  )
                                })}
                              </ul>
                            )
                          })}
                        {loadingCollections &&
                          repeat(6).map((index) => (
                            <div
                              key={index}
                              className="w-12 h-4 bg-gray-100 animate-pulse"
                            />
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 max-w-[30%]">
                      <h3 className="text-base-semi text-gray-900 mb-4">
                        Categories
                      </h3>
                      <div className="flex items-start">
                        {categories &&
                          chunk(categories, 6).map((chunk, index) => {
                            return (
                              <ul
                                key={index}
                                className="min-w-[152px] max-w-[200px] pr-4"
                              >
                                {chunk.map((category) => {
                                  return (
                                    <div
                                      key={category.id}
                                      className="pb-3 flex gap-4 items-center"
                                    >
                                      <Link href={`/categories/${category.id}`}>
                                        {category.name}
                                      </Link>
                                      {category.category_children.length >
                                        0 && (
                                        <Menu
                                          menuButton={
                                            <MenuButton>
                                              <ChevronRight className="w-4 h-4" />
                                            </MenuButton>
                                          }
                                        >
                                          {renderChildCategories(
                                            category.category_children
                                          )}
                                        </Menu>
                                      )}
                                    </div>
                                  )
                                })}
                              </ul>
                            )
                          })}
                        {loadingCollections &&
                          repeat(6).map((index) => (
                            <div
                              key={index}
                              className="w-12 h-4 bg-gray-100 animate-pulse"
                            />
                          ))}
                      </div>
                    </div>
                    {/* <div className="flex-1">
                      <div className="grid grid-cols-3 gap-4">
                        {products?.slice(0, 3).map((product) => (
                          <ProductPreview {...product} key={product.id} />
                        ))}
                        {loadingProducts &&
                          repeat(3).map((index) => (
                            <SkeletonProductPreview key={index} />
                          ))}
                      </div>
                    </div> */}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      </div>
    </div>
  )
}

export default DropdownMenu

// Recursive function to render child categories
const renderChildCategories = (categories: ProductCategory[]) => {
  if (!categories || categories.length === 0) {
    return null
  }

  return categories.map((category) => {
    const MyMenu = category.category_children.length > 0 ? MenuItem : SubMenu
    if (category.category_children.length > 0)
      return (
        <SubMenu
          key={category.id}
          label={
            <Link href={`/categories/${category.id}`}>{category.name}</Link>
          }
        >
          {renderChildCategories(category.category_children)}
        </SubMenu>
      )
    else {
      return (
        <MenuItem key={category.id}>
          <Link href={`/categories/${category.id}`}>{category.name}</Link>

          {renderChildCategories(category.category_children)}
        </MenuItem>
      )
    }
  })
}
