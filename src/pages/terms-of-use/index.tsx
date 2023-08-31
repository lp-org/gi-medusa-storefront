import { Tab } from "@headlessui/react"
import api from "@lib/data/api"
import HandlePage from "@pages/[handle]"
import { reject } from "lodash"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import React, { useState } from "react"
import { PagesType } from "types/global"

const TermOfUse = ({
  page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="content-container overflow-auto my-4 flex lg:flex-row flex-col relative">
      <Tab.Group>
        <Tab.List className="flex sm:flex-col lg:flex-col space-y-2 lg:w-56 sm:w-full lg:fixed sm:block h-full">
          {page
            ?.sort((a, b) => a.rank - b.rank)
            .map((el) => (
              <Tab
                className={({ selected }) =>
                  `w-full px-4 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none ${
                    selected
                      ? "bg-cyan-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`
                }
                key={el.id}
              >
                <div dangerouslySetInnerHTML={{ __html: el.title }} />
              </Tab>
            ))}
        </Tab.List>

        <Tab.Panels className="lg:ml-60 mt-10 lg:mt-0">
          {page?.map((el) => (
            <Tab.Panel key={el.id}>
              <div dangerouslySetInnerHTML={{ __html: el.body }} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

const pagesClient = (handle: string): Promise<PagesType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api.pages.get(handle as string, true)

      resolve(res.data)
    } catch (error) {
      reject(error)
    }
  })
}

export const getServerSideProps: GetServerSideProps<{
  page: PagesType[] | null
}> = async ({ query }) => {
  try {
    const keys = [
      "custom_terms",
      "custom_privacy_policy",
      "custom_refund_policy",
      "custom_delivery_policy",
    ]

    const results = await Promise.allSettled(
      keys.map((key) => {
        return pagesClient(key)
      })
    )

    const page = results
      .filter((el) => el.status === "fulfilled")
      //@ts-ignore
      .map((el) => el.value)
      .sort()

    return { props: { page } }
  } catch (error) {
    return { props: { page: null } }
  }
}

export default TermOfUse
