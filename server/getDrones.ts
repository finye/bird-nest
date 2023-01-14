import axios, { AxiosResponse } from 'axios'
import { parseXmlToJson } from './helpers';

const BASE_URL = 'https://assignments.reaktor.com/birdnest';

const getDrones = async () => {
    try {
        const response: AxiosResponse = await axios.get(`${BASE_URL}/drones`);
        const { capture } = parseXmlToJson(response.data);

        return capture;
    } catch (error) {
        console.error(error)
    }


}


export default getDrones;