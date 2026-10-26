import { revalidatePath } from 'next/cache';
import { getLocale } from 'next-intl/server';

export async function revalidateLocalizedPath(path: string): Promise<void> {
  const locale = await getLocale();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  revalidatePath(`/${locale}${normalizedPath}`);
}
