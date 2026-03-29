import db from '@/lib/db'
import { ProductForm } from './component/product-form'

const ProductPage = async ({
  params,
}: {
  params: { storeId: string; productId: string }
}) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  if (params.productId === 'new') {
    return (
      <div>
        <ProductForm initialData={null} categories={categories} />
      </div>
    )
  }

  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  })

  return (
    <div>
      <ProductForm initialData={product} categories={categories} />
    </div>
  )
}

export default ProductPage
