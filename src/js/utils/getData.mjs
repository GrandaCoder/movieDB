import { instance } from '../app.mjs';

async function getDataFromApi(endpoint, optionalConfig = {}) {
    try {
        const response = await instance.get(endpoint, optionalConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { getDataFromApi };
