import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import db from '@/lib/db'
import { string } from 'zod'

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

    // ✅ query tanpa filter ketat
    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        ...(categoryId ? { categoryId } : {}), // hanya filter kalau ada
        ...(isFeatured ? { isFeatured: true } : {}),
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

    // ✅ pastikan Decimal -> number
    const formatted = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }))

    // ✅ Debug log di server
    console.log('Store ID:', params.storeId)
    console.log('Products fetched:', formatted.length)

    return NextResponse.json(formatted)
  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { name, price, categoryId, images, isFeatured, isArchived } = body

    if (!userId) return new NextResponse('unauthenticated', { status: 401 })
    if (!name) return new NextResponse('Harus menginput name', { status: 400 })
    if (!price)
      return new NextResponse('Harus menginput harga', { status: 400 })
    if (!categoryId)
      return new NextResponse('Harus memilih category', { status: 400 })
    if (!images || !images.length)
      return new NextResponse('Harus menginput images', { status: 400 })
    if (!params.productId)
      return new NextResponse('product Id Dibutuhkan', { status: 400 })

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    })
    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    await db.images.deleteMany({
      where: { productId: params.productId },
    })

    await db.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    })

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((images: { url: string }) => images)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) return new NextResponse('unauthenticated', { status: 401 })
    if (!params.productId)
      return new NextResponse('product Id Dibutuhkan', { status: 400 })

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    })
    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const product = await db.product.deleteMany({
      where: { id: params.productId },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
