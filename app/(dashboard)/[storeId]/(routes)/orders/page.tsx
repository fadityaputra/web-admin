import { format } from 'date-fns'
import prismadb from '@/lib/db'
import { formatter } from '@/lib/utils'

import { OrderClient } from './components/client'
import { OrderColumn } from './components/columns'

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  // 1. Ambil data pesanan dari database, urutkan dari yang paling baru
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // 2. Format datanya agar rapi saat dimasukkan ke dalam tabel
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    // Menggabungkan nama produk & jumlahnya. Contoh output: "Manfish (x3), Synodontis (x1)"
    products: item.orderItems
      .map((orderItem) => `${orderItem.product.name} (x${orderItem.quantity})`)
      .join(', '),
    // Menghitung total harga (Harga Barang * Kuantitas)
    totalPrice: formatter.format(
      item.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.product.price) * orderItem.quantity
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage
