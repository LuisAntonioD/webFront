import { jwtDecode } from "jwt-decode";
import { ENV } from "../utils/constants";
import { authFetch } from "../utils/authFetch";
import axios from 'axios';

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

const updateUser = async (userId, updatedUserData, token) => {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
    const response = await axios.put(url, updatedUserData, {
        headers: {
            'x-access-token': token,
        },
    });
    return response.data;
};


const createUser = async (userData, token) => {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.REGISTER}`;
    const response = await axios.post(url, userData, {
        headers: {
            'x-access-token': token
        }
    });
    return response.data;
};


export const getRoles = async () => {
    try {
        const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.ROLES}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las roles:', error);
        throw error;
    }
};

const deleteUser = async (id, token) => {
    return axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${id}`, {
        headers: {
            'x-access-token': token
        }
    });
};

// Esto exporta los métodos individualmente
export { getMe, updateUser, deleteUser };

// Esto exporta los métodos como un objeto por defecto
const usersService = {
    getMe,
    updateUser,
    deleteUser,
    createUser,
    getRoles
};

export default usersService;
