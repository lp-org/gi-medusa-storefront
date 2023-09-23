import { RadioGroup } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import { useCheckout } from "@lib/context/checkout-context"
import { Cart } from "@medusajs/medusa"
import Radio from "@modules/common/components/radio"
import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import { formatAmount, useCart, useCartShippingOptions } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import StepContainer from "../step-container"
import { useMutation } from "@tanstack/react-query"
import api from "@lib/data/api"
import { useAppStore } from "store"

type ShippingOption = {
  value?: string
  label?: string
  price: string
}

type ShippingProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

type ShippingFormProps = {
  soId: string
}

const Shipping: React.FC<ShippingProps> = ({ cart }) => {
  const { addShippingMethod, setCart } = useCart()
  const [fulfillmentWeightInfo, setFulfillmentWeightInfo] = useState()
  const {
    control,
    setError,
    formState: { errors },
  } = useForm<ShippingFormProps>({
    defaultValues: {
      soId: cart.shipping_methods?.[0]?.shipping_option_id,
    },
  })
  const soid = useWatch({ control, name: "soId" })
  const { mutate } = useMutation({
    mutationFn: api.weightFulfillment.get,
    onSuccess: (res) => {
      setFulfillmentWeightInfo(res.data?.[0])
    },
  })
  // Fetch shipping options
  const { shipping_options, refetch } = useCartShippingOptions(cart.id, {
    enabled: !!cart.id,
  })

  useEffect(() => {
    const selected = shipping_options?.find((el) => el.id === soid)
    if (selected) {
      if (selected.data?.id === "weight-fulfillment") {
        mutate()
      }
    }
  }, [shipping_options, soid])

  // Any time the cart changes we need to ensure that we are displaying valid shipping options
  useEffect(() => {
    const refetchShipping = async () => {
      await refetch()
    }

    refetchShipping()
  }, [cart, refetch])

  const submitShippingOption = (soId: string) => {
    addShippingMethod.mutate(
      { option_id: soId },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () =>
          setError(
            "soId",
            {
              type: "validate",
              message:
                "An error occurred while adding shipping. Please try again.",
            },
            { shouldFocus: true }
          ),
      }
    )
  }

  const handleChange = (value: string, fn: (value: string) => void) => {
    submitShippingOption(value)
    fn(value)
  }

  // Memoized shipping method options
  const shippingMethods: ShippingOption[] = useMemo(() => {
    if (shipping_options && cart?.region) {
      return shipping_options?.map((option) => ({
        value: option.id,
        label: option.name,
        price: formatAmount({
          amount: option.amount || 0,
          region: cart.region,
        }),
      }))
    }

    return []
  }, [shipping_options, cart])

  const totalWeight = useMemo(() => {
    return cart.items.reduce((prev, curr) => {
      return prev + (curr.variant.weight || 0) * curr.quantity
    }, 0)
  }, [cart])
  const setDetectSabahSarawak = useAppStore(
    (state) => state.setDetectSabahSarawak
  )
  const detectSabahSarawak = useMemo(() => {
    // Check if 'province' or 'city' contains "Sabah" or "Sarawak"
    let result = false
    const keywords = ["sabah", "sarawak"]
    if (
      (cart?.shipping_address?.province &&
        keywords.includes(
          cart?.shipping_address?.province.toLocaleLowerCase()
        )) ||
      (cart?.shipping_address?.city &&
        keywords.includes(cart?.shipping_address?.city.toLocaleLowerCase()))
    ) {
      result = true
    }
    setDetectSabahSarawak(result)
    return result
  }, [cart])

  const {
    sameAsBilling: { state: sameBilling },
  } = useCheckout()

  return (
    <StepContainer
      index={sameBilling ? 2 : 3}
      title="Delivery"
      closedState={
        <div className="px-8 pb-8 text-small-regular">
          <p>Enter your address to see available delivery options.</p>
        </div>
      }
    >
      <Controller
        name="soId"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <div>
              <RadioGroup
                value={value}
                onChange={(value: string) => handleChange(value, onChange)}
              >
                {shippingMethods && shippingMethods.length ? (
                  shippingMethods.map((option) => {
                    return (
                      <RadioGroup.Option
                        key={option.value}
                        value={option.value}
                        className={clsx(
                          "flex items-center justify-between text-small-regular cursor-pointer py-4 border-b border-gray-200 last:border-b-0 px-8",
                          {
                            "bg-gray-50": option.value === value,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <Radio checked={value === option.value} />
                          <span className="text-base-regular">
                            {option.label}
                          </span>
                        </div>
                        <span className="justify-self-end text-gray-700">
                          {option.price}
                        </span>
                      </RadioGroup.Option>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-gray-900">
                    <Spinner />
                  </div>
                )}
              </RadioGroup>
              <ErrorMessage
                errors={errors}
                name="soId"
                render={({ message }) => {
                  return (
                    <div className="pt-2 text-rose-500 text-small-regular">
                      <span>{message}</span>
                    </div>
                  )
                }}
              />
              {fulfillmentWeightInfo && (
                <div className="bg-yellow-200 m-4 p-4 rounded flex flex-col">
                  <div className="text-lg">
                    {` Total Weight : `}
                    <b>{(totalWeight / 1000).toFixed(2)} kg(s)</b>
                  </div>
                  <div className="text-sm mt-2">
                    {`For orders weighing ${
                      fulfillmentWeightInfo?.initial_weight / 1000
                    } kg(s) or less, you'll pay a flat
                  rate of ${formatAmount({
                    amount: fulfillmentWeightInfo?.initial_price,
                    region: cart.region,
                  })}. For orders over ${
                      fulfillmentWeightInfo?.initial_weight / 1000
                    } kg(s), we'll add an extra
                  RM 
                    ${formatAmount({
                      amount: fulfillmentWeightInfo?.additional_price,
                      region: cart.region,
                    })}
                   for every ${
                     fulfillmentWeightInfo?.every_additional_weight / 1000
                   }
                  kg(s).`}
                  </div>
                </div>
              )}
            </div>
          )
        }}
      />
    </StepContainer>
  )
}

export default Shipping
