import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { Button, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AdmisionesTable from '../../Admisiones/Admisiones/AdmisionesTable.jsx';
import SidebarMenu from '../Menu/SidebarMenu.jsx';
import { useMenuConfig } from '../Menu/HandleMenu.jsx';
import FooterNav  from '../Menu/Footer.jsx';

const { Header, Content } = Layout;

const AdmisionesPage = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const { colorBgContainer } = theme.useToken().token;
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
                        overflowX: 'auto',
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 64px)',
                    }}
                >
                    <div className="products-page-container">
                        <AdmisionesTable />
                    </div>
                    <FooterNav/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdmisionesPage;
