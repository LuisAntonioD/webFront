import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Input } from 'antd';
import { RiDeleteBin6Line, RiEdit2Line, RiAddLine } from 'react-icons/ri';
import { ENV } from '../../utils/constants';
import MateriasForm from '../Materias/MateriasForm/MateriasForm';
import { AuthContext } from '../context/AuthContext';
import '../Admisiones/ProductsForm/ProductsForm.css'; // Reutilizar estilos

const MateriasTable = () => {
    const { token } = useContext(AuthContext);
    const [materias, setMaterias] = useState([]);
    const [editingMateria, setEditingMateria] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchMaterias();
    }, [token]);

    const fetchMaterias = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMaterias(response.data);
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar las materias.',
            });
        }
    };

    const handleAdd = () => {
        setEditingMateria(null);
        setIsModalVisible(true);
    };

    const handleEdit = (materia) => {
        setEditingMateria(materia);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMaterias();
            notification.success({
                message: 'Éxito',
                description: 'Materia eliminada correctamente.',
            });
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'Error al eliminar la materia.',
            });
        }
    };

    const confirmDeleteMateria = (id) => {
        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar esta materia?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal', // Estilo consistente con ProductsTable
            onOk() {
                handleDelete(id);
            },
            onCancel() {
                setEditingMateria(null);
            },
        });
    };

    const handleSave = async () => {
        setIsModalVisible(false);
        fetchMaterias();
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredMaterias = materias.filter((materia) =>
        materia.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    const formatOfertas = (ofertas) => {
        return ofertas.map((oferta) => oferta.nombre).join(', ');
    };

    return (
        <div className="products-table-page"> {/* Utiliza el mismo contenedor */}
            <div className="buttons-container">
                <Button className="add-button" type="primary" onClick={handleAdd} icon={<RiAddLine />}>
                    Agregar Materia
                </Button>
                <Input
                    placeholder="Buscar ..."
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 20, width: '200px' }}
                />
            </div>
            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Ofertas Educativas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaterias.map((materia) => (
                            <tr key={materia._id}>
                                <td>{materia._id}</td>
                                <td>{materia.nombre}</td>
                                <td>{materia.descripcion}</td>
                                <td>{formatOfertas(materia.ofertasEducativas)}</td>
                                <td>
                                    <Button
                                        icon={<RiEdit2Line />}
                                        onClick={() => handleEdit(materia)}
                                        className="action-button ant-btn-success"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        icon={<RiDeleteBin6Line />}
                                        onClick={() => confirmDeleteMateria(materia._id)}
                                        className="action-button ant-btn-danger"
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={editingMateria ? 'Editar Materia' : 'Agregar Materia'}
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal" // Reutiliza estilos de modal
            >
                <MateriasForm currentMateria={editingMateria} onSave={handleSave} />
            </Modal>
        </div>
    );
};

export default MateriasTable;
