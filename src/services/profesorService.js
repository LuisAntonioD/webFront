import axios from 'axios';
import { ENV } from '../utils/constants';

const getMe = async (token) => {
    try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
        const response = await axios.get(url, {
            headers: {
                'x-access-token': token
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

const getProfesores = async () => {
    try {
        const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        throw error;
    }
};

const deleteProfesor = async (id, token) => {
    try {
        const response = await axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}/${id}`, {
            headers: {
                'x-access-token': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el profesor:', error);
        throw error;
    }
};

const addProfesor = async (token, profesor) => {
    try {
        const response = await axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`, profesor, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al agregar al profesor:', error);
        throw error;
    }
};

export default {
    getMe,
    getProfesores,
    deleteProfesor,
    addProfesor
};
