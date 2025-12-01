import type { ZodSchema } from 'zod';
import { ApiError } from '../errors.js';

export const parseWithSchema = <T>(
  schema: ZodSchema<T>,
  data: unknown,
): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join('; ');
    throw new ApiError(400, 'BAD_REQUEST', message);
  }

  return result.data;
};

