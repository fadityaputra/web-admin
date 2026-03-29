'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Banner } from '@/lib/generated/prisma'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { BannerColumn, columns } from './column'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface BannerClientprops {
  data: BannerColumn[]
}

export const BannersClient: React.FC<BannerClientprops> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Banner (${data?.length ?? 0})`}
          description="Atur Banner Untuk Toko"
        />
        <Button onClick={() => router.push(`/${params.storeId}/banners/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable data={data} columns={columns} searchKey="label" />
      <Heading title="Api" description="Api Untuk Banners" />
      <Separator />
      <ApiList namaIndikator="banners" idIndikator="bannerId" />
    </>
  )
}
