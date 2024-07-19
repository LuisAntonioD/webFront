import React, { useState, useEffect, createContext } from 'react';
import { storageController } from '../../services/token';

import usersService from '../../services/users';
import { tokenExpired } from '../../utils/tokenExpired';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSession();
    }, []);

    const getSession = async () => {
        const token = await storageController.getToken();
        if (!token) {
            logout();
            setLoading(false);
            return;
        }
        if (tokenExpired(token)) {
            logout();
        } else {
            login(token);
        }
    };

    const login = async (token) => {
        try {
            console.log('Obteniendo', token);
            await storageController.setToken(token);
            const response = await usersService.getMe(token);
            setUser(response);
            setLoading(false);
            console.log(response);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const updateUserData = async (updatedUserData) => {
        try {
            const token = await storageController.getToken();
            if (!token) {
                throw new Error('No hay token disponible');
            }

            console.log('Actualizando datos del usuario:', updatedUserData);
            const response = await usersService.updateUser(user._id, updatedUserData, token);
            setUser(response);
            setLoading(false);
            console.log('Datos actualizados del usuario:', response);
        } catch (error) {
            console.error('Error al actualizar datos del usuario:', error);
            setLoading(false);
        }
    };
    

    const logout = async () => {
        try {
            await storageController.removeToken();
            setUser(null);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const data = {
        user,
        token: storageController.getToken(), // Asegúrate de exponer el token
        login,
        logout,
        updateUserData,
    };

    if (loading) return null;
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
