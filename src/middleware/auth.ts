import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { unauthorized } from '../errors.js';
import type { AuthenticatedUser } from '../types.js';

interface TokenPayload extends jwt.JwtPayload {
  user?: string;
}

const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_TOKEN_SECRET environment variable');
}

const parseToken = (header?: string | null): string => {
  if (!header) {
    throw unauthorized('Missing Authorization header');
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw unauthorized('Invalid Authorization header format');
  }

  return token;
};

export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const token = parseToken(req.header('Authorization'));
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!payload.user) {
      throw unauthorized('Token payload missing user');
    }

    req.user = { pennkey: payload.user } satisfies AuthenticatedUser;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      next(unauthorized('Invalid token'));
      return;
    }
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(unauthorized('Token expired'));
      return;
    }
    next(error);
  }
};

