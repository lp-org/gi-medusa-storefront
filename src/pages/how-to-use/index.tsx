import Layout from "@modules/layout/templates"
import Head from "@modules/common/components/head"
import React, { ReactElement } from "react"

const HowToUse = () => {
  return (
    <>
      <Head title="How to use" description="How to use" />
      <div className="w-full flex justify-center py-24"> HowToUse</div>
    </>
  )
}

HowToUse.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}
export default HowToUse
