import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useApi } from './useApi';
import { PedidoFormComponent } from './PedidoFormComponent';
import { PedidoCardComponent } from './PedidoCardComponent';
import './Pedidos.css';

const USE_MOCK_DATA = true; // Cambiar a false al conectar con ms-pedidos360-orders

export type EstadoPedido = 'Pendiente' | 'Enviado' | 'Completado' | 'Cancelado';

export interface Pedido {
  id?: number;
  fecha: string;
  estado: EstadoPedido;
  items: string;
  direccion: string;
  total: number;
}

interface FormErrors {
  items?: string;
  direccion?: string;
  total?: string;
}

const INITIAL_MOCK_PEDIDOS: Pedido[] = [
  {
    id: 1,
    fecha: '2026-09-18',
    estado: 'Enviado',
    items: 'Cafetera Espresso x1, Café en Grano 1kg x2',
    direccion: 'Av. Providencia 1234, Depto 501, Santiago',
    total: 151980,
  },
  {
    id: 2,
    fecha: '2026-09-10',
    estado: 'Completado',
    items: 'Taza Térmica x3',
    direccion: 'Av. Providencia 1234, Depto 501, Santiago',
    total: 25500,
  },
  {
    id: 3,
    fecha: '2026-09-22',
    estado: 'Pendiente',
    items: 'Café en Grano 1kg x1, Taza Térmica x1',
    direccion: 'Sucursal Las Condes',
    total: 24490,
  },
];

export function Pedidos() {
  const { instance } = useMsal();
  const api = useApi();
  const activeAccount = instance.getActiveAccount();

  const [pedidos, setPedidos] = useState<Pedido[]>(USE_MOCK_DATA ? INITIAL_MOCK_PEDIDOS : []);
  const [form, setForm] = useState<Omit<Pedido, 'id'>>({
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'Pendiente',
    items: '',
    direccion: '',
    total: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(!USE_MOCK_DATA);

  const loadPedidos = async () => {
    if (USE_MOCK_DATA || !api) return;
    try {
      setLoading(true);
      const data = await api.get<Pedido[]>('/api/orders');
      if (Array.isArray(data)) {
        setPedidos(data);
      } else if (data && Array.isArray((data as any).data)) {
        setPedidos((data as any).data);
      }
    } catch (err) {
      console.error('Error al cargar pedidos desde la API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!USE_MOCK_DATA && api) {
      loadPedidos();
    }
  }, [api]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.items.trim()) newErrors.items = 'Describe los productos del pedido.';
    if (!form.direccion.trim()) newErrors.direccion = 'La dirección de entrega es obligatoria.';
    if (isNaN(form.total) || form.total <= 0) newErrors.total = 'Total debe ser > 0.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (USE_MOCK_DATA) {
      setPedidos([
        { ...form, id: Date.now() },
        ...pedidos,
      ]);
      resetForm();
      return;
    }

    if (!api) return;
    try {
      await api.post<Pedido>('/api/orders', {
        ...form,
        cliente: activeAccount?.username,
      });
      resetForm();
      loadPedidos();
    } catch (err) {
      alert('Error al guardar en ms-pedidos360-orders');
      console.error(err);
    }
  };

  const handleCancelar = (pedido: Pedido) => {
    if (pedido.id === undefined) return;
    const updated = pedidos.map((p) =>
      p.id === pedido.id ? { ...p, estado: 'Cancelado' as EstadoPedido } : p,
    );
    setPedidos(updated);
  };

  const resetForm = () => {
    setForm({
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'Pendiente',
      items: '',
      direccion: '',
      total: 0,
    });
    setErrors({});
  };

  if (!USE_MOCK_DATA && !api) {
    return <div className="pedidos-container">Autenticando con Entra ID...</div>;
  }

  return (
    <div className="pedidos-container">
      <div className="pedidos-header">
        <div>
          <h2 className="pedidos-title">📦 Mis Pedidos</h2>
          <p className="pedidos-subtitle">
            {activeAccount?.name
              ? `Pedidos de ${activeAccount.name}`
              : 'Sigue el estado de tus órdenes de compra.'}
          </p>
        </div>
      </div>

      <PedidoFormComponent
        form={form}
        errors={errors}
        onChange={setForm}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <div className="pedidos-loading">
          <div className="pedidos-skeleton" />
          <div className="pedidos-skeleton" />
          <div className="pedidos-skeleton" />
        </div>
      ) : pedidos.length === 0 ? (
        <p className="pedidos-empty">Aún no tienes pedidos. ¡Crea el primero!</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido, i) => (
            <PedidoCardComponent
              key={pedido.id ?? pedido.fecha + pedido.items}
              pedido={pedido}
              onCancelar={pedido.estado === 'Pendiente' ? handleCancelar : undefined}
              animationDelay={i * 70}
            />
          ))}
        </div>
      )}
    </div>
  );
}