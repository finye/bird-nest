import axios, { AxiosResponse } from 'axios'

const BASE_URL = 'https://assignments.reaktor.com/birdnest';

const getDrones = async () => {
    try {
        const response: AxiosResponse = await axios.get(`${BASE_URL}/drones`);

        return response.data;
    } catch (error) {
        console.error(error)
    }


}


export default getDrones;