import ForgotPasswordTemplate from "@modules/account/templates/forgot-password-template"
import LoginTemplate from "@modules/account/templates/login-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { useAppStore } from "store"
import { NextPageWithLayout } from "types/global"

const ForgotPassword: NextPageWithLayout = () => {
  const storeContent = useAppStore((state) => state.storeContent)
  return (
    <>
      <Head title="Forgot Password" description={`Forgot password`} />
      <ForgotPasswordTemplate />
    </>
  )
}

ForgotPassword.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default ForgotPassword
