// src/routes/AppRoutes.jsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductsPage from '../pages/Products/ProductsPage';
import NotFound from '../pages/Config/NotFound';  // Importa el componente NotFound
import { useAuth } from '../../hooks/useAuth';
import UsersPage from '../pages/Usuarios/Users';

const AppRoutes = () => {
    const { user } = useAuth();

    let routes = useRoutes([
        { path: '/', element: user ? <Home /> : <Login /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/productos', element: <ProductsPage /> },
        { path: '/Admisiones', element: <ProductsPage /> },
        { path: '/Usuarios', element: <UsersPage /> },
        { path: '*', element: <NotFound /> },  // Ruta para páginas no encontradas
    ]);

    return routes;
};

export default AppRoutes;
