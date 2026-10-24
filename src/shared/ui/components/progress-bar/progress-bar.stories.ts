import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './progress-bar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Shared/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof ProgressBar>;

export const ZeroProgress: Story = {
  args: {
    progress: 0,
  },
};

export const HalfProgress: Story = {
  args: {
    progress: 50,
  },
};

export const FullProgress: Story = {
  args: {
    progress: 100,
  },
};

export default meta;
