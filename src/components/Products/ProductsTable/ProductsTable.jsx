import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Switch, notification, Table } from 'antd';
import { RiDeleteBin6Line, RiEdit2Line, RiAddLine, RiEyeLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import './ProductsTable.css';
import authService from '../../../services/admisiones';
import ofertaEducativaService from '../../../services/OfertaEducativaService'; // Importa el servicio para obtener ofertas educativas
import { AuthContext } from '../../context/AuthContext';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newName, setNewName] = useState('');
    const [newActivo, setNewActivo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [relatedOffers, setRelatedOffers] = useState([]); // Estado para las ofertas educativas
    const [isOffersModalVisible, setIsOffersModalVisible] = useState(false); // Estado para el modal de ofertas educativas
    const [noOffersMessage, setNoOffersMessage] = useState(''); // Estado para el mensaje de no ofertas
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

    const fetchRelatedOffers = async (admisionId) => {
        try {
            const response = await ofertaEducativaService.getRelatedOffers(admisionId);
            if (Array.isArray(response.data)) {
                setRelatedOffers(response.data);
                if (response.data.length === 0) {
                    setNoOffersMessage('No hay ofertas educativas en esta admisión');
                } else {
                    setNoOffersMessage('');
                }
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener las ofertas educativas');
            console.error(err);
        }
    };

    const addAdmision = async (values) => {
        setLoading(true);
        try {
            await authService.addProduct(values.newName, values.newActivo, token);
            fetchProducts();
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const editAdmision = async (id, values) => {
        setLoading(true);
        try {
            await authService.editProduct(id, values.newName, values.newActivo, token);
            fetchProducts();
            showEditNotification();
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdmision = async (id) => {
        setLoading(true);
        try {
            await authService.deleteProduct(id, token);
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
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Admisión Eliminada',
            description: 'La admisión ha sido eliminada correctamente.',
        });
    };

    const showEditNotification = () => {
        notification.success({
            message: 'Admisión Editada',
            description: 'Los cambios han sido guardados correctamente para la admisión.',
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
            addAdmision(values);
        } else if (modalMode === 'edit' && currentProduct) {
            editAdmision(currentProduct._id, values);
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

    const confirmDeleteAdmision = (id) => {
        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar esta admisión?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteAdmision(id);
            },
        });
    };

    const showOffersModal = async (admisionId) => {
        await fetchRelatedOffers(admisionId);
        setIsOffersModalVisible(true);
    };

    const handleOffersModalCancel = () => {
        setIsOffersModalVisible(false);
        setNoOffersMessage(''); // Limpia el mensaje al cerrar el modal
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return <div>{error}</div>;
    }

    const offersColumns = [
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Estado', dataIndex: 'activo', key: 'activo', render: (activo) => (activo ? 'Activo' : 'Inactivo') },
        { title: 'Fecha de Creación', dataIndex: 'createdAt', key: 'createdAt', render: (createdAt) => formatDate(createdAt) },
        { title: 'Fecha de Actualización', dataIndex: 'updatedAt', key: 'updatedAt', render: (updatedAt) => formatDate(updatedAt) },
    ];

    const columns = [
        { title: 'ID', dataIndex: '_id', key: '_id' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Estado', dataIndex: 'activo', key: 'activo', render: (activo) => (activo ? 'Activo' : 'Inactivo') },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <div className="actions">
                    <Button icon={<RiEyeLine />} onClick={() => showOffersModal(record._id)} />
                    <Button icon={<RiEdit2Line />} onClick={() => showModal('edit', record)} />
                    <Button icon={<RiDeleteBin6Line />} onClick={() => confirmDeleteAdmision(record._id)} />
                </div>
            ),
        },
    ];

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
                        Agregar Admisión
                    </Button>
                </div>
            )}
            <div className="table-container table-wrapper">
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
                                                className="action-button ant-btn-danger"
                                                onClick={() => confirmDeleteAdmision(product._id)}
                                                icon={<RiDeleteBin6Line />}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button
                                                className="action-button ant-btn-success"
                                                onClick={() => showModal('edit', product)}
                                                icon={<RiEdit2Line />}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                className="action-button consultar-button"
                                                onClick={() => showOffersModal(product._id)}
                                                icon={<RiEyeLine />}
                                            >
                                                Consultar 
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
                title={modalMode === 'add' ? 'Agregar Admisión' : 'Editar Admisión'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                <Input
                    placeholder="Nombre"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <Switch
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                    checked={newActivo}
                    onChange={(checked) => setNewActivo(checked)}
                />
            </Modal>
            <Modal
                title="Ofertas Educativas Relacionadas"
                visible={isOffersModalVisible}
                onCancel={handleOffersModalCancel}
                footer={[
                    <Button key="close" onClick={handleOffersModalCancel}>
                        Cerrar
                    </Button>,
                ]}
            >
                {noOffersMessage ? (
                    <p>{noOffersMessage}</p>
                ) : (
                    <Table
                        columns={offersColumns}
                        dataSource={relatedOffers}
                        rowKey="_id"
                        pagination={false}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductsTable;
