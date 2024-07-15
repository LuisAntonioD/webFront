// usersService.js
import axios from 'axios';
import { ENV } from '../utils/constants';

const updateUser = async (userId, userData, token) => {
    try {
        const response = await axios.put(
            `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    updateUser,
    // other service functions
};
