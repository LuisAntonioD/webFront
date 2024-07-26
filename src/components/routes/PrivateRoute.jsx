// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ element: Component }) => {
    const { user } = useAuth();

    return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
