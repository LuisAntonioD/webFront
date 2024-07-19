import React, { useState } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, BookFilled, UserOutlined } from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom";
import logo from '../../../assets/uteq3.png';
import DrawerComponent from '../../Drawer';
import ProfesoresTable from '../../OfertasEducativas/OfertasTabla/OfertasEducativasTable'; // Ajusta la importación según la estructura de tu proyecto
import { useAuth } from '../../../hooks/useAuth'; // Asegúrate de importar useAuth si lo necesitas

const { Header, Sider, Content, Footer } = Layout;

const OfertaEducativaPage = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false); // Define collapsed como estado local
    const { colorBgContainer } = theme.useToken().token;
    const navigate = useNavigate();
    const [drawerVisible, setDrawerVisible] = useState(false); // Estado para controlar la visibilidad del drawer

    const handleLogoClick = () => {
        setSelectedKey('');
    };

    const handleMenuClick = (key) => {
        switch (key) {
            case '1':
                navigate('/');
                break;
            case '2':
                navigate('/Admisiones');
                break;
            case '4':
                navigate('/Usuarios');
                break;
            case '5':
                navigate('/Profesores');
                break;
            case '6':
                navigate('/OfertaEducativa');
                break;
            case '7':
                setDrawerVisible(true); // Abre el drawer
                break;
            default:
                break;
        }
    };

    const handleDrawerClose = () => {
        setDrawerVisible(false); // Cierra el drawer
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {user && (
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Link to="/" className="logo" onClick={handleLogoClick}>
                        <img src={logo} alt="logo" />
                    </Link>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        onClick={({ key }) => handleMenuClick(key)}
                        items={[
                            { key: '1', icon: <HomeOutlined />, label: 'Inicio' },
                            { key: '2', icon: <BookFilled />, label: 'Admisiones' },
                            { key: '4', icon: <UserOutlined />, label: 'Usuarios' },
                            { key: '5', icon: <UserOutlined />, label: 'Profesores' }, 
                            { key: '6', icon: <UserOutlined />, label: 'OfertaEducativa' }, 
                            { key: '7', icon: <UserOutlined />, label: `${user.username}` }, // Usa un ícono adecuado
                        ]}
                    />
                    <div className="spacer" />
                    <Button
                        className="logout-button"
                        onClick={() => logout()}
                        icon={<LogoutOutlined />}
                        style={{ width: '100%', textAlign: 'left', paddingLeft: '24px', paddingTop: '12px', paddingBottom: '12px' }}
                    >
                        Logout
                    </Button>
                </Sider>
            )}
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
                    <div className="profesores-page-container">
                        <ProfesoresTable /> {/* Muestra la tabla de profesores */}
                    </div>
                    <Footer style={{ textAlign: 'center' }}>
                        <div>
                            <Link to="/" style={{ margin: '0 10px', color: 'black' }}>Inicio</Link>
                            <Link to="/Admisiones" style={{ margin: '0 10px', color: 'black' }}>Admisiones</Link>
                            <Link to="/servicios" style={{ margin: '0 10px', color: 'black' }}>Servicios</Link>
                            <Link to="/Usuarios" style={{ margin: '0 10px', color: 'black' }}>Usuarios</Link>
                            <Link to="/Profesores" style={{ margin: '0 10px', color: 'black' }}>Profesores</Link>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            Uteq 2.0 ©2024 Created by TeamAura
                        </div>
                    </Footer>
                </Content>
            </Layout>
            <DrawerComponent visible={drawerVisible} onClose={handleDrawerClose} /> {/* Añade el drawer */}
        </Layout>
    );
};

export default OfertaEducativaPage;
