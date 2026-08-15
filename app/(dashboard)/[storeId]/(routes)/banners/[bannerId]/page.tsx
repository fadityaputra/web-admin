import db from '@/lib/db'
import { BannerForm } from './component/banner-form'

const BannerPage = async ({
  params,
}: {
  params: { storeId: string; bannerId: string }
}) => {
  if (params.bannerId === 'new') {
    return (
      <div>
        <BannerForm initialData={null} />
      </div>
    )
  }

  const banner = await db.banner.findUnique({
    where: {
      id: params.bannerId,
    },
  })

  return (
    <div>
      <BannerForm initialData={banner} />
    </div>
  )
}

export default BannerPage
