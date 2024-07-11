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


const addProfesor = async (userData, token) => {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`;
    const response = await axios.post(url, userData, {
        headers: {
            'x-access-token': token
        }
    });
    return response.data;
};

const updateUser = async (userId, updatedUserData, token) => {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}/${userId}`;
    const response = await axios.put(url, updatedUserData, {
        headers: {
            'x-access-token': token,
        },
    });
    return response.data;
};


// Esto exporta los métodos individualmente
export { getMe, updateUser, deleteProfesor };

// Esto exporta los métodos como un objeto por defecto
const usersService = {
    getMe,
    updateUser,
    getProfesores,
    deleteProfesor,
    addProfesor
};

export default usersService;
