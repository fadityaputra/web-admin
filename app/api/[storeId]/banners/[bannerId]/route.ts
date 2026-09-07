import db from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET banner berdasarkan storeId + bannerId
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; bannerId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('store id dibutuhkan', { status: 400 })
    }

    if (!params.bannerId) {
      return new NextResponse('banner id dibutuhkan', { status: 400 })
    }

    const banner = await db.banner.findFirst({
      where: {
        id: params.bannerId,
        storeId: params.storeId,
      },
    })

    if (!banner) {
      return new NextResponse('Banner tidak ditemukan', { status: 404 })
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.log('[BANNER_GET]', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

// PATCH banner
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; bannerId: string } }
) {
  try {
    const { userId } = await auth()
    const body = await req.json()

    const { label, imageUrl } = body

    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 })
    }

    if (!label) {
      return new NextResponse('Harus menginput label', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Harus menginput imageUrl', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('store id dibutuhkan', { status: 400 })
    }

    if (!params.bannerId) {
      return new NextResponse('banner id dibutuhkan', { status: 400 })
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

    const banner = await db.banner.findFirst({
      where: {
        id: params.bannerId,
        storeId: params.storeId,
      },
    })

    if (!banner) {
      return new NextResponse('Banner tidak ditemukan', { status: 404 })
    }

    const updatedBanner = await db.banner.update({
      where: {
        id: params.bannerId,
      },
      data: {
        label,
        imageUrl,
      },
    })

    return NextResponse.json(updatedBanner)
  } catch (error) {
    console.log('[BANNER_PATCH]', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

// DELETE banner
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; bannerId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse('store id dibutuhkan', { status: 400 })
    }

    if (!params.bannerId) {
      return new NextResponse('banner id dibutuhkan', { status: 400 })
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

    const banner = await db.banner.findFirst({
      where: {
        id: params.bannerId,
        storeId: params.storeId,
      },
    })

    if (!banner) {
      return new NextResponse('Banner tidak ditemukan', { status: 404 })
    }

    const deletedBanner = await db.banner.delete({
      where: {
        id: params.bannerId,
      },
    })

    return NextResponse.json(deletedBanner)
  } catch (error) {
    console.log('[BANNER_DELETE]', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
