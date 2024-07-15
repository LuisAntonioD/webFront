import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Modal, notification, Form, Input, DatePicker } from 'antd';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import profesorService from '../../../services/profesorService';
import { AuthContext } from '../../context/AuthContext';

const ProfesoresTable = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEmailUnique, setIsEmailUnique] = useState(true);
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
            if (Array.isArray(response.data)) {
                const filteredUsers = response.data.filter(u => u._id !== user._id);
                setUsers(filteredUsers);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const deleteProfesor = async (id) => {
        try {
            await profesorService.deleteProfesor(id, token);
            fetchUsers();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar el usuario');
            console.error(error);
        }
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Usuario Eliminado',
            description: 'Usuario eliminado correctamente.',
        });
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const confirmDeleteProfesor = (id) => {
        if (id === user._id) {
            showErrorNotification('No puedes eliminar tu propia cuenta.');
            return;
        }

        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar a este usuario?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteProfesor(id);
            },
        });
    };

    const handleAddUser = async (values) => {
        try {
            const newUser = {
                ...values,
                fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
            };
            await profesorService.addProfesor(newUser, token);
            fetchUsers();
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Usuario Agregado',
                description: 'Usuario agregado correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al agregar el usuario');
            console.error(error);
        }
    };
    

    const handleEditUser = async (values) => {
        try {
            const updatedUser = {
                ...values,
                nombre: values.nombre.charAt(0).toUpperCase() + values.nombre.slice(1).toLowerCase(),
                apellidos: values.apellidos.split(' ').map(apellido => apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase()).join(' '),
                fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
            };
            await profesorService.updateUser(currentUser._id, updatedUser, token);
            fetchUsers();
            setIsModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentUser(null);
            notification.success({
                message: 'Usuario Actualizado',
                description: 'Usuario actualizado correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al actualizar el usuario');
            console.error(error);
        }
    };


    const showEditModal = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
        setIsModalVisible(true);
        form.setFieldsValue({
            nombre: user.nombre,
            apellidos: user.apellidos,
            numeroEmpleado: user.numeroEmpleado,
            correo: user.correo,
            fechaNacimiento: user.fechaNacimiento ? moment(user.fechaNacimiento) : null,
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
        <div className="users-table-page">
            <div className="buttons-container">
                <Button
                    className="add-button"
                    type="primary"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Agregar Profesor
                </Button>
            </div>
            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Numero Empleado</th>
                            <th>Correo</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((prof) => (
                            <tr key={prof._id}>
                                <td>{prof.nombre}</td>
                                <td>{prof.apellidos}</td>
                                <td>{prof.numeroEmpleado}</td>
                                <td>{prof.correo}</td>
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
                                        onClick={() => showEditModal(prof)}
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
                title={isEditing ? "Editar Profesor" : "Agregar Profesor"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={isEditing ? handleEditUser : handleAddUser}
                >
                    <Form.Item
                        name="nombre"
                        label="Nombre"
                        rules={[
                            { required: true, message: 'Por favor ingrese el nombre del profesor' },
                            { pattern: /^[a-zA-Z\s]+$/, message: 'El nombre solo debe contener letras y espacios' }
                        ]}
                    >
                        <Input placeholder="Nombre del profesor" />
                    </Form.Item>
                    <Form.Item
                        name="apellidos"
                        label="Apellidos"
                        rules={[
                            { required: true, message: 'Por favor ingrese los apellidos del profesor' },
                            { pattern: /^[a-zA-Z\s]+$/, message: 'Los apellidos solo deben contener letras y espacios' }
                        ]}
                    >
                        <Input placeholder="Apellidos del profesor" />
                    </Form.Item>
                    <Form.Item
                        name="numeroEmpleado"
                        label="Numero de Empleado"
                        rules={[
                            { required: true, message: 'Por favor ingrese el número de empleado' },
                            { pattern: /^\d{10}$/, message: 'El número de empleado debe ser numérico y de 10 dígitos' },
                        ]}
                    >
                        <Input placeholder="Numero de empleado" />
                    </Form.Item>
                    <Form.Item
                        name="correo"
                        label="Correo"
                        rules={[
                            { required: true, message: 'Por favor ingrese el correo electrónico' },
                            { type: 'email', message: 'Por favor ingrese un correo electrónico válido' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const isCurrentEmailUnique = users.every(u => u._id === currentUser?._id || u.correo !== value);
                                    if (isCurrentEmailUnique) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('El correo electrónico ya está en uso');
                                },
                            }),
                        ]}
                    >
                        <Input placeholder="Correo electrónico" />
                    </Form.Item>
                    <Form.Item
                        name="fechaNacimiento"
                        label="Fecha de Nacimiento"
                        rules={[
                            { required: true, message: 'Por favor selecciona la fecha de nacimiento' },
                            { validator: validateFechaNacimiento },
                        ]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="Selecciona la fecha"
                        />
                    </Form.Item>
                    <Form.Item
                        name="telefono"
                        label="Teléfono"
                        rules={[
                            { required: true, message: 'Por favor ingrese el número de teléfono' },
                            // Puedes añadir reglas de validación adicionales aquí según tus requisitos
                        ]}
                    >
                        <Input placeholder="Número de teléfono" />
                    </Form.Item>

                    <Form.Item>
                        <Button key="submit" type="primary" htmlType="submit">
                            {isEditing ? 'Guardar Cambios' : 'Agregar Profesor'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfesoresTable;
