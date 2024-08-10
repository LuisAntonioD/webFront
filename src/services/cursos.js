import axios from 'axios';
import { ENV } from '../utils/constants';

export const getCursos = async () => {
    try {
        const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.CURSOS}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los:', error);
        throw error;
    }
};

const addCurso = async (nombreCurso, token) => {
    try {
        const response = await axios.post(
            'https://lizard-server.vercel.app/api/cursos',
            { nombre: nombreCurso },
            { headers: { 'x-access-token': token } }
        );
       // console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
       // console.error('Error en addCurso:', error.response ? error.response.data : error.message);
        throw error; 
    }
};



const editCurso = async (id, updatedCurso, token) => {
    return axios.put(`${ENV.API_URL}/${ENV.ENDPOINTS.CURSOS}/${id}`, {
        nombre: updatedCurso.nombre,
        profesores: updatedCurso.profesores,
    }, {
        headers: {
            'x-access-token': token
        }
    });
};

const deleteCurso = async (id, token) => {
    return axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.CURSOS}/${id}`, {
        headers: {
            'x-access-token': token
        }
    });
};

export default {
    getCursos,
    addCurso,
    editCurso,
    deleteCurso,
};