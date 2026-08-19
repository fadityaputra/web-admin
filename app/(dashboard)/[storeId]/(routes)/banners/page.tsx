import { string } from 'zod'
import { BannersClient } from './component/client'
import db from '@/lib/db'
import { BannerColumn } from './component/column'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const BannersPage = async ({ params }: { params: { storeId: string } }) => {
  const banners = await db.banner.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBanner: BannerColumn[] = banners.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-1 pt-6">
        <BannersClient data={formattedBanner} />
      </div>
    </div>
  )
}

export default BannersPage
