import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import Head from "@modules/common/components/head"
import ProductTemplate from "@modules/products/templates"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { PrefetchedPageProps } from "types/global"

interface Params extends ParsedUrlQuery {
  handle: string
}

const fetchProduct = async (handle: string) => {
  return await medusaClient.products
    .list({ handle })
    .then(({ products }) => products[0])
}

const ProductPage = ({
  notFound,
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { query, isFallback, replace } = useRouter()

  if (notFound) {
    if (IS_BROWSER) {
      replace("/404")
    }

    return <SkeletonProductPage />
  }

  if (notFound) {
    replace("/404")
  }
  console.log("data", data)
  if (data) {
    return (
      <>
        <Head
          description={data.description}
          title={data.title}
          image={data.thumbnail}
        />
        <ProductTemplate product={data} />
      </>
    )
  }

  return <></>
}

// export const getStaticPaths: GetStaticPaths<Params> = async () => {
//   const handles = await getProductHandles()
//   return {
//     paths: handles.map((handle) => ({ params: { handle } })),
//     fallback: true,
//   }
// }

export const getServerSideProps: GetServerSideProps<
  PrefetchedPageProps
> = async (context) => {
  const handle = context.params?.handle as string

  const queryData = await fetchProduct(handle)

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }
  console.log(queryData)
  return {
    props: {
      data: queryData,
      notFound: false,
    },
  }
}

export default ProductPage
