"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/src/widgets/error-page";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage status="server-error" onRetry={reset} />;
}
