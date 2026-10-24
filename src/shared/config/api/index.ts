import 'server-only';

import { getRequiredEnv } from '../env';

export function apiUrl(path: string): string {
  const apiBaseUrl = getRequiredEnv('APP_BASE_URL');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
