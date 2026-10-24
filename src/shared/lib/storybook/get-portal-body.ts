import { within } from 'storybook/test';

export function getPortalBody(canvasElement: HTMLElement) {
  return within(canvasElement.ownerDocument.body);
}
