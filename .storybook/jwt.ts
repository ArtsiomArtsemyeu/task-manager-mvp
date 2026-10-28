export const SESSION_COOKIE_NAME = 'session_token';

export function createToken(_payload: object): string {
  return 'storybook-token';
}

export function verifyToken(_token: string): boolean {
  return true;
}
