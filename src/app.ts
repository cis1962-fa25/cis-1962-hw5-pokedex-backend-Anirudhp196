import express from 'express';
import boxRouter from './routes/box.js';
import pokemonRouter from './routes/pokemon.js';
import tokenRouter from './routes/token.js';
export const app = express();

app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/token', tokenRouter);
app.use('/pokemon', pokemonRouter);
app.use('/box', boxRouter);

app.use((_req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Route not found',
  });
});

export default app;

