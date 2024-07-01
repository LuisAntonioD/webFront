import axios from 'axios';
import { ENV } from '../utils/constants';
import { storageController } from '../services/token'; // Importa el controlador de almacenamiento


const register = async (username, email, password) => {
    return axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.REGISTER}`, {
        username,
        email,
        password,
        roles: ['admin'],
    });
};


const loginForm = async (email, password) => {
    return axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.LOGIN}`, {
        email,
        password,
    });
};

export default {
    register,
    loginForm,
};