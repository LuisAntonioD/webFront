import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Switch, notification, Table } from 'antd';
import { RiDeleteBin6Line, RiEdit2Line, RiAddLine, RiEyeLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import './ProductsTable.css';
import authService from '../../../services/admisiones';
import ofertaEducativaService from '../../../services/OfertaEducativaService';
import { AuthContext } from '../../context/AuthContext';
import { generatePDF } from '../../../utils/pdf';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newName, setNewName] = useState('');
    const [newActivo, setNewActivo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [relatedOffers, setRelatedOffers] = useState([]);
    const [isOffersModalVisible, setIsOffersModalVisible] = useState(false);
    const [noOffersMessage, setNoOffersMessage] = useState('');
    const { user, token } = useContext(AuthContext);
    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.ADMISION}`);
            if (Array.isArray(response.data)) {
                const filteredUsers = response.data.filter(u => u._id !== user._id);
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
                setNoOffersMessage(response.data.length === 0 ? 'No hay ofertas educativas en esta admisión' : '');
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener las ofertas educativas');
            console.error(err);
        }
    };

    const addAdmision = async () => {
        if (!newName.trim()) {
            notification.error({
                message: 'Error',
                description: 'El nombre es requerido.',
            });
            return;
        }

        if (products.some(product => product.nombre === newName.trim())) {
            notification.error({
                message: 'Error',
                description: 'Ya existe una admisión con este nombre.',
            });
            return;
        }

        setLoading(true);
        try {
            await authService.addProduct(newName.trim(), newActivo, token);
            fetchProducts();
            notification.success({
                message: 'Admisión Agregada',
                description: 'La admisión ha sido agregada correctamente.',
            });
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
            handleCancel();
        }
    };

    const editAdmision = async () => {
        if (!newName.trim()) {
            notification.error({
                message: 'Error',
                description: 'El nombre es requerido.',
            });
            return;
        }

        if (products.some(product => product.nombre === newName.trim() && product._id !== currentProduct._id)) {
            notification.error({
                message: 'Error',
                description: 'Ya existe una admisión con este nombre.',
            });
            return;
        }

        setLoading(true);
        try {
            await authService.editProduct(currentProduct._id, newName.trim(), newActivo, token);
            fetchProducts();
            notification.success({
                message: 'Admisión Editada',
                description: 'Los cambios han sido guardados correctamente para la admisión.',
            });
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
            handleCancel();
        }
    };

    const deleteAdmision = async (id) => {
        setLoading(true);
        try {
            await authService.deleteProduct(id, token);
            fetchProducts();
            notification.success({
                message: 'Admisión Eliminada',
                description: 'La admisión ha sido eliminada correctamente.',
            });
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApiError = (error) => {
        notification.error({
            message: 'Error',
            description: error.response ? error.response.data.message : error.message,
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
        if (modalMode === 'add') {
            addAdmision();
        } else if (modalMode === 'edit' && currentProduct) {
            editAdmision();
        }
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
        setNoOffersMessage('');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return <div>{error}</div>;
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    
    const filtraradmisiones = products.filter(
        (product) =>
            product.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            (product.activo ? 'activo' : 'inactivo').toLowerCase().includes(searchText.toLowerCase())
    );
    

    const columns = [
        { title: "ID", dataKey: "_id" },
        { title: "Nombre", dataKey: "nombre" },
        { title: "Fecha de creación", dataKey: "createdAt" },
        { title: "Activo", dataKey: "activo" },
    ];

    const data = filtraradmisiones.map(product => ({
        _id: product._id,
        nombre: product.nombre,
        createdAt: formatDate(product.createdAt),
        activo: product.activo ? 'Activo' : 'Inactivo',
    }));

    

    const offersColumns = [
        { title: "ID", dataIndex: "_id", key: "_id" },
        { title: "Nombre", dataIndex: "nombre", key: "nombre" },
        { title: "Estado", dataIndex: "activo", key: "activo" },
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
                    <Button
                        type="secondary"
                        icon={<RiAddLine />}
                        onClick={() => generatePDF('Reporte de Admisiones', columns, data, user)}
                    >
                        Generar Reporte
                    </Button>
                    <Input
                        placeholder="Buscar por Nombre o Estatus"
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{ marginBottom: 20, width: '300px' }}
                    />
                </div>
            )}
            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtraradmisiones.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.nombre}</td>
                                <td>{product.activo ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    <Button icon={<RiEyeLine />} onClick={() => showOffersModal(product._id)} className="action-button consultar-button"> consultar  </Button>
                                    <Button icon={<RiEdit2Line />} onClick={() => showModal('edit', product)} className="action-button ant-btn-success"> Editar </Button>
                                    <Button icon={<RiDeleteBin6Line />} onClick={() => confirmDeleteAdmision(product._id)} className="action-button ant-btn-danger">Eliminar </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Adding/Editing Admisión */}
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
                <div className="active-switch">
                    <Switch
                        checked={newActivo}
                        onChange={(checked) => setNewActivo(checked)}
                    />
                    <span>{newActivo ? 'Activo' : 'Inactivo'}</span>
                </div>
            </Modal>
            <Modal
                title="Ofertas Educativas Relacionadas"
                visible={isOffersModalVisible}
                onCancel={handleOffersModalCancel}
                footer={null}
            >
                {noOffersMessage ? (
                    <div>{noOffersMessage}</div>
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
