import "server-only";

import { getRequiredEnv } from "./env";

export const apiBaseUrl = getRequiredEnv("APP_BASE_URL");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
