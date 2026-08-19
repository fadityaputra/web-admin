export const dynamic = 'force-dynamic'

import db from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('category Id Dibutuhkan', { status: 400 })
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_GET]', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth()
    const body = await req.json()

    const { name, bannerId } = body

    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 })
    }
    if (!name) {
      return new NextResponse('Harus  Menginput nama', { status: 400 })
    }

    if (!bannerId) {
      return new NextResponse('Harus  Menginput banner id', { status: 400 })
    }

    if (!params.categoryId) {
      return new NextResponse('category Id Dibutuhkan', { status: 400 })
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

    const category = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        bannerId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 })
    }
    if (!params.categoryId) {
      return new NextResponse('category Id Dibutuhkan', { status: 400 })
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

    const category = await db.category.delete({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
