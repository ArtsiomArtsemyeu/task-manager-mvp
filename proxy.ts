import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';
import { API_PATHS } from './src/shared/utils/api';
import { SESSION_COOKIE_NAME, verifyToken } from './src/shared/utils/jwt';

const handleI18nRouting = createMiddleware(routing);
const publicPagePath = new RegExp(`^/(${routing.locales.join('|')})?$`);

function getBearerToken(request: NextRequest): string | undefined {
  const [scheme, token] = request.headers.get('authorization')?.split(' ') ?? [];
  return scheme === 'Bearer' && token ? token : undefined;
}

function getSessionToken(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    if (pathname === API_PATHS.authLogin) {
      return NextResponse.next();
    }

    const sessionToken = getSessionToken(request);
    const bearerToken = getBearerToken(request);

    if (
      !sessionToken ||
      sessionToken !== bearerToken ||
      !verifyToken(sessionToken)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (!publicPagePath.test(pathname)) {
    const sessionToken = getSessionToken(request);

    if (!sessionToken || !verifyToken(sessionToken)) {
      const locale = pathname.split('/')[1];
      const redirectLocale =
        locale && (routing.locales as readonly string[]).includes(locale)
          ? locale
          : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${redirectLocale}`, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
