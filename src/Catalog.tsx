    import React, { useState } from 'react';
    import './Catalog.css';

    interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    }

    // Datos simulados para visualizar el diseño inmediatamente
    const INITIAL_PRODUCTS: Product[] = [
    { id: 1, name: 'Cafetera Espresso', description: 'Máquina de 15 bares para café profesional.', price: 120000, stock: 15 },
    { id: 2, name: 'Café en Grano 1kg', description: 'Variedad arábica tueste medio.', price: 15990, stock: 40 },
    { id: 3, name: 'Taza Térmica', description: 'Mantención 6 hrs caliente color verde mate.', price: 8500, stock: 0 },
    ];

    export function Catalog() {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [form, setForm] = useState<Omit<Product, 'id'>>({ name: '', description: '', price: 0, stock: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
        setProducts(products.map(p => p.id === editingId ? { ...form, id: editingId } : p));
        } else {
        setProducts([...products, { ...form, id: Date.now() }]);
        }
        resetForm();
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        });
    };

    const resetForm = () => {
        setForm({ name: '', description: '', price: 0, stock: 0 });
        setEditingId(null);
    };

    return (
        <div className="catalog-container">
        <h2 className="catalog-title">📦 Catálogo de Productos e Inventario</h2>

        <form onSubmit={handleSubmit} className="catalog-form">
            <input
            className="catalog-input input-name"
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            />
            <input
            className="catalog-input input-description"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            />
            <input
            type="number"
            className="catalog-input input-number"
            placeholder="Precio"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            required
            />
            <input
            type="number"
            className="catalog-input input-number"
            placeholder="Stock"
            value={form.stock || ''}
            onChange={(e) => setForm({ ...form, stock: +e.target.value })}
            required
            />

            <div className="form-actions">
            <button type="submit" className="catalog-button primary">
                {editingId ? 'Guardar Cambios' : '+ Crear Producto'}
            </button>
            {editingId && (
                <button type="button" onClick={resetForm} className="catalog-button cancel">
                Cancelar
                </button>
            )}
            </div>
        </form>

        <div className="catalog-grid">
            {products.map((p) => (
            <div key={p.id} className="product-card">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-description">{p.description}</p>
                <p className="product-price">Precio: ${p.price.toLocaleString('es-CL')}</p>
                <p className={p.stock > 0 ? 'stock-available' : 'stock-empty'}>
                Stock disponible: {p.stock}
                </p>
                <button onClick={() => handleEdit(p)} className="edit-card-button">
                ✏️ Editar Producto / Stock
                </button>
            </div>
            ))}
        </div>
        </div>
    );
}       