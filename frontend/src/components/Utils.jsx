import axios from "axios";
const BASE_URL = "http://localhost:8000";
const client = axios.create({
    baseURL: BASE_URL,  
});
export default class Call {

    static headers = {
        'Content-Type': 'application/json',
        accept: 'application/json',
    }

    static async get(path) {                        
        return await client.get(            
            `${BASE_URL}/${path}`,            
            {headers: {...this.headers, Authorization: `Token ${getToken()}`}}
        );
    }

    static async post(path, data) {
        return await client.post(`${BASE_URL}/${path}`,data, {headers: {...this.headers, Authorization: `Token ${getToken()}`}});
    }

    static async put(url, data) {
        return await client.put(this.headers, `${BASE_URL}/${url}`, data, {headers: {...this.headers, Authorization: `Token ${getToken()}`}});
    }

    static async delete(url) {
        return await client.delete(`${BASE_URL}/${url}`, {headers: {...this.headers, Authorization: `Token ${getToken()}`}});
    }
}


export const setAuth = token => {        
    sessionStorage.setItem('token', token)
}

export const deleteAuth = () => {    
    sessionStorage.removeItem('token')
}

export const getToken = () => sessionStorage.getItem('token')



