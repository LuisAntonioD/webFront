


import React from 'react';
import ProductsTable from '../../Products/ProductsTable/ProductsTable';
//import './ProductsPage.css'; // Si tienes estilos específicos para esta página

const ProductsPage = () => {
    return (
        <div className="products-page-container">
            {/* Aquí puedes agregar Navbar u otros elementos comunes si es necesario */}
            <ProductsTable />
        </div>
    );
};

export default ProductsPage;
