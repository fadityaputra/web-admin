import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import db from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { name, price, categoryId, images, isFeatured, isArchived } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!name) {
      return new NextResponse('nama perlu di input', { status: 400 })
    }
    if (!images || !images.length) {
      return new NextResponse('image perlu di input', { status: 400 })
    }
    if (price === undefined || price === null) {
      return new NextResponse('harga perlu di input', { status: 400 })
    }
    if (!categoryId) {
      return new NextResponse('category perlu di input', { status: 400 })
    }
    if (!params.storeId) {
      return new NextResponse('store id url dibutuhkan', { status: 400 })
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

    const product = await db.product.create({
      data: {
        name,
        price,
        categoryId,
        isFeatured: isFeatured ?? false,
        isArchived: isArchived ?? false,
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      },
      include: {
        images: true,
        category: true,
      },
    })

    return NextResponse.json({
      ...product,
      price: Number(product.price),
    })
  } catch (error) {
    console.log('[PRODUCT_POST]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    if (!params.storeId) {
      return new NextResponse('store id url dibutuhkan', { status: 400 })
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formatted = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
