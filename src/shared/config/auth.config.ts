import { getRequiredEnv } from "./env";

/**
 * Seed / demo user for the MVP auth stub.
 * Values come from environment — never commit real secrets.
 */
export const defaultUser = {
  id: getRequiredEnv("DEFAULT_USER_ID"),
  email: getRequiredEnv("DEFAULT_USER_EMAIL"),
  password: getRequiredEnv("DEFAULT_USER_PASSWORD"),
} as const;
