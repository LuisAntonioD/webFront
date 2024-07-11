import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Form, Input, Select } from 'antd';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import usersService from '../../../services/users';
import { AuthContext } from '../../context/AuthContext';
import { generatePDF } from '../../../utils/pdf';
import './UsersTable.css';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEmailUnique, setIsEmailUnique] = useState(true);
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.USER}`);
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

    const fetchRoles = async () => {
        try {
            const rolesData = await usersService.getRoles();
            setRoles(rolesData);
        } catch (error) {
            setError('Error al obtener los roles');
            console.error(error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await usersService.deleteUser(id, token);
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

    const confirmDeleteUser = (id) => {
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
                deleteUser(id);
            },
        });
    };

    const handleAddUser = async (newUser) => {
        try {
            await usersService.createUser(newUser, token);
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

    const handleEditUser = async (updatedUser) => {
        try {
            await usersService.updateUser(currentUser._id, updatedUser, token);
            fetchUsers();
            setIsModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentUser(null);
            setIsEmailUnique(true);
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
        setIsEmailUnique(true);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentUser(null);
        setIsEmailUnique(true);
        form.resetFields();
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const validateEmail = async (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        const existingUser = users.find(u => u.email === value && (!isEditing || u._id !== currentUser._id));
        if (existingUser) {
            setIsEmailUnique(false);
            return Promise.reject('El correo electrónico ya está registrado');
        }
        setIsEmailUnique(true);
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
                    Agregar Usuario
                </Button>
                <Button
                type="secondary"
                icon={<RiAddLine />}
                onClick={() => generatePDF(users, user)}
            >
                Generar Reporte
            </Button>
            </div>
            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Fecha de creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <Button
                                        className="action-button ant-btn-danger"
                                        onClick={() => confirmDeleteUser(user._id)}
                                        icon={<RiDeleteBin6Line />}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className="action-button ant-btn-success"
                                        onClick={() => showEditModal(user)}
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
                title={isEditing ? "Editar Usuario" : "Agregar Usuario"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={isEditing ? handleEditUser : handleAddUser}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: 'Por favor ingrese el nombre de usuario' },
                            { pattern: /^[a-zA-Z\s]+$/, message: 'El nombre solo debe contener letras y espacios' }
                        ]}                    >
                        <Input placeholder="Nombre de usuario" />
                    </Form.Item>
                    <Form.Item
                        name="email"
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
                        <Input
                            type="email"
                            placeholder="Correo electrónico"
                            disabled={!isEmailUnique && isEditing}
                        />
                    </Form.Item>
                    {!isEditing && (
                        <>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Por favor ingrese la contraseña' }]}
                            >
                                <Input.Password placeholder="Contraseña" />
                            </Form.Item>
                            <Form.Item
                                name="roles"
                                rules={[{ required: true, message: 'Por favor seleccione al menos un rol' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Seleccionar roles"
                                >
                                    {roles.map(role => (
                                        <Select.Option key={role.name} value={role.name}>
                                            {role.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Guardar Cambios" : "Agregar"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersTable;
