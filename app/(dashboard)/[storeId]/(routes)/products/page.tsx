import db from '@/lib/db'
import { ProductColumn } from './component/column'
import { format } from 'date-fns'
import { ProductClient } from './component/client'

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await db.product.findMany({
    where: { storeId: params.storeId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: item.price.toNumber(), // ⬅️ tetap number
    category: item.category.name,
    createdAt: format(item.createdAt, 'MMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-1 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
