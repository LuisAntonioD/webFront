import axios from 'axios';
import { ENV } from '../utils/constants';
///import jwtDecode from 'jwt-decode'; // Asegúrate de tener este import

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

// Agregar una nueva oferta educativa
const addOfertasEducativas = async (ofertaData, token) => {
    try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}`;
        const response = await axios.post(url, ofertaData, {
            headers: {
                'x-access-token': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al agregar la oferta educativa:', error);
        throw error;
    }
};

// Esto exporta los métodos individualmente
export { getMe, getOfertasEducativas, addOfertasEducativas };

// Esto exporta los métodos como un objeto por defecto
const ofertaEducativaService = {
    getMe,
    getOfertasEducativas,
    addOfertasEducativas
};

export default ofertaEducativaService;
