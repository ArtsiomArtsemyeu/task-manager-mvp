import './env';
import type { Preview } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import ru from '../messages/ru.json';
import '@/app/reset.css';
import '@/app/global.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ru" messages={ru}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'default',
      values: [
        { name: 'default', value: '#eef6f0' },
        { name: 'light', value: '#fbfcfe' },
        { name: 'dark', value: '#0f1419' },
      ],
    },
  },
};

export default preview;
