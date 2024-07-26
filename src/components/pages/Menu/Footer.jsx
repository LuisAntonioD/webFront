import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

const { Footer } = Layout;

const FooterNav = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            <div>
                <Link to="/" style={{ margin: '0 10px', color: 'black' }}>Inicio</Link>
                <Link to="/Admisiones" style={{ margin: '0 10px', color: 'black' }}>Admisiones</Link>
                <Link to="/OfertaEducativa" style={{ margin: '0 10px', color: 'black' }}>Oferta Educativa</Link>
                <Link to="/Usuarios" style={{ margin: '0 10px', color: 'black' }}>Usuarios</Link>
                <Link to="/Profesores" style={{ margin: '0 10px', color: 'black' }}>Profesores</Link>
            </div>
            <div style={{ marginTop: '20px' }}>
                Uteq 2.0 ©2024 Created by TeamAura
            </div>
        </Footer>
    );
};

export default FooterNav;
