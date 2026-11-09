import { NextResponse, type NextRequest } from 'next/server';
import { errorMessages } from '@/src/shared/config/error';
import { SESSION_COOKIE_NAME, verifyToken } from '@/src/shared/utils/jwt';

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

export function proxy(request: NextRequest) {
  if (hasSession(request)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: errorMessages.error.unauthorized },
      { status: 401 },
    );
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/api/data/:path*', '/lists/:path*', '/tasks/:path*'],
};
