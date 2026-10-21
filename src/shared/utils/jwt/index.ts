import jwt from "jsonwebtoken";

const JWT_SECRET = "task-manager-mvp-secret-key";

export const createToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = <T extends object>(token: string): T | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as T;
  } catch (error) {
    return null;
  }
};
