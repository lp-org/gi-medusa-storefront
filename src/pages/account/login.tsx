import LoginTemplate from "@modules/account/templates/login-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { useAppStore } from "store"
import { NextPageWithLayout } from "types/global"

const Login: NextPageWithLayout = () => {
  const storeContent = useAppStore((state) => state.storeContent)
  return (
    <>
      <Head
        title="Sign in"
        description={`Sign in to your ${storeContent?.name} account.`}
      />
      <LoginTemplate />
    </>
  )
}

Login.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default Login
