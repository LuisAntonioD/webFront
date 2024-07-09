import axios from 'axios';
import { ENV } from '../utils/constants';


const getMe = async (token) => {
    try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
        const response = await authFetch(url);

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};


export const getProfesores = async () => {
    try {
        const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        throw error;
    }
};

const deleteProfesor = async (id, token) => {
    return axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}/${id}`, {
        headers: {
            'x-access-token': token
        }
    });
};

export default {
    getMe,
    getProfesores,
    deleteProfesor,
};