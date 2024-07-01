import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import DrawerComponent from '../Drawer/index'; // Asegúrate de que la ruta es correcta
const { Header } = Layout;

import logo from '../../assets/uteq3.png';
import './Navbar.css'; // Importa el archivo CSS

const Navbar = () => {
    const [selectedKey, setSelectedKey] = useState('1');

    const handleLogoClick = () => {
        setSelectedKey('');
    };

    const tabNames = ["Inicio", "Admisiones", "Servicios", "Contactos"];

    const items = tabNames.map((name, index) => ({
        key: index + 1,
        label: name,
        url: index === 0 ? "/" : `/${name.toLowerCase()}`,
    }));

    return (
        <>
            <Header className='header-content'>
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={handleLogoClick}>
                    <img src={logo} alt="logo" />
                </Link>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[selectedKey]}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {items.map(item => (
                        <Menu.Item key={item.key} onClick={() => setSelectedKey(item.key)}>
                            <Link to={item.url} className='menu-link'>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
                <DrawerComponent />
            </Header>
        </>
    );
};

export default Navbar;
