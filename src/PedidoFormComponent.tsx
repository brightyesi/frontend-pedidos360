import React from 'react';
import type { Pedido } from './Pedidos';

interface FormErrors {
  items?: string;
  direccion?: string;
  total?: string;
}

interface PedidoFormComponentProps {
  form: Omit<Pedido, 'id'>;
  errors: FormErrors;
  onChange: (form: Omit<Pedido, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PedidoFormComponent({
  form,
  errors,
  onChange,
  onSubmit,
}: PedidoFormComponentProps) {
  return (
    <form onSubmit={onSubmit} className="pedido-form">
      <div className="form-group input-items">
        <label className="pedido-label">Productos del pedido</label>
        <input
          className={`pedido-input ${errors.items ? 'input-error' : ''}`}
          placeholder="Ej: Café en Grano 1kg x2, Taza Térmica x1"
          value={form.items}
          onChange={(e) => onChange({ ...form, items: e.target.value })}
        />
        {errors.items && <span className="error-text">{errors.items}</span>}
      </div>

      <div className="form-group input-direccion">
        <label className="pedido-label">Dirección de entrega</label>
        <input
          className={`pedido-input ${errors.direccion ? 'input-error' : ''}`}
          placeholder="Ej: Av. Siempre Viva 742, Puente Alto"
          value={form.direccion}
          onChange={(e) => onChange({ ...form, direccion: e.target.value })}
        />
        {errors.direccion && <span className="error-text">{errors.direccion}</span>}
      </div>

      <div className="form-group input-total">
        <label className="pedido-label">Total ($CLP)</label>
        <input
          type="number"
          min={1}
          className={`pedido-input ${errors.total ? 'input-error' : ''}`}
          placeholder="0"
          value={form.total || ''}
          onChange={(e) => onChange({ ...form, total: +e.target.value })}
        />
        {errors.total && <span className="error-text">{errors.total}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="catalog-button primary">
          + Crear Pedido
        </button>
      </div>
    </form>
  );
}