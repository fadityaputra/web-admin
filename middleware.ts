import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

const isPublicApiRoute = createRouteMatcher([
  '/api/:storeId/categories(.*)',
  '/api/:storeId/banners(.*)',
  '/api/:storeId/products(.*)',
  '/api/:storeId/checkout(.*)',
  '/api/products(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApiRoute(req)) {
    if (req.method === 'GET' || req.method === 'OPTIONS') {
      return
    }

    if (
      req.method === 'POST' &&
      (req.nextUrl.pathname.includes('/checkout') ||
        req.nextUrl.pathname === '/api/webhook')
    ) {
      return
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
