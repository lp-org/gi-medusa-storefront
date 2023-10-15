import LoginTemplate from "@modules/account/templates/login-template"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"

import { NextPageWithLayout } from "types/global"

const ResetPassword: NextPageWithLayout = () => {
  return (
    <>
      <Head title="Reset Password" description={`Reset account password.`} />
      <ResetPasswordTemplate />
    </>
  )
}

ResetPassword.getLayout = (page) => {
  return <Layout>{page}</Layout>
}

export default ResetPassword
