'use client'

import { ColumnDef } from '@tanstack/react-table'

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: 'Produk',
  },
  {
    accessorKey: 'phone',
    header: 'No. Telepon',
  },
  {
    accessorKey: 'address',
    header: 'Alamat',
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Harga',
  },
  {
    accessorKey: 'isPaid',
    header: 'Status',
    // Kita buat custom tampilan agar Lunas berwarna hijau, dan Belum hijau berwarna merah
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.isPaid ? (
          <span className="font-semibold text-green-600">Lunas</span>
        ) : (
          <span className="font-semibold text-red-600">Belum Dibayar</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Pesanan',
  },
]
