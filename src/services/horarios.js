import axios from 'axios';
import { ENV } from '../utils/constants';

export const getHorarios = async () => {
    try {
        const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        throw error;
    }
};

const addHorario = async (dia, horaInicio, horaFin, token) => {
    try {
        const response = await axios.post(
            'https://lizard-server.vercel.app/api/horarios',
            { dia, horaInicio, horaFin },
            { headers: { 'x-access-token': token } }
        );
        return response.data;
    } catch (error) {
        console.error('Error en addHorario:', error.response ? error.response.data : error.message);
        throw error; 
    }
};

const editHorario = async (id, updatedHorario, token) => {
    return axios.put(`${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}/${id}`, {
        dia: updatedHorario.dia,
        horaInicio: updatedHorario.horaInicio,
        horaFin: updatedHorario.horaFin,
        profesor: updatedHorario.profesor,  // Asignación del profesor al horario
    }, {
        headers: {
            'x-access-token': token
        }
    });
};

const deleteHorario = async (id, token) => {
    return axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}/${id}`, {
        headers: {
            'x-access-token': token
        }
    });
};

export default {
    getHorarios,
    addHorario,
    editHorario,
    deleteHorario,
};
