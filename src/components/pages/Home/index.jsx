import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Layout, Menu, theme } from 'antd';
import { LogoutOutlined, 
    MenuFoldOutlined, 
  MenuUnfoldOutlined,
  HomeOutlined,
  BookFilled,
  FireFilled,
  DropboxCircleFilled,
    } from '@ant-design/icons'; // Importamos el icono de logout
import './Home.css'; // Importamos el archivo CSS para los estilos
import { useNavigate, Link } from "react-router-dom";
import logo from '../../../assets/uteq3.png';
import DrawerComponent from '../../Drawer';
import Carrousel from '../Carousel/Carusel';

const { Header, Sider, Content, Footer } = Layout;

const Home = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
  const { colorBgContainer, borderRadiusLG } = theme.useToken().token;
  const navigate = useNavigate();

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
      case '3':
        navigate('/servicios');
        break;
        case '4':
          navigate('/Usuarios');
        break;
        case '5':
          <DrawerComponent/>
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
            { key: '3', icon: <FireFilled />, label: 'Servicios' },
            { key: '4', icon: <DropboxCircleFilled />, label: 'Usuarios' },
            
          ]}
        />
        <div style={{ flex: 1 }}></div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={({ key }) => handleMenuClick(key)}
          items={[
            { key: '5', icon: <DrawerComponent/>, label: `${user.username}` },
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
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </Header>
        <Content
        style={{
              
          overflowX: 'auto', // Scroll horizontal
          overflowY: 'auto', // Scroll vertical
          maxHeight: 'calc(100vh - 64px)', // Altura máxima
        }}>
          <div className="home-page">
            <div className="home-container">
              <h1>Bienvenido a tu página de inicio</h1>
              <p>Estás en casa, {user.username}</p>
              <Carrousel />
            </div>
          </div>
          <Footer style={{ textAlign: 'center', marginTop:85  }}>
            <div>
                <Link to="/" style={{ margin: '0 10px', color:'black' }}>Inicio</Link>
                <Link to="/Admisiones" style={{ margin: '0 10px', color:'black' }}>Admisiones</Link>
                <Link to="/servicios" style={{ margin: '0 10px', color:'black' }}>Servicios</Link>
            </div>
            <div style={{ marginTop: '16px' }}>
                Uteq 2.0 ©2024 Created by TeamAura
            </div>
        </Footer>
        </Content>
        
      </Layout>
      
    </Layout>
  );
};

export default Home;
