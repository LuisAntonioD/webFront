import axios from 'axios';
import { ENV } from '../utils/constants';

// Obtener información del usuario a partir del token
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

// Obtener todas las ofertas educativas
const getOfertasEducativas = async () => {
    try {
        const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las ofertas educativas:', error);
        throw error;
    }
};


const addOfertaEducativa = async (token, oferta) => {
    try {
        const response = await axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}`, oferta, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding oferta educativa:', error);
        throw error;
    }
};

// Editar una oferta educativa
const updateOfertaEducativa = async (id, oferta, token) => {
    try {
        const response = await axios.put(`${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}/${id}`, oferta, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating oferta educativa:', error);
        throw error;
    }
};

// Esto exporta los métodos como un objeto por defecto
const ofertaEducativaService = {
    getMe,
    getOfertasEducativas,
    addOfertaEducativa,
    updateOfertaEducativa

};

export default ofertaEducativaService;
