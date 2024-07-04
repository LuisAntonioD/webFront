import { jwtDecode } from "jwt-decode";
import { ENV } from "../utils/constants";
import { authFetch } from "../utils/authFetch";
import axios from 'axios';

const getMe = async (token) => {
    try {
        const decoded = jwtDecode(token)
        const userId = decoded.id
        const url =`${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`
        const response = await authFetch(url);

        return await response.json();
    } catch (error) {
        console.log(error);
    }

}


const updateUser = async (userId, updatedUserData, token) => {
    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
    const response = await axios.put(url, updatedUserData, {
        headers: {
            'x-access-token': token,
        },
    });
    return response.data;
};


const deleteUser = async (id, token) => {
    return axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.DELETE}/${id}`, {
        headers: {
            'x-access-token': token
        }
    });
};

export const usersService = {
    getMe,
    updateUser,
    deleteUser
};



