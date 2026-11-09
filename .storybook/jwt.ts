export const SESSION_COOKIE_NAME = 'session_token';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export function createToken(_payload: {
  userId: string;
  email: string;
}): string {
  return 'storybook-token';
}

export function verifyToken(_token: string): {
  userId: string;
  email: string;
} | null {
  return null;
}
