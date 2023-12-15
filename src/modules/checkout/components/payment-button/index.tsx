import { MEDUSA_BACKEND_URL } from "@lib/config"
import { useCheckout } from "@lib/context/checkout-context"
import api from "@lib/data/api"
import { PaymentSession } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useCart } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { useAppStore } from "store"

type PaymentButtonProps = {
  paymentSession?: PaymentSession | null
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  const [notReady, setNotReady] = useState(true)
  const { cart } = useCart()

  useEffect(() => {
    setNotReady(true)

    if (!cart) {
      return
    }

    if (!cart.shipping_address) {
      return
    }

    if (!cart.billing_address) {
      return
    }

    if (!cart.email) {
      return
    }

    if (cart.shipping_methods.length < 1) {
      return
    }

    setNotReady(false)
  }, [cart])

  switch (paymentSession?.provider_id) {
    case "stripe":
      return (
        <StripePaymentButton session={paymentSession} notReady={notReady} />
      )
    case "manual":
      return <ManualTestPaymentButton notReady={notReady} />
    case "paypal":
      return (
        <PayPalPaymentButton notReady={notReady} session={paymentSession} />
      )
    case "ipay88":
      return (
        <IPay88PaymentButton notReady={notReady} session={paymentSession} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  session,
  notReady,
}: {
  session: PaymentSession
  notReady: boolean
}) => {
  const [disabled, setDisabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const { cart } = useCart()
  const { onPaymentCompleted } = useCheckout()

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("cardNumber")

  useEffect(() => {
    if (!stripe || !elements) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [stripe, elements])

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address.first_name +
              " " +
              cart.billing_address.last_name,
            address: {
              city: cart.billing_address.city ?? undefined,
              country: cart.billing_address.country_code ?? undefined,
              line1: cart.billing_address.address_1 ?? undefined,
              line2: cart.billing_address.address_2 ?? undefined,
              postal_code: cart.billing_address.postal_code ?? undefined,
              state: cart.billing_address.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
        disabled={submitting || disabled || notReady}
        onClick={handlePayment}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  )
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

const PayPalPaymentButton = ({
  session,
  notReady,
}: {
  session: PaymentSession
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const { cart } = useCart()
  const { onPaymentCompleted } = useCheckout()

  const handlePayment = async (
    _data: OnApproveData,
    actions: OnApproveActions
  ) => {
    actions?.order
      ?.authorize()
      .then((authorization) => {
        if (authorization.status !== "COMPLETED") {
          setErrorMessage(`An error occurred, status: ${authorization.status}`)
          return
        }
        onPaymentCompleted()
      })
      .catch(() => {
        setErrorMessage(`An unknown error occurred, please try again.`)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        currency: cart?.region.currency_code.toUpperCase(),
        intent: "authorize",
      }}
    >
      {errorMessage && (
        <span className="text-rose-500 mt-4">{errorMessage}</span>
      )}
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={async () => session.data.id as string}
        onApprove={handlePayment}
        disabled={notReady || submitting}
      />
    </PayPalScriptProvider>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const detectSabahSarawak = useAppStore((state) => state.detectSabahSarawak)

  const [submitting, setSubmitting] = useState(false)

  const { onPaymentCompleted } = useCheckout()

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()

    setSubmitting(false)
  }

  return (
    <>
      <Button
        disabled={submitting || notReady || detectSabahSarawak}
        onClick={handlePayment}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </Button>
      {detectSabahSarawak && (
        <div className="text-white bg-red-400  p-4">
          Shipping available for West Malaysia only. Unfortunately, we do not
          deliver to Sabah and Sarawak regions.
        </div>
      )}
    </>
  )
}
const MERCHANT_CODE = process.env.NEXT_PUBLIC_IPAY88_MERCHANT_CODE
const IPay88PaymentButton = ({
  notReady,
  session,
}: {
  notReady: boolean
  session: PaymentSession
}) => {
  // const MERCHANT_CODE = "M42593"
  const detectSabahSarawak = useAppStore((state) => state.detectSabahSarawak)
  const [signature, setSignature] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { onPaymentCompleted, cart } = useCheckout()
  const amount = useMemo(() => {
    return session.data.is_test ? "1.00" : (cart?.total! / 100).toFixed(2)
  }, [session, cart])
  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()

    setSubmitting(false)
  }

  useEffect(() => {
    ;(async () => {
      setSubmitting(true)
      const res = await api.iPay88.signature({
        Amount: amount,
        Currency: "MYR",
        MerchantCode: MERCHANT_CODE,
        RefNo: session.cart_id,
      })
      setSubmitting(false)
      const sig = res.data
      setSignature(sig)
    })()
  }, [amount, session.id])

  return (
    <>
      <>
        <form
          method="post"
          name="ePayment"
          action="https://payment.ipay88.com.my/epayment/entry.asp"
          onSubmit={() => setSubmitting(true)}
        >
          <input type="hidden" name="MerchantCode" value={MERCHANT_CODE} />
          <input type="hidden" name="PaymentId" value="" />
          <input type="hidden" name="RefNo" value={session?.cart_id!} />
          <input type="hidden" name="Amount" value={amount} />
          <input
            type="hidden"
            name="Currency"
            value={cart?.region.currency_code.toUpperCase()}
          />
          <input type="hidden" name="ProdDesc" value="Checkout Cart" />
          <input
            type="hidden"
            name="UserName"
            value={
              cart?.billing_address?.first_name
                ? cart?.billing_address?.first_name +
                  " " +
                  cart?.billing_address?.last_name
                : ""
            }
          />
          <input type="hidden" name="UserEmail" value={cart?.customer?.email} />
          <input type="hidden" name="UserContact" value="" />
          <input type="hidden" name="Remark" value="" />
          <input type="hidden" name="Lang" value="UTF-8" />
          <input type="hidden" name="SignatureType" value="SHA256" />
          <input type="hidden" name="Signature" value={signature} />
          <input
            type="hidden"
            name="ResponseURL"
            // value={`https://api.gitechnano.com/store/payment/confirm`}
            value={`${MEDUSA_BACKEND_URL}/payment/ipay88/confirm`}
          />
          <input
            type="hidden"
            name="BackendURL"
            value={`${MEDUSA_BACKEND_URL}/payment/ipay88/backend_response`}
          />
          <input type="hidden" name="Optional" value="" />
          <input
            type="hidden"
            name="appdeeplink"
            value={`app://open.my.app/receipt/RefNo=${cart?.id}`}
          />
          {/* <input type="hidden" name="Xfield1" value="" /> */}
          {/* <input type="submit" value="Proceed with Payment" name="Submit" /> */}
          <Button
            disabled={submitting || notReady || detectSabahSarawak}
            isLoading={submitting}
            type="submit"
          >
            Proceed with Payment
          </Button>
        </form>
      </>

      {detectSabahSarawak && (
        <div className="text-white bg-red-400  p-4">
          Shipping available for West Malaysia only. Unfortunately, we do not
          deliver to Sabah and Sarawak regions.
        </div>
      )}
    </>
  )
}

export default PaymentButton
