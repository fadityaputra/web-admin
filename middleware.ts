import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/api/stores/:storeId(.*)',
  '/api/:storeId/categories(.*)',
  '/api/:storeId/banners(.*)',
  '/api/:storeId/products(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Periksa apakah ini rute publik DAN merupakan request GET
  const isPublicGetRequest = isPublicRoute(req) && req.method === "GET";
  
  // Selalu proteksi jika bukan rute publik atau jika mencoba melakukan mutasi (POST/PATCH/DELETE)
  // kecuali untuk rute auth seperti sign-in
  if (!isPublicGetRequest && !req.nextUrl.pathname.startsWith('/sign-in')) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}