// src/api/pokemones.ts
// Ruta de ejemplo del backend. Cada recurso nuevo va en su propio archivo y
// reutiliza el ApiClient (que ya resuelve token + Authorization + errores).

import type { ApiClient } from './client';

// La forma exacta la define tu Lambda; la dejamos laxa para el ejemplo.
export interface Pokemon {
  id?: number | string;
  name?: string;
  [key: string]: unknown;
}

// GET /pokemones  -> puede venir como array o como { items: [...] } / { data: [...] }
export async function listPokemones(api: ApiClient): Promise<Pokemon[]> {
  const raw = await api.get<unknown>('/pokemones');
  if (Array.isArray(raw)) return raw as Pokemon[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const key of ['items', 'data', 'pokemones', 'results']) {
      if (Array.isArray(obj[key])) return obj[key] as Pokemon[];
    }
  }
  return [];
}
