// import { cookies } from 'next/headers';
// import { NextRequest } from 'next/server';

// const protectedRoutes = ['/', '/capture'];
// const publicRoutes = ['/login'];

// export async function setCookieAuthorization() {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('access_token')?.value;

//   return accessToken
//   // Proceed with your fetch request using the accessToken
// }
// // 'Authorization': `Bearer ${accessToken}`,
// //     'Content-Type': 'application/json',


// export default async function middleware(req) {
//  // 2. Check if the current route is protected or public
//  const path = req.nextUrl.pathname
//  const isProtectedRoute = protectedRoutes.includes(path)
//  const isPublicRoute = publicRoutes.includes(path)

  
//  // 3. Decrypt the session from the cookie
//   const cookie = (await cookies()).get('session')?.value
//   const session = await decrypt(cookie)

// // 5. Redirect to /login if the user is not authenticated
//    if (isProtectedRoute && !session?.userId) {
//     return NextResponse.redirect(new URL('/login', req.nextUrl))
//   }
 
// // 6. Redirect to /dashboard if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.userId &&
//     !req.nextUrl.pathname.startsWith('/dashboard')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
//   }
 
//   return NextResponse.next()
// }
 
// // Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }
