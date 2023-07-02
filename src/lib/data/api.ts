import medusaRequest from "@lib/request"

const api = {
  storeContent: {
    get() {
      const path = `/store/store-content`
      return medusaRequest("GET", path)
    },
  },
}

export default api
