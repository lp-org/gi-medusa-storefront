/* eslint-disable jsx-a11y/alt-text */
import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer"
import { Order } from "@medusajs/medusa"
import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
})

// Create Document Component
const OrderCompletePdf = ({ order }: { order: Order }) => {
  const items = order.items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <Document>
      <Page size={"A4"} style={styles.body}>
        <View>
          <Text style={styles.title}>
            Thank you, your order was successfully placed
          </Text>
          <Text>#{order.display_id}</Text>
          <Text>{order.id.split("order_")[1]}</Text>
          <View>
            <Text>Fri Oct 13 2023</Text>
            <Text>{`${items} ${items !== 1 ? "items" : "item"}`}</Text>
          </View>
        </View>
        <View>
          {order.items &&
            order.items.map((item) => {
              return (
                <View key={item.id}>
                  <Image
                    style={{ width: 400, height: 400 }}
                    src={{
                      uri: item.thumbnail || "",
                      method: "GET",
                      headers: {},
                      body: "",
                    }}
                    // source={order.items[0].thumbnail}
                  ></Image>
                  <View>
                    <View>
                      <View>
                        <View>
                          <Text>
                            <Text>{item.title}</Text>
                          </Text>
                          {/* <Text variant={item.variant} /> */}
                          <Text>Quantity: {item.quantity}</Text>
                        </View>
                        <View>
                          {/* <LineItemPrice region={region} item={item} /> */}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
        </View>
      </Page>
    </Document>
  )
}

export default OrderCompletePdf
