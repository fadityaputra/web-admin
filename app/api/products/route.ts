import { NextResponse } from 'next/server'
import prismadb from '@/lib/db'
export async function GET(req: Request) {
  try {
    const products = await prismadb.product.findMany({
      where: {
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        store: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log('[GLOBAL_PRODUCTS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
