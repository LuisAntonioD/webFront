import React from 'react';
import { Link } from "react-router-dom";
import { Menu, Button, Layout } from 'antd';
import { LogoutOutlined, HomeOutlined, BookFilled, FireFilled, UserOutlined } from '@ant-design/icons';
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
                onClick={({ key }) => handleMenuClick(key)}
                items={[
                    { key: '1', icon: <HomeOutlined />, label: 'Inicio' },
                    { key: '2', icon: <BookFilled />, label: 'Admisiones' },
                    { key: '3', icon: <FireFilled />, label: 'Servicios' },
                    { key: '4', icon: <UserOutlined />, label: 'Usuarios' },
                    { key: '5', icon: <UserOutlined />, label: 'Profesores' },
                    { key: '6', icon: <UserOutlined />, label: 'OfertaEducativa' },
                ]}
            />
            <div style={{ flex: 1 }}></div>
            <Menu
                theme="dark"
                mode="inline"
                onClick={({ key }) => {
                    if (key === '7') {
                        handleDrawerOpen();
                    } else {
                        handleMenuClick(key);
                    }
                }}
                items={[
                    {
                        key: '7',
                        icon: <UserOutlined />,
                        label: user ? `${user.username}` : 'Cargando...',
                    },
                ]}
            />
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
