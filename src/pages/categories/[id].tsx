import { medusaClient } from "@lib/config"
import CategoriesTemplate from "@modules/categories/templates"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import SkeletonCollectionPage from "@modules/skeletons/templates/skeleton-collection-page"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "../../types/global"

interface Params extends ParsedUrlQuery {
  id: string
}

const fetchCategory = async (id: string) => {
  return await medusaClient.productCategories
    .retrieve(id)
    .then(({ product_category }) => ({
      id: product_category.id,
      title: product_category.name,
    }))
}

export const fetchCategoryProducts = async ({
  pageParam = 0,
  id,
  cartId,
}: {
  pageParam?: number
  id: string
  cartId?: string
}) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 12,
    offset: pageParam,
    category_id: [id],
    cart_id: cartId,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  }
}

const CollectionPage: NextPageWithLayout<PrefetchedPageProps> = ({
  notFound,
}) => {
  const { query, isFallback, replace } = useRouter()
  const id = typeof query.id === "string" ? query.id : ""

  const { data, isError, isSuccess, isLoading } = useQuery(
    ["get_categories", id],
    () => fetchCategory(id)
  )

  //   if (notFound) {
  //     if (IS_BROWSER) {
  //       replace("/404")
  //     }

  //     return <SkeletonCollectionPage />
  //   }

  //   if (isError) {
  //     replace("/404")
  //   }

  if (isFallback || isLoading || !data) {
    return <SkeletonCollectionPage />
  }

  if (isSuccess) {
    return (
      <>
        <Head title={data.title} description={`${data.title} categories`} />
        <CategoriesTemplate categories={data} />
      </>
    )
  }

  return <></>
}

CollectionPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

// export const getStaticPaths: GetStaticPaths<Params> = async () => {
//   const ids = await getCollectionIds()

//   return {
//     paths: ids.map((id) => ({ params: { id } })),
//     fallback: true,
//   }
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient()
  const id = context.params?.id as string

  await queryClient.prefetchQuery(["get_categories", id], () =>
    fetchCategory(id)
  )

  await queryClient.prefetchInfiniteQuery(
    ["get_categories_products", id],
    ({ pageParam }) => fetchCategoryProducts({ pageParam, id }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const queryData = await queryClient.getQueryData([`get_categories`, id])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  return {
    props: {
      // Work around see – https://github.com/TanStack/query/issues/1458#issuecomment-747716357
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      notFound: false,
    },
  }
}

export default CollectionPage
