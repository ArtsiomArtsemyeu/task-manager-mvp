export function createToken(_payload: object): string {
  return "storybook-token";
}

export function verifyToken(_token: string): object | null {
  return null;
}
