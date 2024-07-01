import { storageController } from "../services/token"
import { tokenExpired } from "./tokenExpired"

export const authFetch = async (url, params) => {
    const token = await storageController.getToken();

    const logout = () => {
        storageController.removeToken();
    }
    if(!token){
        logout();
    } else {
        if(tokenExpired(token)){
            logout()
        }
        else {
            const options = {
                ...params,
                headers: {
                    ...params?.headers,
                    Authorization: `Bearer ${token}`
                }
            }
            try{
                return await fetch(url, options)
            } catch (error) {
                console.log(error)
            }
        }
        //const response = tokenExpired(token);
        //console.log('Response: ', response);
    }
    
    //console.log('Hola desde authfetch')
}