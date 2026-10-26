import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ErrorView } from '@/src/widgets/error-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('metadata.notFoundTitle'),
    description: t('metadata.notFoundDescription'),
  };
}

export default function NotFound() {
  return <ErrorView status="not-found" />;
}
