import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { CartDropdownProvider } from "@lib/context/cart-dropdown-context"
import { MobileMenuProvider } from "@lib/context/mobile-menu-context"
import { StoreProvider } from "@lib/context/store-context"
import api from "@lib/data/api"
import Layout from "@modules/layout/templates"
import { Hydrate } from "@tanstack/react-query"
import { CartProvider, MedusaProvider } from "medusa-react"
import App, { AppContext, AppInitialProps, AppProps } from "next/app"
import { useAppStore } from "store"
import "styles/globals.css"
import { AppPropsWithLayout, StoreContent } from "types/global"

function MyApp({
  Component,
  pageProps,
  storeContent,
}: AppPropsWithLayout<{
  dehydratedState?: unknown
}> &
  AppProps & { storeContent: StoreContent }) {
  const setStoreContent = useAppStore((state) => state.setStoreContent)
  const setSlider = useAppStore((state) => state.setSlider)
  setSlider(storeContent.slider)
  setStoreContent(storeContent)
  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <Hydrate state={pageProps.dehydratedState}>
        <CartDropdownProvider>
          <MobileMenuProvider>
            <CartProvider>
              <StoreProvider>
                <AccountProvider>
                  <Layout storeContent={storeContent}>
                    <Component {...pageProps} />
                  </Layout>
                </AccountProvider>
              </StoreProvider>
            </CartProvider>
          </MobileMenuProvider>
        </CartDropdownProvider>
      </Hydrate>
    </MedusaProvider>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<{ storeContent: StoreContent } & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)
  const res = await api.storeContent.get()
  return { ...ctx, storeContent: res.data }
}

export default MyApp
