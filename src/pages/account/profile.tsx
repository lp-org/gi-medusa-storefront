import AccountLayout from "@modules/account/templates/account-layout"
import ProfileTemplate from "@modules/account/templates/profile-template"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import { ReactElement } from "react"
import { useAppStore } from "store"
import { NextPageWithLayout } from "types/global"

const Profile: NextPageWithLayout = () => {
  const storeContent = useAppStore((state) => state.storeContent)
  return (
    <>
      <Head
        title="Profile"
        description={`View and edit your ${storeContent?.name} profile.`}
      />
      <AccountLayout>
        <ProfileTemplate />
      </AccountLayout>
    </>
  )
}

Profile.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  )
}

export default Profile
