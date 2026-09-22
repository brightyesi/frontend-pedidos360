import type { Pedido } from './Pedidos';

interface PedidoCardComponentProps {
  pedido: Pedido;
  onCancelar?: (pedido: Pedido) => void;
  animationDelay?: number;
}

const ESTADOS: Record<Pedido['estado'], string> = {
  Pendiente: 'pendiente',
  Enviado: 'enviado',
  Completado: 'completado',
  Cancelado: 'cancelado',
};

export function PedidoCardComponent({ pedido, onCancelar, animationDelay = 0 }: PedidoCardComponentProps) {
  const fechaFormateada = new Date(pedido.fecha).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`pedido-card pedido-card-${ESTADOS[pedido.estado]}`}
      style={animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <div className="pedido-card-top">
        <span className="pedido-numero">Pedido #{pedido.id}</span>
        <span className={`pedido-estado ${ESTADOS[pedido.estado]}`}>{pedido.estado}</span>
      </div>

      <p className="pedido-fecha">📅 {fechaFormateada}</p>
      <p className="pedido-items">{pedido.items}</p>
      <p className="pedido-direccion">📍 {pedido.direccion}</p>
      <p className="pedido-total">Total: ${pedido.total.toLocaleString('es-CL')}</p>

      {onCancelar && (
        <button onClick={() => onCancelar(pedido)} className="pedido-cancelar-button">
          Cancelar Pedido
        </button>
      )}
    </div>
  );
}