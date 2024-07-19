
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import SidebarMenu from '../Menu/SidebarMenu';
import { useMenuConfig } from '../Menu/HandleMenu';
import FooterNav  from '../Menu/Footer.jsx';
import UsersTable from '../../Users/UsersTable/UsersTable';
//import './UsersPage.css'; // Si tienes estilos específicos para esta página


const { Header, Content } = Layout;

const UsersPage = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
  const { colorBgContainer, borderRadiusLG } = theme.useToken().token;
  const handleMenuClick = useMenuConfig();
  
    return (
    <Layout style={{ minHeight: '100vh' }}>
        {user && (
                <>
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

          ]}
          />
          <div style={{ flex: 1 }}></div>
          <Menu
            theme="dark"
            mode="inline"
            onClick={({ key }) => handleMenuClick(key)}
            items={[
              { key: '6', icon: <DrawerComponent/>, label: `${user.username}` },
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
              
              overflowX: 'auto', 
              overflowY: 'auto', 
              maxHeight: 'calc(100vh - 64px)',
            }}
          >
        <div className="products-page-container">
            {/* Aquí puedes agregar Navbar u otros elementos comunes si es necesario */}
            <UsersTable />
            
        </div>
        <FooterNav />
        </Content>
        
      </Layout>
    </Layout>
    );
};

export default UsersPage;
