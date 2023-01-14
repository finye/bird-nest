import axios, { AxiosResponse } from 'axios'
import { parseXmlToJson } from './helpers';
import { Drone, MappedDrone } from './types';

const BASE_URL = 'https://assignments.reaktor.com/birdnest';

const getDrones = async () => {
    try {
        const response: AxiosResponse = await axios.get(`${BASE_URL}/drones`);
        const { mappedDrones } = getMappedDroneList(response);

        return mappedDrones;
    } catch (error) {
        console.error(error)
    }

}

const getMappedDroneList = (response: AxiosResponse<any, any>) => {
    const { capture } = parseXmlToJson(response.data);
    const snapshotTimestamp = capture['$'].snapshotTimestamp;
    const drones = capture.drone;

    const mappedDrones: MappedDrone[] = drones.map((drone: Drone) => {
        const { positionX, positionY, serialNumber, model, manufacturer } = drone;
        const x = Number(positionX);
        const y = Number(positionY);

        return {
            serialNumber,
            model,
            manufacturer,
            snapshotTimestamp,
            y,
            x
        }
    })

    return { mappedDrones };
}
export default getDrones;