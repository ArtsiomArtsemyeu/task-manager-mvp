import type { z } from 'zod';
import { readJson } from '@/src/shared/utils/type-guard';

export type ParseRequestResult<T> =
  | { success: true; data: T }
  | { success: false };

export async function parseRequestJson<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema,
): Promise<ParseRequestResult<z.infer<TSchema>>> {
  try {
    const body = await readJson(request);
    const result = schema.safeParse(body);

    if (!result.success) {
      return { success: false };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false };
  }
}
