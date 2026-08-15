'use client'

import { ColumnDef } from '@tanstack/react-table'
// import CellAction kalau kamu sudah buat komponen untuk tombol aksi
import { CellAction } from './cell-action'

// This type is used to define the shape of our data.
export type BannerColumn = {
  id: string
  label: string
  createdAt: string
}

export const columns: ColumnDef<BannerColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
