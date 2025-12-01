import { Router } from 'express';
import { z } from 'zod';
import {
  clearEntries,
  createEntry,
  deleteEntry,
  getEntry,
  listEntryIds,
  updateEntry,
} from '../services/box-service.js';
import { authenticate } from '../middleware/auth.js';
import { parseWithSchema } from '../utils/validation.js';
import type { InsertBoxEntry, UpdateBoxEntry } from '../types.js';

const router = Router();

const idParamsSchema = z.object({
  id: z.string().min(1),
});

const isoDate = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'createdAt must be a valid ISO 8601 string',
  });

const baseSchema = z.object({
  createdAt: isoDate,
  level: z.coerce.number().int().min(1).max(100),
  location: z.string().min(1),
  notes: z.string().optional(),
  pokemonId: z.coerce.number().int().min(1),
});

const insertSchema = baseSchema;

const updateSchema = baseSchema.partial().refine(
  (body) => Object.keys(body).length > 0,
  { message: 'At least one field must be provided' },
);

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const pennkey = req.user!.pennkey;
    const ids = await listEntryIds(pennkey);
    res.json(ids);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const pennkey = req.user!.pennkey;
    const body = parseWithSchema(insertSchema, req.body) as InsertBoxEntry;
    const entry = await createEntry(pennkey, body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const pennkey = req.user!.pennkey;
    const { id } = parseWithSchema(idParamsSchema, req.params);
    const entry = await getEntry(pennkey, id);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const pennkey = req.user!.pennkey;
    const { id } = parseWithSchema(idParamsSchema, req.params);
    const updates = parseWithSchema(updateSchema, req.body) as UpdateBoxEntry;
    const entry = await updateEntry(pennkey, id, updates);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const pennkey = req.user!.pennkey;
    const { id } = parseWithSchema(idParamsSchema, req.params);
    await deleteEntry(pennkey, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const pennkey = req.user!.pennkey;
    await clearEntries(pennkey);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

