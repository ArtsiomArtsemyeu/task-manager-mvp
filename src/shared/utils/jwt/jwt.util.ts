import jwt from 'jsonwebtoken';

const JWT_SECRET = 'task-manager-mvp-secret-key';

export const createToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};
