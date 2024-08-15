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

const addHorario = async (token, fecha, horaInicio, horaFinal, profesor) => {
    try {
        const response = await axios.post(
            `${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}`,
            { fecha, horaInicio, horaFinal, profesor },
            { headers: { 'x-access-token': token } }
        );
        console.log('Respuesta del backend en addHorario:', response.data); // Agregar logging para depuración
        return response.data;
    } catch (error) {
        console.error('Error en addHorario:', error.response ? error.response.data : error.message);
        throw error;
    }
};



const editHorario = async (id, updatedHorario, token) => {
    try {
        console.log('Datos enviados a editHorario:', {
            id,
            fecha: updatedHorario.fecha,
            horaInicio: updatedHorario.horaInicio,
            horaFinal: updatedHorario.horaFinal,
            profesor: updatedHorario.profesor,
        });

        const response = await axios.put(
            `${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}/${id}`,
            {
                fecha: updatedHorario.fecha,
                horaInicio: updatedHorario.horaInicio,
                horaFinal: updatedHorario.horaFinal,
                profesor: updatedHorario.profesor,
            },
            {
                headers: {
                    'x-access-token': token
                }
            }
        );

        console.log('Respuesta del backend en editHorario:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en editHorario:', error.response ? error.response.data : error.message);
        throw error;
    }
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
