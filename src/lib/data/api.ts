import medusaRequest from "@lib/request"

const api = {
  storeContent: {
    get() {
      const path = `/store/store-content`
      return medusaRequest("GET", path)
    },
  },
  pages: {
    get(handle: string, customize?: boolean) {
      const path = `/store/pages/${handle}${customize && "?customize=1"}`
      return medusaRequest("GET", path)
    },
  },
  geoip: {
    get() {
      const path = `/store/geoip`
      return medusaRequest("GET", path)
    },
  },

  weightFulfillment: {
    get() {
      const path = `/store/weight-fulfillment`
      return medusaRequest("GET", path)
    },
  },
}

export default api
