import { PaymentSession } from "@medusajs/medusa"
import Radio from "@modules/common/components/radio"
import clsx from "clsx"
import React, { useEffect, useRef } from "react"
import PaymentStripe from "../payment-stripe"
import PaymentTest from "../payment-test"
const MERCHANT_kEY = "mRncgj469i"
const MERCHANT_CODE = "M42593"
type PaymentContainerProps = {
  paymentSession: PaymentSession
  selected: boolean
  setSelected: () => void
  disabled?: boolean
}

const PaymentInfoMap: Record<string, { title: string; description: string }> = {
  stripe: {
    title: "Credit card",
    description: "Secure payment with credit card",
  },
  "stripe-ideal": {
    title: "iDEAL",
    description: "Secure payment with iDEAL",
  },
  paypal: {
    title: "PayPal",
    description: "Secure payment with PayPal",
  },
  manual: {
    title: "Test payment",
    description: "Test payment using medusa-payment-manual",
  },
  ipay88: {
    title: "Credit card (IPay88)",
    description: "Secure payment with credit card",
  },
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentSession,
  selected,
  setSelected,
  disabled = false,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-y-4 border-b border-gray-200 last:border-b-0",
        {
          "bg-gray-50": selected,
        }
      )}
    >
      <button
        className={"grid grid-cols-[12px_1fr] gap-x-4 py-4 px-8"}
        onClick={setSelected}
        disabled={disabled}
      >
        <Radio checked={selected} />
        <div className="flex flex-col text-left">
          <h3 className="text-base-semi leading-none text-gray-900">
            {PaymentInfoMap[paymentSession.provider_id].title}
          </h3>
          <span className="text-gray-700 text-small-regular mt-2">
            {PaymentInfoMap[paymentSession.provider_id].description}
          </span>
          {selected && (
            <div className="w-full mt-4">
              <PaymentElement paymentSession={paymentSession} />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}
const PaymentElement = ({
  paymentSession,
}: {
  paymentSession: PaymentSession
}) => {
  const formRef = useRef(null)
  const iframeRef = useRef(null)
  const [height, setHeight] = React.useState("0px")
  const [signature, setSignature] = React.useState("")
  const generateSignature = async ({
    Amount,
    Currency,
    MerchantCode,
    MerchantKey,
    RefNo,
  }: {
    MerchantKey: string
    MerchantCode: string
    RefNo: string
    Amount: string
    Currency: string
  }) => {
    const str = `${MerchantKey}${MerchantCode}${RefNo}${Amount}${Currency}`
    return await sha256(str)
  }
  useEffect(() => {
    ;(async () => {
      if (formRef?.current && paymentSession.provider_id === "ipay88") {
        const sig = await generateSignature({
          Amount: "100",
          Currency: "MYR",
          MerchantCode: MERCHANT_CODE,
          MerchantKey: MERCHANT_kEY,
          RefNo: paymentSession.id,
        })
        formRef.current.querySelector("input[name=Signature]").value = sig
        formRef?.current.submit()
      }
    })()
  }, [paymentSession])
  const onLoad = () => {
    setHeight(iframeRef.current.contentWindow.document.body.scrollHeight + "px")
  }
  console.log(paymentSession)
  switch (paymentSession.provider_id) {
    case "stripe":
      return (
        <div className="pt-8 pr-7">
          <PaymentStripe />
        </div>
      )

    case "ipay88":
      return (
        <>
          {
            <form
              method="post"
              name="ePayment"
              action="https://payment.ipay88.com.my/epayment/entry.asp"
              target="my_iframe"
              ref={formRef}
            >
              <input type="hidden" name="MerchantCode" value={MERCHANT_CODE} />
              <input type="hidden" name="PaymentId" value="" />
              <input type="hidden" name="RefNo" value={paymentSession.id} />
              <input type="hidden" name="Amount" value="1.00" />
              <input
                type="hidden"
                name="Currency"
                value={paymentSession?.data?.currency?.toUpperCase()}
              />
              <input
                type="hidden"
                name="ProdDesc"
                value={paymentSession.cart_id}
              />
              <input
                type="hidden"
                name="UserName"
                value={
                  paymentSession?.data?.billing_address?.first_name
                    ? paymentSession?.data?.billing_address?.first_name +
                      " " +
                      paymentSession?.data?.billing_address?.last_name
                    : ""
                }
              />
              <input
                type="hidden"
                name="UserEmail"
                value={paymentSession?.data?.customer?.email}
              />
              <input type="hidden" name="UserContact" value="" />
              <input type="hidden" name="Remark" value="" />
              <input type="hidden" name="Lang" value="UTF-8" />
              <input type="hidden" name="SignatureType" value="SHA256" />
              <input type="hidden" name="Signature" />
              <input
                type="hidden"
                name="ResponseURL"
                value={`https://api.gitechnano.com/payment/confirm`}
              />
              <input
                type="hidden"
                name="BackendURL"
                value={`https://api.gitechnano.com/webhook/ipay88`}
              />
              <input
                type="hidden"
                name="Optional"
                value="{'carddetails':'Y'}"
              />
              <input
                type="hidden"
                name="appdeeplink"
                value="app://open.my.app/receipt/RefNo=A00000001"
              />
              {/* <input type="hidden" name="Xfield1" value="" /> */}
              {/* <input type="submit" value="Proceed with Payment" name="Submit" /> */}
            </form>
          }
          <iframe
            ref={iframeRef}
            id="my_iframe"
            name="my_iframe"
            src="not_submitted_yet.aspx"
            allowFullScreen
            className="w-full"
            // height={height}
            // onLoad={onLoad}
          ></iframe>
        </>
      )
    case "manual":
      // We only display the test payment form if we are in a development environment
      return process.env.NODE_ENV === "development" ? <PaymentTest /> : null
    default:
      return null
  }
}

export default PaymentContainer
