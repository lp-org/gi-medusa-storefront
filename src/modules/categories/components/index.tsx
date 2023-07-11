import { useProductCategories } from "medusa-react"
import { ProductCategory } from "@medusajs/medusa"

function Categories() {
  const { product_categories, isLoading } = useProductCategories()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {product_categories && !product_categories.length && (
        <span>No Categories</span>
      )}
      {product_categories && product_categories.length > 0 && (
        <ul>
          {product_categories.map((category: ProductCategory) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Categories
