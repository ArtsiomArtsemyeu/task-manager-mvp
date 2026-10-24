import type { Metadata } from 'next';
import { ErrorView } from '@/src/widgets/error-view';

export const metadata: Metadata = {
  title: 'Страница не найдена | Менеджер задач',
  description: 'Запрашиваемая страница не найдена.',
};

export default function NotFound() {
  return <ErrorView status="not-found" />;
}
