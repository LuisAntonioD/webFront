import React, { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ProfesoresTable from '../../Profesores/ProfesoresTabla/ProfesoresTable'; // Ajusta la importación según la estructura de tu proyecto
// import NewProfesorForm from '../../../components/Profesores/ProfesoresTabla/Profesores/newProfesor'; // Importa el formulario NewProfesorForm
import { useAuth } from '../../../hooks/useAuth'; // Asegúrate de importar useAuth si lo necesitas
//import { profesoresService } from '../../../services/profesorService'; // Asegúrate de importar profesoresService si lo necesitas
import SidebarMenu from '../Menu/SidebarMenu';
import { useMenuConfig } from '../Menu/HandleMenu';
import FooterNav  from '../Menu/Footer.jsx';

const { Header, Content } = Layout;

const ProfesoresPage = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false); // Define collapsed como estado local
    const { colorBgContainer } = theme.useToken().token;
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const handleMenuClick = useMenuConfig();

    const handleAddProfesor = () => {
        setModalVisible(true); // Abre el modal para agregar un nuevo profesor
    };

    const handleCancelAddProfesor = () => {
        setModalVisible(false); // Cierra el modal para agregar un nuevo profesor
    };

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
                <Content style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
                    <div className="profesores-page-container">
                        {/* <Button type="primary" onClick={handleAddProfesor} style={{ marginBottom: '16px' }}>
                            Agregar Nuevo Profesor
                        </Button> */}
                        {/* <NewProfesorForm
                            visible={modalVisible}
                            onCreate={() => {
                                // Implementa la lógica para actualizar los datos si es necesario
                                setModalVisible(false); // Cierra el modal después de agregar el profesor
                            }}
                            onCancel={handleCancelAddProfesor}
                        /> */}
                        <ProfesoresTable /> {/* Muestra la tabla de profesores */}
                    </div>
                    <FooterNav />
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfesoresPage;
