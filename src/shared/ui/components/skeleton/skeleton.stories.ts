import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Shared/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: 200,
    height: 16,
  },
};

export const Circle: Story = {
  args: {
    width: 40,
    height: 40,
    circle: true,
  },
};

export const Block: Story = {
  args: {
    width: '100%',
    height: 120,
  },
};

export default meta;
