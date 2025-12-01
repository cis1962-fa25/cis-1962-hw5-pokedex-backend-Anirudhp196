import { createId } from '@paralleldrive/cuid2';
import { badRequest, notFound } from '../errors.js';
import { redisClient } from '../redis/redis-client.js';
import type { BoxEntry, InsertBoxEntry, UpdateBoxEntry } from '../types.js';

const KEY_SUFFIX = 'pokedex';

const buildKey = (pennkey: string, id: string): string =>
  `${pennkey}:${KEY_SUFFIX}:${id}`;

const parseEntry = (raw: string | null): BoxEntry | null => {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as BoxEntry;
  } catch {
    throw badRequest('Stored entry is corrupted');
  }
};

const extractIdFromKey = (key: string): string | null => {
  const segments = key.split(':');
  return segments.at(-1) ?? null;
};

export const listEntryIds = async (pennkey: string): Promise<string[]> => {
  const keys = await redisClient.keys(`${pennkey}:${KEY_SUFFIX}:*`);
  const ids = keys
    .map(extractIdFromKey)
    .filter((id): id is string => Boolean(id));

  return [...new Set(ids)];
};

export const getEntry = async (
  pennkey: string,
  id: string,
): Promise<BoxEntry> => {
  const entry = parseEntry(await redisClient.get(buildKey(pennkey, id)));
  if (!entry) {
    throw notFound('Box entry not found');
  }
  return entry;
};

export const createEntry = async (
  pennkey: string,
  data: InsertBoxEntry,
): Promise<BoxEntry> => {
  const entry: BoxEntry = {
    ...data,
    id: createId(),
  };

  await redisClient.set(buildKey(pennkey, entry.id), JSON.stringify(entry));
  return entry;
};

export const updateEntry = async (
  pennkey: string,
  id: string,
  updates: UpdateBoxEntry,
): Promise<BoxEntry> => {
  const existing = await getEntry(pennkey, id);
  const updated: BoxEntry = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  await redisClient.set(buildKey(pennkey, id), JSON.stringify(updated));
  return updated;
};

export const deleteEntry = async (
  pennkey: string,
  id: string,
): Promise<void> => {
  const deleted = await redisClient.del(buildKey(pennkey, id));
  if (deleted === 0) {
    throw notFound('Box entry not found');
  }
};

export const clearEntries = async (pennkey: string): Promise<void> => {
  const keys = await redisClient.keys(`${pennkey}:${KEY_SUFFIX}:*`);
  if (keys.length === 0) {
    return;
  }

  await Promise.all(keys.map((key) => redisClient.del(key)));
};

