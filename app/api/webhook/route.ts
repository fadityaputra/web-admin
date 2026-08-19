import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: Request) {
  try {
    // Menangkap pesan (payload) yang dikirim Midtrans
    const body = await req.json()

    const orderId = body.order_id
    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status

    if (!orderId) {
      return new NextResponse('Order ID tidak ditemukan', { status: 400 })
    }

    // Midtrans mengirim status 'settlement' atau 'capture' jika pembayaran berhasil
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'challenge') {
        // Transaksi mencurigakan, biarkan saja
      } else if (fraudStatus === 'accept' || !fraudStatus) {
        // PEMBAYARAN SUKSES!
        // Perbarui status isPaid menjadi true di database
        await db.order.update({
          where: {
            id: orderId,
          },
          data: {
            isPaid: true,
          },
        })

        // (Opsional) Nanti kodingan mengurangi stok barang ditaruh di sini
      }
    }

    // Wajib memberikan respons 200 OK agar Midtrans tahu pesannya sudah kita terima
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.log('[WEBHOOK_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
