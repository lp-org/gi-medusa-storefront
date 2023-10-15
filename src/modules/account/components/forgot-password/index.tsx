import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import { useRouter } from "next/router"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface SignInCredentials extends FieldValues {
  email: string
}

const ForgotPassword = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const [emailSent, setEmailSent] = useState(false)

  const handleError = (_e: Error) => {
    setAuthError("Invalid email or password")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInCredentials>()

  const onSubmit = handleSubmit(async (credentials) => {
    await medusaClient.customers
      .generatePasswordToken({ email: credentials.email })
      .then(() => {
        refetchCustomer()
        setEmailSent(true)
      })
      .catch(handleError)
  })

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <h1 className="text-large-semi uppercase mb-6">Forgot password</h1>

      <form className="w-full" onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            errors={errors}
          />
        </div>
        {emailSent && (
          <div className="bg-green-500 p-4 rounded mt-4 text-white">
            A reset link has been emailed to you.
          </div>
        )}
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              No Record Found
            </span>
          </div>
        )}
        <Button className="mt-6">Enter</Button>
      </form>
      <span className="text-center text-gray-700 text-small-regular mt-6">
        Back to{" "}
        <button
          onClick={() => router.push("/account/login")}
          className="underline"
        >
          Login
        </button>
        .
      </span>
    </div>
  )
}

export default ForgotPassword
