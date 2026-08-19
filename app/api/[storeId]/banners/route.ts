export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import db from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth()
    console.log('UserID =>', userId)

    const body = await req.json()

    const { label, imageUrl } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!label) {
      return new NextResponse('nama banner perlu di input', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('image banner perlu di input', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('store id url dibutuhkan')
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const banner = await db.banner.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.log('[BANNERS_POST]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('store id url dibutuhkan')
    }

    const banner = await db.banner.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.log('[BANNERS_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
