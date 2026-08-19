import db from '@/lib/db'
import { format } from 'date-fns'
import { CategoryClient } from './component/client'
import { CategoryColumn } from './component/column'

export const dynamic = 'force-dynamic'

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      banner: true, // biar bisa ambil label dari banner
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    bannerLabel: item.banner?.label || '-', // amanin kalau banner null
    createdAt: format(item.createdAt, 'MMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-1 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage
