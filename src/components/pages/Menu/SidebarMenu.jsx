import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { Menu, Button, Layout } from 'antd';
import { LogoutOutlined, HomeOutlined, BookFilled, UserOutlined } from '@ant-design/icons';
import DrawerComponent from '../../Drawer';
import logo from '../../../assets/uteq3.png';

const { Sider } = Layout;

const SidebarMenu = ({ user, collapsed, setCollapsed, handleMenuClick, logout }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <Link to="/" className="logo" onClick={() => handleMenuClick('')}>
                <img src={logo} alt="logo" />
            </Link>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                onClick={({ key }) => {
                    if (key !== '7') {
                        handleMenuClick(key);
                    }
                }}
            >
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    <Link to="/">Inicio</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<BookFilled />}>
                    <Link to="/admisiones">Admisiones</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                    <Link to="/usuarios">Usuarios</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined />}>
                    <Link to="/profesores">Profesores</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UserOutlined />}>
                    <Link to="/ofertaeducativa">Oferta Educativa</Link>
                </Menu.Item>

                <Menu.Item key="6" icon={<UserOutlined />}>
                    <Link to="/materias">Materias</Link>
                </Menu.Item>
                <Menu.Item
                    key="7"
                    icon={<UserOutlined />}
                    onClick={handleDrawerOpen}
                >
                    {user ? `${user.username}` : 'Cargando...'}
                </Menu.Item>
            </Menu>
            <DrawerComponent open={drawerOpen} onClose={handleDrawerClose} />
            <div className="spacer" />
            <Button
                className="logout-button"
                onClick={logout}
                icon={<LogoutOutlined />}
                style={{ width: '100%', textAlign: 'left', paddingLeft: '24px', paddingTop: '12px', paddingBottom: '12px' }}
            >
                Logout
            </Button>
        </Sider>
    );
};

export default SidebarMenu;
