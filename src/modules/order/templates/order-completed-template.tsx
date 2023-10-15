import { Order } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React, { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

type OrderCompletedTemplateProps = {
  order: Order
}
const OrderCompletedTemplate: React.FC<OrderCompletedTemplateProps> = ({
  order,
}) => {
  let componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${order.id}-Order`,
    onPrintError: () => alert("there is an error when printing"),
  })
  return (
    <div className="bg-gray-50 py-6 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl h-full bg-white w-full mx-auto">
        <Button
          style={{ width: 100, marginLeft: "auto" }}
          onClick={handlePrint}
        >
          Print Order
        </Button>
      </div>
      <div
        className="max-w-4xl h-full bg-white w-full mx-auto"
        ref={componentRef}
      >
        <OrderDetails order={order} />
        <Items
          items={order.items}
          region={order.region}
          cartId={order.cart_id}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-10 border-b border-gray-200">
          <ShippingDetails
            shippingMethods={order.shipping_methods}
            address={order.shipping_address}
          />
          <OrderSummary order={order} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-10">
          <Help />
        </div>
      </div>
    </div>
  )
}

export default OrderCompletedTemplate
