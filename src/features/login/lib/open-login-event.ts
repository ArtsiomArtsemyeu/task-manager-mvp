export const OPEN_LOGIN_EVENT = 'task-manager:open-login';

export function openLoginForm(): void {
  window.dispatchEvent(new Event(OPEN_LOGIN_EVENT));
}
