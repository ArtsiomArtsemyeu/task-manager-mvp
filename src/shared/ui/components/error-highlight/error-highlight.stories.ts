import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorHighlight } from './error-highlight';

const meta: Meta<typeof ErrorHighlight> = {
  title: 'Shared/ErrorHighlight',
  component: ErrorHighlight,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof ErrorHighlight>;

export const WithMessage: Story = {
  args: {
    message: 'Название обязательно',
  },
};

export const Empty: Story = {
  args: {
    message: undefined,
  },
};

export default meta;
