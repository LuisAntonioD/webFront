import React, { useState, useEffect, useContext } from 'react';
import { Drawer, Avatar, Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import loginImage from '../../assets/perfil.png';

const DrawerComponent = () => {
    const { user, updateUserData } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
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

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

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
        <>
            <Avatar
                onClick={showDrawer}
                size={44}
                style={{ backgroundColor: '#87d68', cursor: 'pointer', marginLeft: '20px' }}
                icon={<UserOutlined />}
            />
            <Drawer title="Perfil de Usuario" onClose={onClose} visible={open}>
                {user ? (
                    <div style={{ padding: '20px' }}>
                        <center>
                            <img src={loginImage} alt="perfil" style={{ width: '150px', height: 'auto', marginBottom: '10px' }} />
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
                                        <Button type="primary" onClick={handleSubmit}>
                                            Guardar
                                        </Button>
                                        <Button onClick={() => setEditMode(false)} style={{ marginLeft: '10px' }}>
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <Button type="primary" onClick={toggleEditMode}>
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
        </>
    );
};

export default DrawerComponent;
