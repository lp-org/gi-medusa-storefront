import { PaymentSession } from "@medusajs/medusa"
import Radio from "@modules/common/components/radio"
import clsx from "clsx"
import React, { useEffect, useRef } from "react"
import PaymentStripe from "../payment-stripe"
import PaymentTest from "../payment-test"

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

const PaymentElement = ({
  paymentSession,
}: {
  paymentSession: PaymentSession
}) => {
  const formRef = useRef(null)
  const iframeRef = useRef(null)
  const [height, setHeight] = React.useState("0px")
  useEffect(() => {
    if (formRef && paymentSession.provider_id === "ipay88") {
      formRef?.current.submit()
    }
  }, [])
  const onLoad = () => {
    setHeight(iframeRef.current.contentWindow.document.body.scrollHeight + "px")
  }
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
          <form
            method="post"
            name="ePayment"
            action="https://payment.ipay88.com.my/ePayment/entry.asp"
            target="my_iframe"
            ref={formRef}
          >
            <input type="hidden" name="MerchantCode" value="M42593" />
            <input type="hidden" name="PaymentId" value="" />
            <input type="hidden" name="RefNo" value="A00000001" />
            <input type="hidden" name="Amount" value="1.00" />
            <input type="hidden" name="Currency" value="MYR" />
            <input type="hidden" name="ProdDesc" value="Photo Print" />
            <input type="hidden" name="UserName" value="John Tan" />
            <input type="hidden" name="UserEmail" value="john@hotmail.com" />
            <input type="hidden" name="UserContact" value="0126500100" />
            <input type="hidden" name="Remark" value="" />
            <input type="hidden" name="Lang" value="UTF-8" />
            <input type="hidden" name="SignatureType" value="SHA256" />
            <input
              type="hidden"
              name="Signature"
              value="598ad471ec675635dfe6fe90be16d952360768abf2a22ca48498d97d20654d9c"
            />
            <input
              type="hidden"
              name="ResponseURL"
              value={`https://${location.host}/payment/response.asp`}
            />
            <input
              type="hidden"
              name="BackendURL"
              value="https://www.YourBackendURL.com/payment/backend_response.asp"
            />
            <input type="hidden" name="Optional" value="{'carddetails':'Y'}" />
            <input
              type="hidden"
              name="appdeeplink"
              value="app://open.my.app/receipt/RefNo=A00000001"
            />
            <input type="hidden" name="Xfield1" value="" />
            {/* <input type="submit" value="Proceed with Payment" name="Submit" /> */}
          </form>
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
