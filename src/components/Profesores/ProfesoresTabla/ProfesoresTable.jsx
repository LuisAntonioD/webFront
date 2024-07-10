import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification } from 'antd';
import { RiDeleteBin6Line, RiAddLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import profesorService from '../../../services/profesorService';
import { AuthContext } from '../../context/AuthContext';
import NewProfesorForm from '../../../components/Profesores/ProfesoresTabla/Profesores/newProfesor';

const ProfesoresTable = () => {
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchProfesores();
    }, []);

    const fetchProfesores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
            setProfesores(response.data);
        } catch (error) {
            console.error('Error fetching profesores:', error);
        } finally {
            setLoading(false);
        }
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Eliminado',
            description: 'Profesor eliminado correctamente.',
        });
    };

    const deleteProfesor = async (id) => {
        try {
            await profesorService.deleteProfesor(id, token);
            fetchProfesores();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar el usuario');
            console.error(error);
        }
    };

    const confirmDeleteProfesor = (id) => {
        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar a este profesor?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteProfesor(id);
            },
        });
    };

    const showModalAdd = () => {
        setIsModalAddOpen(true);
    };

    const handleCancelAddProfesor = () => {
        setIsModalAddOpen(false);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="users-table-page">
            <div className="buttons-container">
                <Button
                    className="add-button"
                    type="primary"
                    icon={<RiAddLine />}
                    onClick={showModalAdd}
                >
                    Agregar Usuario
                </Button>
            </div>
            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Correo</th>
                            <th>No. empleado</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profesores.map((prof) => (
                            <tr key={prof._id}>
                                <td>{prof.nombre}</td>
                                <td>{prof.apellidos}</td>
                                <td>{prof.correo}</td>
                                <td>{prof.numeroEmpleado}</td>
                                <td>{formatDate(prof.fechaNacimiento)}</td>
                                <td>
                                    <Button
                                        className="action-button ant-btn-danger"
                                        onClick={() => confirmDeleteProfesor(prof._id)}
                                        icon={<RiDeleteBin6Line />}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className="action-button ant-btn-success"
                                        onClick={() => {/* Lógica para editar profesor aquí */}}
                                    >
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <NewProfesorForm
                visible={isModalAddOpen}
                onCreate={fetchProfesores}
                onCancel={handleCancelAddProfesor}
            />
        </div>
    );
};

export default ProfesoresTable;
