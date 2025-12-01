export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const notFound = (message = 'Resource not found'): ApiError =>
  new ApiError(404, 'NOT_FOUND', message);

export const badRequest = (message: string): ApiError =>
  new ApiError(400, 'BAD_REQUEST', message);

export const unauthorized = (message = 'Unauthorized'): ApiError =>
  new ApiError(401, 'UNAUTHORIZED', message);

