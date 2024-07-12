import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Modal, notification, Form, Input, DatePicker } from 'antd';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import ofertaEducativaService from '../../../services/OfertaEducativaService';
import { AuthContext } from '../../context/AuthContext';
import '../OfertasTabla/OfertasTable.css';

const OfertasEducativasTable = () => {
    const [ofertas, setOfertas] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEmailUnique, setIsEmailUnique] = useState(true);
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchOfertas();
    }, []);

    const fetchOfertas = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}`);
            if (Array.isArray(response.data)) {
                const filteredOfertas = response.data.filter(o => o._id !== user._id);
                setOfertas(filteredOfertas);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const deleteOferta = async (id) => {
        try {
            await ofertaEducativaService.deleteOferta(id, token);
            fetchOfertas();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar la oferta');
            console.error(error);
        }
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Oferta Eliminada',
            description: 'Oferta eliminada correctamente.',
        });
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const confirmDeleteOferta = (id) => {
        if (id === user._id) {
            showErrorNotification('No puedes eliminar tu propia cuenta.');
            return;
        }

        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar esta oferta?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteOferta(id);
            },
        });
    };

    const handleAddOfertaEducativa = async (values) => {
        try {
            const newOferta = {
                ...values,
                activo: true,
            };
            await ofertaEducativaService.addOfertaEducativa(newOferta, token);
            fetchOfertas();
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Oferta Agregada',
                description: 'Oferta agregada correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al agregar la oferta');
            console.error(error);
        }
    };

    const handleEditOferta = async (values) => {
        try {
            const updatedOferta = {
                ...values,
                nombre: values.nombre.charAt(0).toUpperCase() + values.nombre.slice(1).toLowerCase(),
                apellidos: values.apellidos.split(' ').map(apellido => apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase()).join(' '),
                fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
            };
            await ofertaEducativaService.updateOferta(currentUser._id, updatedOferta, token);
            fetchOfertas();
            setIsModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentUser(null);
            notification.success({
                message: 'Oferta Actualizada',
                description: 'Oferta actualizada correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al actualizar la oferta');
            console.error(error);
        }
    };

    const showEditModal = (oferta) => {
        setCurrentUser(oferta);
        setIsEditing(true);
        setIsModalVisible(true);
        form.setFieldsValue({
            nombre: oferta.nombre,
            apellidos: oferta.apellidos,
            numeroEmpleado: oferta.numeroEmpleado,
            correo: oferta.correo,
            fechaNacimiento: oferta.fechaNacimiento ? moment(oferta.fechaNacimiento) : null,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentUser(null);
        setIsEmailUnique(true);
        form.resetFields();
    };

    const validateFechaNacimiento = (_, value) => {
        if (!value) {
            return Promise.reject('Por favor selecciona la fecha de nacimiento');
        }
        const ageLimitDate = moment().subtract(18, 'years');
        if (value.isAfter(ageLimitDate, 'day')) {
            return Promise.reject('El profesor debe ser mayor de 18 años');
        }
        return Promise.resolve();
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="ofertas-educativas-table-page">
                     <div className="buttons-container">
                <Button
                    className="add-button"
                    type="primary"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Agregar Oferta
                </Button>
            </div>
            <div className="table-container">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Activo</th>
                            <th>Fecha de Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ofertas.map((oferta) => (
                            <tr key={oferta._id}>
                                <td>{oferta.nombre}</td>
                                <td>{oferta.activo ? 'Sí' : 'No'}</td>
                                <td>{new Date(oferta.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button
                                        className="action-button ant-btn-danger"
                                        onClick={() => confirmDeleteOferta(oferta._id)}
                                        icon={<RiDeleteBin6Line />}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className="action-button ant-btn-success"
                                        onClick={() => showEditModal(oferta)}
                                    >
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title={isEditing ? "Editar oferta" : "Agregar oferta"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={isEditing ? handleEditOferta : handleAddOfertaEducativa}
                >
                    {/* Form items for adding/editing oferta educativa */}
                </Form>
            </Modal>
        </div>
    );
};

export default OfertasEducativasTable;

