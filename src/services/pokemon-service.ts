import Pokedex from 'pokedex-promise-v2';
import type {
  Pokemon as PokeApiPokemon,
  PokemonSpecies,
  Move,
} from 'pokedex-promise-v2';
import { getTypeColor } from '../type-colors.js';
import { ApiError } from '../errors.js';
import type { Pokemon, PokemonMove, PokemonType } from '../types.js';

const pokedex = new Pokedex();

const sanitizeText = (text: string): string =>
  text.replace(/\s+/g, ' ').trim();

const mapTypes = (types: PokeApiPokemon['types']): PokemonType[] =>
  types
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((typeEntry) => {
      const typeName = typeEntry.type.name;
      return {
        name: typeName.toUpperCase(),
        color: getTypeColor(typeName),
      };
    });

const mapStats = (stats: PokeApiPokemon['stats']): Pokemon['stats'] => {
  const getStat = (name: string): number =>
    stats.find((stat) => stat.stat.name === name)?.base_stat ?? 0;

  return {
    hp: getStat('hp'),
    speed: getStat('speed'),
    attack: getStat('attack'),
    defense: getStat('defense'),
    specialAttack: getStat('special-attack'),
    specialDefense: getStat('special-defense'),
  };
};

const mapMove = (move: Move): PokemonMove => {
  const englishName =
    move.names?.find((entry) => entry.language.name === 'en')?.name ??
    move.name;

  const type: PokemonType = {
    name: move.type.name.toUpperCase(),
    color: getTypeColor(move.type.name),
  };

  return {
    name: englishName,
    power: move.power && move.power > 0 ? move.power : undefined,
    type,
  };
};

const buildDescription = (species: PokemonSpecies): string => {
  const flavor =
    species.flavor_text_entries.find(
      (entry) => entry.language.name === 'en',
    )?.flavor_text ?? 'No description available.';

  return sanitizeText(flavor);
};

const selectPokemonName = (
  pokemon: PokeApiPokemon,
  species: PokemonSpecies,
): string =>
  species.names?.find((entry) => entry.language.name === 'en')?.name ??
  pokemon.name;

const fetchMoves = async (
  moveRefs: PokeApiPokemon['moves'],
): Promise<PokemonMove[]> => {
  const movesToFetch = moveRefs.map((move) => move.move.name);
  const moveDetails = await Promise.all(
    movesToFetch.map((name) => pokedex.getMoveByName(name)),
  );

  return moveDetails.map(mapMove);
};

const buildPokemon = async (pokemon: PokeApiPokemon): Promise<Pokemon> => {
  const species = (await pokedex.getPokemonSpeciesByName(
    pokemon.name,
  )) as PokemonSpecies;

  const movesPromise = fetchMoves(pokemon.moves);
  const description = buildDescription(species);
  const properName = selectPokemonName(pokemon, species);
  const moves = await movesPromise;

  return {
    id: pokemon.id,
    name: properName,
    description,
    types: mapTypes(pokemon.types),
    moves,
    sprites: {
      front_default: pokemon.sprites.front_default,
      back_default: pokemon.sprites.back_default,
      front_shiny: pokemon.sprites.front_shiny,
      back_shiny: pokemon.sprites.back_shiny,
    },
    stats: mapStats(pokemon.stats),
  };
};

const handlePokeApiError = (error: unknown): never => {
  const status =
    (error as { statusCode?: number })?.statusCode ??
    (error as { response?: { status?: number } })?.response?.status;

  if (status === 404) {
    throw new ApiError(404, 'NOT_FOUND', 'Pokemon not found');
  }

  throw new ApiError(
    500,
    'INTERNAL_SERVER_ERROR',
    'Failed to fetch Pokemon data',
  );
};

export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  try {
    const pokemon = (await pokedex.getPokemonByName(
      name.toLowerCase(),
    )) as PokeApiPokemon;
    return buildPokemon(pokemon);
  } catch (error) {
    return handlePokeApiError(error);
  }
};

export const getPokemonList = async (
  limit: number,
  offset: number,
): Promise<Pokemon[]> => {
  try {
    const list = await pokedex.getPokemonsList({ limit, offset });

    return Promise.all(list.results.map((entry) => getPokemonByName(entry.name)));
  } catch (error) {
    return handlePokeApiError(error);
  }
};

