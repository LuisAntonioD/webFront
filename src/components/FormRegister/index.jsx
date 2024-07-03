import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.js';
import { validatePassword } from '../../utils/validation.js';
import './FormRegister.css'; // Importa el archivo CSS

const FormRegister = () => {
    const navigate = useNavigate();

    const [registroError, setRegisterError] = useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await authService.register(values.username, values.email, values.password);
            navigate('/login');
        } catch (error) {
            if (error.response) {
                console.error('Error en el registro:', error.response.data);
            } else {
                console.error('Error en el registro:', error.message);
            }
            setRegisterError(true);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        setRegisterError(true);
    };

    return (
        <Card
            title="Registro"
            bordered={false}
            className='responsive-card'
        >
            <Form
                name='normal_login'
                className='register-form'
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name='username'
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese su usuario',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder='Nombre de usuario' />
                </Form.Item>

                <Form.Item
                    name='email'
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese su correo',
                        },
                        {
                            type: 'email',
                            message: 'El correo no es válido',
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder='Correo electrónico' />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese su contraseña',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder='Contraseña' />
                </Form.Item>

                <Form.Item
                    name='password-repeat'
                    rules={[
                        {
                            required: true,
                            message: 'Confirme su contraseña',
                        },
                        ({ getFieldValue }) => validatePassword({ getFieldValue }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder='Confirme contraseña' />
                </Form.Item>

                <Form.Item>
                    {registroError && <p style={{ color: 'red' }}>Fallo en el registro</p>}
                    <Button type='primary' htmlType='submit' className='login-form-button' loading={loading}>
                        Registrate
                    </Button>
                </Form.Item>
                ¿Ya tienes cuenta? <a href='/login'>Inicia sesión</a>
            </Form>
        </Card>
    );
};

export default FormRegister;
