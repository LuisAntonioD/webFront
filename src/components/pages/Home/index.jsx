  import React, { useState } from 'react';
  import { useAuth } from '../../../hooks/useAuth';
  import { Button, Layout, Menu, theme } from 'antd';
  import { LogoutOutlined, 
      MenuFoldOutlined, 
    MenuUnfoldOutlined,
    HomeOutlined,
    BookFilled,
    FireFilled,
    UserOutlined,
      } from '@ant-design/icons'; // Importamos el icono de logout
  import './Home.css'; // Importamos el archivo CSS para los estilos
  import { useNavigate, Link } from "react-router-dom";
  import logo from '../../../assets/uteq3.png';
  import DrawerComponent from '../../Drawer';
  import Carrousel from '../Carousel/Carusel';

import SidebarMenu from '../Menu/SidebarMenu';
import { useMenuConfig } from '../Menu/HandleMenu';
import FooterNav  from '../Menu/Footer.jsx';

  const { Header,Content } = Layout;

  const Home = () => {
      const { user, logout } = useAuth();
      const [collapsed, setCollapsed] = useState(false);
    const { colorBgContainer, borderRadiusLG } = theme.useToken().token;
    const handleMenuClick = useMenuConfig();

  

    return (
      <Layout style={{ minHeight: '100vh' }}>
            {user && (
                <>
                    <SidebarMenu 
                        user={user} 
                        collapsed={collapsed} 
                        setCollapsed={setCollapsed} 
                        handleMenuClick={handleMenuClick} 
                        logout={logout} 
                    />
                </>
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
            <FooterNav/>
          </Content>
          
        </Layout>
        
      </Layout>
    );
  };

  export default Home;
