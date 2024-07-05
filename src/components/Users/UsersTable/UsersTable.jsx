import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Form, Input, Select } from 'antd';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import usersService from '../../../services/users';
import { AuthContext } from '../../context/AuthContext';
import './UsersTable.css';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // Estado para almacenar roles
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm(); // Formulario para agregar usuario

    useEffect(() => {
        fetchUsers();
        fetchRoles(); // Obtener roles al montar el componente
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.USER}`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
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
        console.log("ID del usuario a eliminar:", id);
        console.log("ID del usuario en sesión:", user._id);
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

    // Agregar usuario
    const handleAddUser = async (newUser) => {
        try {
            console.log(newUser); // Verifica qué valores llegan aquí
    
            
    
            console.log('Datos a enviar al crear usuario:', newUser);
    
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
    
    
    // Agrega usuario fin

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                    onClick={() => setIsModalVisible(true)} // Mostrar el modal al hacer clic
                >
                    Agregar Usuario
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
                                    <Button className="action-button ant-btn-success">
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal para agregar usuario */}
            <Modal
                title="Agregar Usuario"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddUser}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}
                    >
                        <Input placeholder="Nombre de usuario" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Por favor ingrese el correo electrónico' }]}
                    >
                        <Input type="email" placeholder="Correo electrónico" />
                    </Form.Item>
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

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Agregar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal para agregar usuario fin */}
        </div>
    );
};

export default UsersTable;
