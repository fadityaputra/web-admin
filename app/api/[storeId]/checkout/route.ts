import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

// Mengabaikan error typescript karena midtrans tidak punya file type bawaan
// @ts-ignore
import midtransClient from 'midtrans-client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const {
      items,
      customerName,
      phone,
      address,
      province,
      city,
      district,
      postalCode,
    } = await req.json()

    if (!items || items.length === 0) {
      return new NextResponse('Products are required', {
        status: 400,
        headers: corsHeaders,
      })
    }

    // 1. Membuat Pesanan di Database
    // Kita menambahkan 'include' agar bisa mengambil NAMA dan HARGA produk langsung dari database
    const order = await db.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        customerName: customerName || '',
        phone: phone || '',
        address: address || '',
        province: province || '',
        city: city || '',
        district: district || '',
        postalCode: postalCode || '',
        orderItems: {
          create: items.map((item: { id: string; quantity: number }) => ({
            product: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // 2. Persiapan Data untuk Midtrans
    const midtransItems = order.orderItems.map((item) => ({
      id: item.product.id,
      price: Number(item.product.price), // Harga asli dari database (mencegah hacker mengubah harga)
      quantity: item.quantity,
      name: item.product.name.substring(0, 50), // Midtrans melarang nama produk lebih dari 50 karakter
    }))

    // Menghitung total harga
    const grossAmount = midtransItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    // 3. Konfigurasi Midtrans Snap
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    })

    // 4. Membungkus data sesuai format Midtrans
    let parameter = {
      transaction_details: {
        order_id: order.id, // Pakai ID order dari database kita
        gross_amount: grossAmount,
      },
      item_details: midtransItems,
      customer_details: {
        first_name: customerName,
        phone: phone,
        shipping_address: {
          first_name: customerName,
          phone: phone,
          address: address,
          city: city,
          postal_code: postalCode,
          country_code: 'IDN',
        },
      },
    }

    // 5. Membuat Transaksi ke Midtrans
    const transaction = await snap.createTransaction(parameter)

    // 6. MENGIRIM LINK MIDTRANS KE WEB STORE
    // Jika berhasil, midtrans akan mengembalikan sebuah URL (Halaman Pembayaran)
    return NextResponse.json(
      { url: transaction.redirect_url },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.log('[CHECKOUT_POST]', error)
    return new NextResponse('Internal Error', {
      status: 500,
      headers: corsHeaders,
    })
  }
}
