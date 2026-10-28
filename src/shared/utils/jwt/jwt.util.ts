import jwt from 'jsonwebtoken';

const JWT_SECRET = 'task-manager-mvp-secret-key';

export const SESSION_COOKIE_NAME = 'session_token';

export const createToken = (payload: object): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

export const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};
