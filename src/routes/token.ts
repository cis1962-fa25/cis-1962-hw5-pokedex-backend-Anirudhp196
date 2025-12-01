import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { parseWithSchema } from '../utils/validation.js';

const router = Router();

const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_TOKEN_SECRET environment variable');
}

const bodySchema = z.object({
  user: z
    .string()
    .min(1, { message: 'user is required' })
    .transform((val) => val.trim().toLowerCase()),
});

router.post('/', (req, res, next) => {
  try {
    const { user } = parseWithSchema(bodySchema, req.body);

    const token = jwt.sign({ user }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;

