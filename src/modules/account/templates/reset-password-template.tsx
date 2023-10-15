import { useAccount } from "@lib/context/account-context"
import { useRouter } from "next/router"
import { useEffect } from "react"
import ResetPassword from "../components/reset-password"

const ResetPasswordTemplate = () => {
  const { loginView, customer, retrievingCustomer } = useAccount()
  const [currentView, _] = loginView

  const router = useRouter()

  useEffect(() => {
    if (!retrievingCustomer && customer) {
      router.push("/account")
    }
  }, [customer, retrievingCustomer, router])

  return (
    <div className="w-full flex justify-center py-24">{<ResetPassword />}</div>
  )
}

export default ResetPasswordTemplate
