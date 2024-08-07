import React, { useState, useEffect, useContext } from 'react';
import { Drawer, Avatar, Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import loginImage from '../../assets/perfil.png';
import './DrawerComponent.css';

const DrawerComponent = ({ open, onClose }) => {
    const { user, updateUserData } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                newPassword: '',
                confirmNewPassword: ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            message.error('Las contraseñas no coinciden');
            return;
        }

        const updatedUserData = {
            username: formData.username,
            email: formData.email,
        };

        if (formData.newPassword) {
            updatedUserData.password = formData.newPassword;
        }

        try {
            await updateUserData(updatedUserData);
            setEditMode(false);
            onClose();
            message.success('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error al actualizar los datos del usuario:', error);
            message.error('Error al actualizar los datos del usuario');
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <Drawer title="Perfil de Usuario" onClose={onClose} open={open}>
            {user ? (
                <div style={{ padding: '20px' }}>
                    <center>
                        <img src={loginImage} alt="perfil" className="profile-image" />
                    </center>
                    <Form layout="vertical">
                        <Form.Item label="Nombre">
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </Form.Item>
                        {editMode && (
                            <>
                                <Form.Item label="Nueva Contraseña">
                                    <Input.Password
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Confirmar Nueva Contraseña">
                                    <Input.Password
                                        name="confirmNewPassword"
                                        value={formData.confirmNewPassword}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item>
                            {editMode ? (
                                <>
                                    <Button type="primary" onClick={handleSubmit} className='guardar'>
                                        Guardar
                                    </Button>
                                    <Button onClick={() => setEditMode(false)} className='cancelar'>
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <Button  onClick={toggleEditMode} className='editar'>
                                    Editar
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            ) : (
                <p>Error</p>
            )}
        </Drawer>
    );
};

export default DrawerComponent;
