import { afterEach, describe, expect, it } from 'vitest';
import { createToken, verifyToken } from './jwt.util';

describe('verifyToken', () => {
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
      return;
    }

    process.env.JWT_SECRET = originalSecret;
  });

  it('возвращает payload токена, подписанного тем же секретом', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = createToken({ userId: 'user-1', email: 'a@b.c' });

    expect(verifyToken(token)).toEqual({
      userId: 'user-1',
      email: 'a@b.c',
    });
  });

  it('возвращает null для некорректного токена', () => {
    process.env.JWT_SECRET = 'test-secret';

    expect(verifyToken('not-a-jwt')).toBeNull();
  });

  it('возвращает null, если секрет не совпадает', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = createToken({ userId: 'user-1', email: 'a@b.c' });
    process.env.JWT_SECRET = 'other-secret';

    expect(verifyToken(token)).toBeNull();
  });
});
