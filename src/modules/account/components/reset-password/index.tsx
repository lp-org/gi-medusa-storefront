import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import Error from "next/error"
import { useRouter } from "next/router"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface SignInCredentials extends FieldValues {
  email: string
  password: string
  confirmNewPassword: string
}

const ResetPassword = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const [done, setDone] = useState(false)

  const handleError = (_e: Error) => {
    setAuthError("Invalid email or password")
  }
  const { query } = useRouter()
  const { token, email } = query as { token: string; email: string }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignInCredentials>({
    defaultValues: { email },
  })

  const onSubmit = handleSubmit(async (credentials) => {
    await medusaClient.customers
      .resetPassword({ email, password: credentials.password, token: token! })
      .then(() => {
        refetchCustomer()
        setDone(true)
        setTimeout(() => {
          router.push("/account")
        }, 3000)
      })
      .catch(handleError)
  })
  if (!token || !email) {
    return <Error statusCode={500} title="Invalid page" />
  } else
    return (
      <div className="max-w-sm w-full flex flex-col items-center">
        {isSubmitting && (
          <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <Spinner size={24} />
          </div>
        )}
        <h1 className="text-large-semi uppercase mb-6">Reset Password</h1>
        <p className="text-center text-base-regular text-gray-700 mb-8">
          Reset your new password.
        </p>
        <form className="w-full" onSubmit={onSubmit}>
          <div className="flex flex-col w-full gap-y-2">
            <Input
              label="Email"
              {...register("email", { required: "Password is required" })}
              type="email"
              errors={errors}
              disabled
              readOnly
            />
            <Input
              label="New Password"
              {...register("password", { required: "Password is required" })}
              type="password"
              autoComplete="current-password"
              errors={errors}
            />
            <Input
              label="Confirm New Password"
              {...register("confirmNewPassword", {
                required: "Password is required",
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "Your passwords do no match"
                  }
                },
              })}
              type="password"
              autoComplete="current-password"
              errors={errors}
            />

            {done && (
              <div className="bg-green-500 p-4 rounded mt-4 text-white">
                Your password has been reset susccessfully, redirecting to login
                page.
              </div>
            )}
          </div>
          {authError && (
            <div>
              <span className="text-rose-500 w-full text-small-regular">
                The link token has expired, please try the forgot password again
              </span>
            </div>
          )}
          <Button className="mt-6">Enter</Button>
        </form>
      </div>
    )
}

export default ResetPassword
