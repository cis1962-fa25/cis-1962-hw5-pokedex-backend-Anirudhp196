import { Router } from 'express';
import { z } from 'zod';
import { getPokemonByName, getPokemonList } from '../services/pokemon-service.js';
import { parseWithSchema } from '../utils/validation.js';

const router = Router();

const listQuerySchema = z.object({
  limit: z
    .coerce.number()
    .int()
    .gt(0, { message: 'limit must be greater than 0' }),
  offset: z
    .coerce.number()
    .int()
    .min(0, { message: 'offset must be ≥ 0' }),
});

const nameParamsSchema = z.object({
  name: z.string().min(1),
});

router.get('/', async (req, res, next) => {
  try {
    const { limit, offset } = parseWithSchema(listQuerySchema, req.query);
    const pokemons = await getPokemonList(limit, offset);
    res.json(pokemons);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const { name } = parseWithSchema(nameParamsSchema, req.params);
    const pokemon = await getPokemonByName(name);
    res.json(pokemon);
  } catch (error) {
    next(error);
  }
});

export default router;

