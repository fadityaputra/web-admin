'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'

export type ProductColumn = {
  id: string
  name: string
  price: number
  category: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
    cell: ({ row }) => (row.original.isArchived ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ row }) => (row.original.isFeatured ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(row.original.price)
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
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
