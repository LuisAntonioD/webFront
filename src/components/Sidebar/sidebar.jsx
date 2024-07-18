import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, BookFilled, FireFilled, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import DrawerComponent from '../Drawer/index'; // Asegúrate de que este componente esté correctamente importado
import logo from '../../assets/uteq3.png';

const { Sider } = Layout;

const Sidebar = ({ collapsed, handleLogoClick, handleMenuClick, user, logout, currentPage }) => {
  const menuItems = [
    { key: '1', icon: <HomeOutlined />, label: 'Inicio' },
    { key: '2', icon: <BookFilled />, label: 'Admisiones' },
    { key: '3', icon: <FireFilled />, label: 'Servicios' },
    { key: '4', icon: <UserOutlined />, label: 'Usuarios' },
    { key: '5', icon: <UserOutlined />, label: 'Profesores' },
  ];

  if (user.role === 'admin' || currentPage === 'Profesores') {
    menuItems.push({ key: '6', icon: <ReadOutlined />, label: 'Oferta educativa' });
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <Link to="/" className="logo" onClick={handleLogoClick}>
        <img src={logo} alt="logo" />
      </Link>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        onClick={({ key }) => handleMenuClick(key)}
        items={menuItems}
      />
      <div style={{ flex: 1 }}></div>
      <Menu
        theme="dark"
        mode="inline"
        onClick={({ key }) => handleMenuClick(key)}
        items={[
          { key: '7', icon: <DrawerComponent />, label: user.username ? user.username : 'Perfil' },
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
  );
};

export default Sidebar;
