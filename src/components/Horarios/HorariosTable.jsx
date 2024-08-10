import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Form, Input, DatePicker, TimePicker } from 'antd';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { ENV } from '../../utils/constants';
import horariosService from '../../services/horarios';
import { AuthContext } from '../context/AuthContext';
import './HorariosTable.css';

const HorariosTable = () => {
    const [horarios, setHorarios] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentHorario, setCurrentHorario] = useState(null);
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchHorarios();
        fetchProfesores();
    }, []);

    const fetchHorarios = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}`);
            if (Array.isArray(response.data)) {
                const filteredHorarios = response.data.filter(h => h._id !== user._id);
                setHorarios(filteredHorarios);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const fetchProfesores = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
            if (Array.isArray(response.data)) {
                const filteredProfesores = response.data.filter(p => p._id !== user._id);
                setProfesores(filteredProfesores);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const deleteHorario = async (id) => {
        try {
            await horariosService.deleteHorario(id, token);
            fetchHorarios();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar el horario');
            console.error(error);
        }
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Horario Eliminado',
            description: 'Horario eliminado correctamente.',
        });
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const confirmDeleteHorario = (id) => {
        if (id === user._id) {
            showErrorNotification('No puedes eliminar tu propio horario.');
            return;
        }

        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar este horario?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal',
            onOk() {
                deleteHorario(id);
            },
        });
    };

    const handleAddHorario = async (values) => {
        const { dia, horaInicio, horaFin } = values;
        if (!dia || !horaInicio || !horaFin) {
            notification.error({
                message: 'Error',
                description: 'El día y las horas de inicio y fin son requeridos.',
            });
            return;
        }
        try {
            await horariosService.addHorario({ dia, horaInicio, horaFin }, token);
            fetchHorarios();
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Horario Agregado',
                description: 'Horario agregado correctamente.',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un problema al agregar el horario.',
            });
            console.error('Error al agregar el horario:', error);
        }
    };

    const handleEditHorario = async (values) => {
        const { dia, horaInicio, horaFin, profesores } = values;
        try {
            const updatedHorario = {
                dia,
                horaInicio,
                horaFin,
                profesores: profesores || [],
            };
            await horariosService.editHorario(currentHorario._id, updatedHorario, token);
            fetchHorarios();
            setIsModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentHorario(null);
            notification.success({
                message: 'Horario Actualizado',
                description: 'Horario actualizado correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al actualizar el horario');
            console.error(error);
        }
    };

    const showEditModal = (horario) => {
        setCurrentHorario(horario);
        setIsEditing(true);
        setIsModalVisible(true);
        form.setFieldsValue({
            dia: horario.dia,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            profesores: horario.profesores.map(prof => prof._id),
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentHorario(null);
        form.resetFields();
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredHorarios = horarios.filter(
        (horario) =>
            horario.dia.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="horarios-table-page">
            <div className="buttons-container">
                <Button
                    className="add-button"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Nuevo Horario
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
                            <th>Día</th>
                            <th>Hora de Inicio</th>
                            <th>Hora de Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHorarios.map((horario) => (
                            <tr key={horario._id}>
                                <td>{horario.dia}</td>
                                <td>{horario.horaInicio}</td>
                                <td>{horario.horaFin}</td>
                                <td>
                                    <Button
                                        className="action-button ant-btn-danger"
                                        onClick={() => confirmDeleteHorario(horario._id)}
                                        icon={<RiDeleteBin6Line />}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className="action-button ant-btn-success"
                                        onClick={() => showEditModal(horario)}
                                        icon={<RiEdit2Line />}
                                    >
                                        Editar/Agregar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title={isEditing ? "Editar Horario" : "Nuevo Horario"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={isEditing ? handleEditHorario : handleAddHorario}
                >
                    <Form.Item
                        label="Día"
                        name="dia"
                        rules={[
                            { required: true, message: 'Por favor selecciona un día' },
                        ]}
                    >
                        <DatePicker placeholder="Selecciona un día" />
                    </Form.Item>
                    <Form.Item
                        label="Hora de Inicio"
                        name="horaInicio"
                        rules={[
                            { required: true, message: 'Por favor selecciona la hora de inicio' },
                        ]}
                    >
                        <TimePicker placeholder="Hora de inicio" format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        label="Hora de Fin"
                        name="horaFin"
                        rules={[
                            { required: true, message: 'Por favor selecciona la hora de fin' },
                        ]}
                    >
                        <TimePicker placeholder="Hora de fin" format="HH:mm" />
                    </Form.Item>
                    {!isEditing && (
                        <Form.Item
                            label="Profesores"
                            name="profesores"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Selecciona profesores"
                                options={profesores.map(prof => ({ label: prof.nombre, value: prof._id }))}
                            />
                        </Form.Item>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Guardar Cambios" : "Agregar Horario"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HorariosTable;
