import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth()
    console.log('UserID =>', userId)

    const body = await req.json()

    const { name, bannerId } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('nama category perlu di input', { status: 400 })
    }

    if (!bannerId) {
      return new NextResponse('banner id perlu di input', { status: 400 })
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

    const category = await db.category.create({
      data: {
        name,
        bannerId,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORIES_POST]', error)
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

    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        banner: true, // ⬅️ Tambahkan ini agar relasi banner ikut diambil
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.log('[CATEGORIES_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
