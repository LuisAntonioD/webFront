// src/routes/AppRoutes.jsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductsPage from '../pages/Products/ProductsPage';
import NotFound from '../pages/Config/NotFound';
import { useAuth } from '../../hooks/useAuth';
import ProfesoresPage from '../pages/Profesores/ProfesoresPage';
import UsersPage from '../pages/Usuarios/Users';
import OfertaEducativaPage from '../pages/OfertaEducativa/OfertaEducativapage';
import PrivateRoute from './PrivateRoute'; // Importa el componente PrivateRoute

const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <PrivateRoute element={Home} /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/productos', element: <PrivateRoute element={ProductsPage} /> },
        { path: '/Admisiones', element: <PrivateRoute element={ProductsPage} /> },
        { path: '/Usuarios', element: <PrivateRoute element={UsersPage} /> },
        { path: '/profesores', element: <PrivateRoute element={ProfesoresPage} /> },
        { path: '/OfertaEducativa', element: <PrivateRoute element={OfertaEducativaPage} /> },
        { path: '/mostrarofertas', element: <OfertaEducativaPage />},
        { path: '/mostraradmisiones', element: <ProductsPage /> }, 


        { path: '*', element: <NotFound /> }, // Ruta para páginas no encontradas
    ]);

    return routes;
};

export default AppRoutes;
