import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')
    const { pathname } = request.nextUrl

    const publicRoutes = ['/']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!token && !isPublicRoute) {
        const returnUrl = encodeURIComponent(pathname)
        return NextResponse.redirect(
            new URL(`/?returnUrl=${returnUrl}`, request.url),
        )
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
}
