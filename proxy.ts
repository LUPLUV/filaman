import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from './lib/session'
import { cookies } from 'next/headers'

export async function proxy(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

    if (!session.isLoggedIn && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session.isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next|weight|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
