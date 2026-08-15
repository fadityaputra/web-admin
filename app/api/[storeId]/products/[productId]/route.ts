import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import db from '@/lib/db'

// 1. FUNGSI GET (KHUSUS 1 PRODUK - MENGGUNAKAN FINDUNIQUE)
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id dibutuhkan', { status: 400 })
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
      },
    })

    if (!product) {
      return new NextResponse('Produk tidak ditemukan', { status: 404 })
    }

    const formatted = {
      ...product,
      price: Number(product.price),
    }

    return NextResponse.json(formatted)
  } catch (error) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// 2. FUNGSI PATCH (UNTUK UPDATE PRODUK)
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth()
    const body = await req.json()

    const {
      name,
      price,
      categoryId,
      images,
      isFeatured,
      isArchived,
      size,
      color,
      description,
      stock,
    } = body

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
        size: size || null,
        color: color || null,
        description: description || null,
        stock: stock ? Number(stock) : 0,

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

// 3. FUNGSI DELETE (UNTUK HAPUS PRODUK)
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
