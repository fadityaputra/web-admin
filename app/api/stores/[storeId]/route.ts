export const dynamic = 'force-dynamic'

import db from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await db.store.findUnique({
      where: { id: params.storeId },
    })

    if (!store) {
      return new NextResponse('Store tidak ditemukan', { status: 404 })
    }

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { name } = body

    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Harus Menginput Nama', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('Store Id Dibutuhkan', { status: 400 })
    }

    const store = await db.store.updateMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
      data: {
        name: name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_PATCH]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse('Store Id Dibutuhkan', { status: 400 })
    }

    const store = await db.store.deleteMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_DELETE]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
