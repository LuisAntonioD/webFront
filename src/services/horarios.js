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

const addHorario = async (token) => {
    try {
        const response = await axios.post(
            `${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}`,
            { fecha: "2024-08-01", horaInicio: "09:00", horaFinal: "10:00" },
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
        fecha: updatedHorario.dia,
        horaInicio: updatedHorario.horaInicio,
        horaFinal: updatedHorario.horaFin,
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
