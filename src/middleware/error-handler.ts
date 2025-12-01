import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../errors.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  void _next;
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ code: err.code, message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      code: 'BAD_REQUEST',
      message: err.issues.map((issue) => issue.message).join('; '),
    });
    return;
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
  });
};

