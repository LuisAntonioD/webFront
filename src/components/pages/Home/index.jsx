import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons'; // Importamos el icono de logout

import './Home.css'; // Importamos el archivo CSS para los estilos

const Home = () => {
    const { user, logout } = useAuth();

    return (
        <div className="home-page">
            <div className="home-container">
                <h1>Bienvenido a tu página de inicio</h1>
                <p>Estás en casa, {user.username}</p>
                <Button className="logout-button" onClick={() => logout()} icon={<LogoutOutlined />}>
                    Cerrar sesión
                </Button>
            </div>
        </div>
    );
};

export default Home;
