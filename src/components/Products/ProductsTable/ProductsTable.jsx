import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Switch, notification } from 'antd';
import { RiDeleteBin6Line, RiEdit2Line, RiAddLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import './ProductsTable.css'; // Mantener el nombre del archivo CSS
import authService from '../../../services/admisiones';
import { AuthContext } from '../../context/AuthContext';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newName, setNewName] = useState('');
    const [newActivo, setNewActivo] = useState(false);
    const [registroError, setRegisterError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.ADMISION}`);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const addAdmision = async (values) => { // Cambio en el nombre de la función
        setLoading(true);
        try {
            await authService.addProduct(values.newName, values.newActivo, token); // Mantener el nombre de la función del servicio
            fetchProducts();
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const editAdmision = async (id, values) => { // Cambio en el nombre de la función
        setLoading(true);
        try {
            await authService.editProduct(id, values.newName, values.newActivo, token); // Mantener el nombre de la función del servicio
            fetchProducts();
            showEditNotification();
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdmision = async (id) => { // Cambio en el nombre de la función
        setLoading(true);
        try {
            await authService.deleteProduct(id, token); // Mantener el nombre de la función del servicio
            fetchProducts();
            showDeleteNotification();
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApiError = (error) => {
        if (error.response) {
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        setRegisterError(true);
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Admisión Eliminada', // Cambio en el mensaje de notificación
            description: 'La admisión ha sido eliminada correctamente.', // Cambio en el mensaje de notificación
        });
    };

    const showEditNotification = () => {
        notification.success({
            message: 'Admisión Editada', // Cambio en el mensaje de notificación
            description: 'Los cambios han sido guardados correctamente para la admisión.', // Cambio en el mensaje de notificación
        });
    };

    const showModal = (mode, product) => {
        if (mode === 'edit') {
            setCurrentProduct(product);
            setNewName(product.nombre);
            setNewActivo(product.activo);
        } else {
            setCurrentProduct(null);
            setNewName('');
            setNewActivo(false);
        }
        setModalMode(mode);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const values = {
            newName,
            newActivo,
        };

        if (modalMode === 'add') {
            addAdmision(values); // Llamar a la función renombrada
        } else if (modalMode === 'edit' && currentProduct) {
            editAdmision(currentProduct._id, values); // Llamar a la función renombrada
        }

        setIsModalVisible(false);
        setNewName('');
        setNewActivo(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewName('');
        setNewActivo(false);
    };

    const confirmDeleteAdmision = (id) => { // Cambio en el nombre de la función
        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar esta admisión?', // Cambio en el mensaje del modal
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteAdmision(id); // Llamar a la función renombrada
            },
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="products-table-page">
            {user && (
                <div className="buttons-container">
                    <Button
                        className="add-button"
                        type="primary"
                        onClick={() => showModal('add', null)}
                        icon={<RiAddLine />}
                    >
                        Agregar Admisión {/* Cambio en el texto del botón */}
                    </Button>
                </div>
            )}
            <div className="table-container">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fecha de creación</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.nombre}</td>
                                <td>{formatDate(product.createdAt)}</td>
                                <td>{product.activo ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    {user && (
                                        <>
                                            <Button
                                                className="action-button"
                                                type="danger"
                                                onClick={() => confirmDeleteAdmision(product._id)} // Llamar a la función renombrada
                                                icon={<RiDeleteBin6Line />}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button
                                                className="action-button"
                                                type="success"
                                                onClick={() => showModal('edit', product)}
                                                icon={<RiEdit2Line />}
                                            >
                                                Editar
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title={modalMode === 'add' ? 'Agregar Admisión' : 'Editar Admisión'} // Cambio en el título del modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre de la admisión" // Cambio en el placeholder del input
                    style={{ marginBottom: 16 }}
                />
                <br />
                <label style={{ marginRight: 8 }}>Activo:</label>
                <Switch checked={newActivo} onChange={(checked) => setNewActivo(checked)} />
            </Modal>
        </div>
    );
};

export default ProductsTable;
