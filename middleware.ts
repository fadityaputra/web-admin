import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 1. Rute Auth dasar
const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

// 2. Rute API yang boleh diakses Web Store (Tambahkan checkout di sini)
const isPublicApiRoute = createRouteMatcher([
  '/api/:storeId/categories(.*)',
  '/api/:storeId/banners(.*)',
  '/api/:storeId/products(.*)',
  '/api/:storeId/checkout(.*)',
  '/api/products(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Aturan khusus untuk API Web Store:
  if (isPublicApiRoute(req)) {
    return
  }

  // Selain rute sign-in dan API publik di atas, WAJIB LOGIN!
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
