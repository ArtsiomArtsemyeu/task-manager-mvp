import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { assertLocale } from '@/src/shared/i18n';
import { Home } from '@/src/widgets/home';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.appTitle'),
    description: t('metadata.appDescription'),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  assertLocale((await params).locale);

  return <Home />;
}
