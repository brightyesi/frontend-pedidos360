    import React, { useEffect, useState } from 'react';
    import { useApi } from './useApi';
    import { ProductFormComponent } from './ProductFormComponent';
    import { ProductCardComponent } from './ProductCardComponent';
    import './Catalog.css';

    const USE_MOCK_DATA = false; // Cambiar a false al conectar con ms-pedidos360-catalog

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

    const INITIAL_MOCK_PRODUCTS: Product[] = [
    { id: 1, name: 'Cafetera Espresso', description: 'Máquina de 15 bares para café profesional.', price: 120000, stock: 15 },
    { id: 2, name: 'Café en Grano 1kg', description: 'Variedad arábica tueste medio.', price: 15990, stock: 3 },
    { id: 3, name: 'Taza Térmica', description: 'Mantención 6 hrs caliente color verde mate.', price: 8500, stock: 0 },
    ];

    export function Catalog() {
    const api = useApi();
    const [products, setProducts] = useState<Product[]>(USE_MOCK_DATA ? INITIAL_MOCK_PRODUCTS : []);
    const [form, setForm] = useState<Omit<Product, 'id'>>({ name: '', description: '', price: 0, stock: 0 });
    const [errors, setErrors] = useState<FormErrors>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(!USE_MOCK_DATA);

    const loadCatalog = async () => {
        if (USE_MOCK_DATA || !api) return;
        try {
        setLoading(true);
        // Petición hacia ms-pedidos360-catalog (/api/catalog/*)
        const data = await api.get<Product[]>('/api/catalog');
        if (Array.isArray(data)) {
            setProducts(data);
        } else if (data && Array.isArray((data as any).data)) {
            setProducts((data as any).data);
        }
        } catch (err) {
        console.error('Error al cargar catálogo desde Oracle:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (!USE_MOCK_DATA && api) {
        loadCatalog();
        }
    }, [api]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria.';
        if (isNaN(form.price) || form.price <= 0) newErrors.price = 'Precio debe ser > 0.';
        if (isNaN(form.stock) || form.stock < 0) newErrors.stock = 'Stock no puede ser negativo.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (USE_MOCK_DATA) {
        if (editingId) {
            setProducts(products.map((p) => (p.id === editingId ? { ...form, id: editingId } : p)));
        } else {
            setProducts([...products, { ...form, id: Date.now() }]);
        }
        resetForm();
        return;
        }

        if (!api) return;
        try {
        if (editingId) {
            await api.put<Product>(`/api/catalog/${editingId}`, form);
        } else {
            await api.post<Product>('/api/catalog', form);
        }
        resetForm();
        loadCatalog();
        } catch (err) {
        alert('Error al guardar en ms-pedidos360-catalog');
        console.error(err);
        }
    };

    const handleEdit = (product: Product) => {
        if (product.id) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        });
        setErrors({});
        }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', price: 0, stock: 0 });
        setEditingId(null);
        setErrors({});
    };

    if (!USE_MOCK_DATA && !api) {
        return <div className="catalog-container">Autenticando con Entra ID...</div>;
    }

    return (
        <div className="catalog-container">
        <h2 className="catalog-title">📦 Catálogo de Productos e Inventario</h2>

        {/* Subcomponente Formulario */}
        <ProductFormComponent
            form={form}
            errors={errors}
            editingId={editingId}
            onChange={setForm}
            onSubmit={handleSubmit}
            onCancel={resetForm}
        />

        {loading ? (
            <p>Cargando productos desde Oracle DB...</p>
        ) : (
            /* Subcomponentes Tarjetas en Grilla */
            <div className="catalog-grid">
            {products.map((product) => (
                <ProductCardComponent
                key={product.id ?? product.name}
                product={product}
                onEdit={handleEdit}
                />
            ))}
            </div>
        )}
        </div>
    );
    }