import { NextResponse } from 'next/server'
import prismadb from '@/lib/db'

export const dynamic = 'force-dynamic'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

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

    return NextResponse.json(products, { headers: corsHeaders })
  } catch (error) {
    console.log('[GLOBAL_PRODUCTS_GET]', error)
    return new NextResponse('Internal error', {
      status: 500,
      headers: corsHeaders,
    })
  }
}
