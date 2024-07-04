import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './FormLogin.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import { AuthContext } from '../context/AuthContext';

const FormLogin = () => {
    const { login } = useContext(AuthContext); // Obtén la función login del contexto
    const navigate = useNavigate();

    const [loginError, setLoginError] = useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true); // Establece el estado de carga a true al enviar el formulario
        setLoginError(false);

        try {
            const response = await authService.loginForm(values.username, values.password);

            if (response && response.data) {
                const token = response.data.generatedToken; // Accediendo a la clave correcta
                if (token) {
                    localStorage.setItem('token', token);
                    await login(token); // Llama a la función login del contexto
                    navigate('/'); // Redirige al home
                } else {
                    console.error('Token no encontrado en la respuesta:', response.data);
                    setLoginError(true);
                }
            } else {
                console.error('Error en el inicio de sesión: Respuesta inesperada');
                setLoginError(true);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error en el inicio de sesión:', error.response.data);
            } else {
                console.error('Error en el inicio de sesión:', error.message);
            }
            setLoginError(true);
        } finally {
            setLoading(false); // Establece el estado de carga a false después de recibir la respuesta
        }
    };

    const onFinishFailed = (errorInfo) => {
        setLoginError(true);
    };

    return (
        <Card
            title="Bienvenido de nuevo"
            bordered={false}
            className='responsive-card'
        >
            <Form
                name='normal_login'
                className='login-form'
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
                            message: 'Por favor ingrese su usuario'
                        }
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder='Usuario' />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese su contraseña'
                        }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder='Contraseña' />
                </Form.Item>
                <Form.Item>
                    {loginError && <p style={{ color: 'red' }}>Credenciales incorrectas. Inténtalo de nuevo</p>}
                    <Button type='primary' htmlType='submit' className='login-form-button' loading={loading}>
                        Iniciar Sesión
                    </Button>
                </Form.Item>
                ¿Aún no tienes cuenta? <a href='/register'>Regístrate</a>
            </Form>
        </Card>
    );
};

export default FormLogin;
