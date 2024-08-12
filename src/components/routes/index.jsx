// src/routes/AppRoutes.jsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdmisionesPage from '../pages/Admisiones/AdmisionesPage';
import NotFound from '../pages/Config/NotFound';
import { useAuth } from '../../hooks/useAuth';
import ProfesoresPage from '../pages/Profesores/ProfesoresPage';
import UsersPage from '../pages/Usuarios/Users';
import OfertaEducativaPage from '../pages/OfertaEducativa/OfertaEducativapage';
import PrivateRoute from './PrivateRoute'; // Importa el componente PrivateRoute
import MateriasPage from '../pages/Materias/MateriasPage'; // Importa el componente PrivateRoute
import CursosPage from '../pages/Cursos/CursosPage'

const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <PrivateRoute element={Home} /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/productos', element: <PrivateRoute element={AdmisionesPage} /> },
        { path: '/Admisiones', element: <PrivateRoute element={AdmisionesPage} /> },
        { path: '/Usuarios', element: <PrivateRoute element={UsersPage} /> },
        { path: '/profesores', element: <PrivateRoute element={ProfesoresPage} /> },
        { path: '/OfertaEducativa', element: <PrivateRoute element={OfertaEducativaPage} /> },
        { path: '/cursos', element: <PrivateRoute element={CursosPage} /> },
        { path: '/mostrarofertas', element: <OfertaEducativaPage />},
        { path: '/mostraradmisiones', element: <AdmisionesPage /> },
        { path: '/materias', element: <PrivateRoute element={MateriasPage} />  },
     


        { path: '*', element: <NotFound /> }, // Ruta para páginas no encontradas
    ]);

    return routes;
};

export default AppRoutes;
