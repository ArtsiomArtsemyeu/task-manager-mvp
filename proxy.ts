import { hasLocale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/src/shared/i18n/routing';
import { errorMessages } from '@/src/shared/config/error';
import { SESSION_COOKIE_NAME, verifyToken } from '@/src/shared/utils/jwt';

const handleI18nRouting = createMiddleware(routing);

function readBearerToken(request: NextRequest): string | undefined {
  const authorization = request.headers.get('authorization');
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');

  return match?.[1];
}

function readSessionToken(request: NextRequest): string | undefined {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return readBearerToken(request);
  }

  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
}

function hasSession(request: NextRequest): boolean {
  const token = readSessionToken(request);

  if (!token) {
    return false;
  }

  return verifyToken(token) !== null;
}

function readLocale(pathname: string): (typeof routing.locales)[number] {
  const segment = pathname.split('/')[1] ?? '';

  if (hasLocale(routing.locales, segment)) {
    return segment;
  }

  return routing.defaultLocale;
}

function getPathnameWithoutLocale(pathname: string): string {
  const segment = pathname.split('/')[1] ?? '';

  if (!hasLocale(routing.locales, segment)) {
    return pathname;
  }

  const rest = pathname.slice(segment.length + 1);
  return rest === '' ? '/' : rest;
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === '/lists' ||
    pathname.startsWith('/lists/') ||
    pathname === '/tasks' ||
    pathname.startsWith('/tasks/')
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/data') && !hasSession(request)) {
      return NextResponse.json(
        { error: errorMessages.error.unauthorized },
        { status: 401 },
      );
    }

    return NextResponse.next();
  }

  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  if (isProtectedPath(pathnameWithoutLocale) && !hasSession(request)) {
    return NextResponse.redirect(
      new URL(`/${readLocale(pathname)}`, request.url),
    );
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/api/data/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
