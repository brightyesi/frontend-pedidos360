interface Product {
    id?: number;
    name: string; 
    description: string;
    price: number;
    stock: number;
}

interface ProductCardComponentProps {
    product: Product;
    onEdit?: (product: Product) => void;

}

export function ProductCardComponent({ product, onEdit }: ProductCardComponentProps) {
const getStockStatus = (stock: number) => {
    if (stock === 0) {
    return <span className="stock-empty"> Agotado (unidad 0)</span>;
    }
    if (stock < 5) {
    return <span className="stock-warning"> Stock crítico: {stock}</span>;
    }
    return <span className="stock-available"> Stock disponible: {stock}</span>;
};

return (
    <div className="product-card">
    <h3 className="product-name">{product.name}</h3>
    <p className="product-description">{product.description}</p>
    <p className="product-price">Precio: ${product.price.toLocaleString('es-CL')}</p>

    <div className="stock-tag">{getStockStatus(product.stock)}</div>

    {/* 2. El botón solo se renderiza si se le pasa la función onEdit  cuando es admin */}
    {onEdit && (
        <button onClick={() => onEdit(product)} className="edit-card-button">
        ✏️ Editar Producto / Stock
        </button>
    )}
    </div>
);
}