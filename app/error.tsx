'use client';

import { useEffect } from 'react';
import { ErrorView } from '@/src/widgets/error-view';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorView status="server-error" onRetry={reset} />;
}
