export interface AuthenticatedUser {
  pennkey: string;
}

export interface BoxEntry {
  id: string;
  createdAt: string;
  level: number;
  location: string;
  notes?: string | undefined;
  pokemonId: number;
}

export type InsertBoxEntry = Omit<BoxEntry, 'id'>;

export type UpdateBoxEntry = Partial<InsertBoxEntry>;

export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonMove {
  name: string;
  power?: number | undefined;
  type: PokemonType;
}

export interface PokemonStats {
  hp: number;
  speed: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  description: string;
  types: PokemonType[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  stats: PokemonStats;
}

