import api from "@lib/data/api"
import Head from "@modules/common/components/head"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Error from "next/error"
import { useRouter } from "next/router"
import React from "react"
import { PagesType } from "types/global"

const HandlePage = ({
  page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!page) return <Error statusCode={404} title="No page found" />
  return (
    <>
      <Head title={page.title} description={page.description} />
      <div className="content-container overflow-auto my-4">
        <div dangerouslySetInnerHTML={{ __html: page.body }}></div>
      </div>
    </>
  )
}
export const getServerSideProps: GetServerSideProps<{
  page: PagesType | null
}> = async ({ query }) => {
  try {
    const res = await api.pages.get(query.handle as string)
    return { props: { page: res.data } }
  } catch (error) {
    return { props: { page: null } }
  }
}

export default HandlePage
