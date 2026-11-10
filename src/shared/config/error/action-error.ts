import type ru from '@/messages/ru.json';

type NestedMessageKeys<TNamespace extends keyof typeof ru> =
  `${TNamespace & string}.${Extract<keyof (typeof ru)[TNamespace], string>}`;

export type ActionErrorCode =
  | NestedMessageKeys<'validation'>
  | NestedMessageKeys<'error'>;

export type ActionResult = {
  error?: ActionErrorCode;
  success?: boolean;
} | null;
