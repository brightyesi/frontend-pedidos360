    import React from 'react';

    interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    }

    interface FormErrors {
    name?: string;
    description?: string;
    price?: string;
    stock?: string;
    }

    interface ProductFormComponentProps {
    form: Omit<Product, 'id'>;
    errors: FormErrors;
    editingId: number | null;
    onChange: (form: Omit<Product, 'id'>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    }

    export function ProductFormComponent({
    form,
    errors,
    editingId,
    onChange,
    onSubmit,
    onCancel,
    }: ProductFormComponentProps) {
    return (
        <form onSubmit={onSubmit} className="catalog-form">
        <div className="form-group input-name">
            <input
            className={`catalog-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group input-description">
            <input
            className={`catalog-input ${errors.description ? 'input-error' : ''}`}
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group input-number">
            <input
            type="number"
            className={`catalog-input ${errors.price ? 'input-error' : ''}`}
            placeholder="Precio"
            value={form.price || ''}
            onChange={(e) => onChange({ ...form, price: +e.target.value })}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        <div className="form-group input-number">
            <input
            type="number"
            className={`catalog-input ${errors.stock ? 'input-error' : ''}`}
            placeholder="Stock"
            value={form.stock || ''}
            onChange={(e) => onChange({ ...form, stock: +e.target.value })}
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
        </div>

        <div className="form-actions">
            <button type="submit" className="catalog-button primary">
            {editingId ? 'Guardar Cambios' : '+ Crear Producto'}
            </button>
            {editingId && (
            <button type="button" onClick={onCancel} className="catalog-button cancel">
                Cancelar
            </button>
            )}
        </div>
        </form>
    );
}