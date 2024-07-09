import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Input, notification } from 'antd';
import { RiDeleteBin6Line, RiAddLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import profesorService from '../../../services/profesorService';
import { AuthContext } from '../../context/AuthContext';



const ProfesoresTable = () => {
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { user, token } = useContext(AuthContext);



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

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentUser(null);
        setIsEmailUnique(true);
        form.resetFields();
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
                onClick={() => setIsModalVisible(true)}
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
            title={"Agregar"}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}
                >
                    <Input placeholder="Nombre de usuario" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor ingrese el correo electrónico' },
                    ]}
                >
                    <Input
                        type="email"
                        placeholder="Correo electrónico"
                    />
                </Form.Item>
                
                    <>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Por favor ingrese la contraseña' }]}
                        >
                            <Input.Password placeholder="Contraseña" />
                        </Form.Item>
                        
                    </>
            
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        { "Agregar"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>
    );
};

export default ProfesoresTable;
