import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n =  createMiddleware(routing)

const PUPLIC_PATHS = ['/', '/login', '/register']

function getLocaleFromPathname( pathname: string) {
    const segmento = pathname.split('/')[1]
    return routing.locales.includes(segmento as any) ? segmento : routing.defaultLocale
}

export default function middleware(request: NextRequest) {
    const i18nResponse  = handleI18n(request);

    if(i18nResponse && i18nResponse.ok){
        return i18nResponse;
    }

    const { pathname } = request.nextUrl

    if(pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('.')) {
        return i18nResponse;
    }

    const locale = getLocaleFromPathname(pathname)

    const pathWithOutLocale = pathname.startsWith(`/${locale}`) ? pathname.slice(`/${locale}`.length) || '/' : pathname;

    const isPublic =  PUPLIC_PATHS.includes(pathWithOutLocale);

    const accessToken = request.cookies.get('accessToken')?.value
    const isLoggedIn = Boolean(accessToken);

    if(!isLoggedIn && !isPublic) {
        return NextResponse.redirect(new URL(`${locale}/login`, request.url))
    }

    if(isLoggedIn && (pathWithOutLocale === 'login') || (pathWithOutLocale === 'register')) {
        return NextResponse.redirect(new URL(`${locale}/dashboard`, request.url))
    }

    return i18nResponse;

}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\..*).*)']
}
