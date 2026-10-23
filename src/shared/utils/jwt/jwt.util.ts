import jwt from "jsonwebtoken";

const JWT_SECRET = "task-manager-mvp-secret-key";

export const createToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string): object | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== "object") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};
