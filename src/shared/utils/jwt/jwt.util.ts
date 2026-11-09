import jwt from 'jsonwebtoken';
import { isRecord } from '@/src/shared/utils/type-guard';

export const SESSION_COOKIE_NAME = 'session_token';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export type SessionPayload = {
  userId: string;
  email: string;
};

function readJwtSecret(): string {
  const value = process.env.JWT_SECRET;

  if (!value) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  return value;
}

function isSessionPayload(value: unknown): value is SessionPayload {
  return (
    isRecord(value) &&
    typeof value.userId === 'string' &&
    value.userId.length > 0 &&
    typeof value.email === 'string' &&
    value.email.length > 0
  );
}

export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, readJwtSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifyToken(token: string): SessionPayload | null {
  const secret = readJwtSecret();

  try {
    const decoded: unknown = jwt.verify(token, secret);

    if (!isSessionPayload(decoded)) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}
