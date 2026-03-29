import db from '@/lib/db'
import { CategoryForm } from './component/category-form'

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string }
}) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  })

  const banner = await db.banner.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-1 pt-6">
        <CategoryForm banners={banner} initialData={category} />
      </div>
    </div>
  )
}

export default CategoryPage
