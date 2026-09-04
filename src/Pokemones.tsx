// src/Pokemones.tsx
// Consulta protegida real: GET /pokemones en el API Gateway (JWT authorizer).
import { useState } from 'react';
import { useApi } from './useApi';
import { listPokemones, type Pokemon } from './api/pokemones';
import { ApiError } from './api/client';

export function Pokemones() {
  const api = useApi();
  const [items, setItems] = useState<Pokemon[] | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    if (!api) {
      setError('No hay sesión activa.');
      return;
    }
    setLoading(true);
    setError(null);
    setItems(null);
    setRaw(null);
    try {
      const data = await listPokemones(api);
      setItems(data);
      setRaw(data);
    } catch (err) {
      if (err instanceof ApiError) {
        // 401 = token inválido/ausente para el authorizer
        // 403 = token válido pero sin el scope/rol requerido en la Lambda
        setError(`API ${err.status} ${err.statusText} — ${JSON.stringify(err.body)}`);
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
      <h3>Backend protegido — GET /pokemones</h3>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
        Llama al API Gateway con el <code>Bearer</code> token (aud = tu API).
        El authorizer valida firma, issuer, audience y expiración.
      </p>

      <button className="btn btn-login" onClick={handleLoad} disabled={loading}>
        {loading ? 'Consultando...' : 'Listar Pokémones'}
      </button>

      {error && (
        <p style={{ color: '#d9534f', marginTop: '1rem', wordBreak: 'break-word' }}>
          {error}
        </p>
      )}

      {items && items.length > 0 && (
        <ul style={{ marginTop: '1rem' }}>
          {items.map((p, i) => (
            <li key={String(p.id ?? p.name ?? i)}>
              {p.name ?? p.id ?? JSON.stringify(p)}
            </li>
          ))}
        </ul>
      )}

      {raw != null && (
        <pre
          style={{
            backgroundColor: '#2d2d2d',
            color: '#67cdaa',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '1rem',
            fontSize: '0.8rem',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(raw, null, 2)}
        </pre>
      )}
    </div>
  );
}
