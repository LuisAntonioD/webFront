import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Asegúrate de importar tu contexto de autenticación
import { ProductTable } from './ProductTable'; // Importa tu componente o lógica de gestión de productos
import axios from 'axios';
import './ProductsForm.css';

const UpdateForm = () => {
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [newActivo, setNewActivo] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Función para manejar la actualización de admisión
    const updateAdmision = async (values) => {
        setLoading(true);
        setError(null);

        try {
            // Aquí deberías colocar la lógica para obtener el producto actual, por ejemplo:
            const currentProduct = await ProductTable.getCurrentProduct(values.product_id); // Ajusta esto según cómo obtengas el producto actual

            // Luego, realizas la actualización
            await axios.put(`${ENV.API_URL}/${ENV.ENDPOINTS.UPDATE}/${currentProduct._id}`, {
                nombre: newName,
                activo: newActivo,
            });

            // Actualizas el estado local de productos si es necesario
            ProductTable.updateProductLocally(currentProduct._id, { nombre: newName, activo: newActivo });

            // Limpia el formulario y cualquier estado necesario
            setNewName('');
            setNewActivo(false);

            // Opcional: Cierra algún modal o control de visibilidad
            // setIsModalVisible(false);

            // Maneja cualquier otro estado local necesario
            // setProducts(...);

        } catch (err) {
            setError('Error al actualizar el producto');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Aquí colocas tu formulario y elementos necesarios */}
            <form onSubmit={updateAdmision}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nuevo nombre"
                />
                <input
                    type="checkbox"
                    checked={newActivo}
                    onChange={(e) => setNewActivo(e.target.checked)}
                />
                <button type="submit" className='actualizar' disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default UpdateForm;
