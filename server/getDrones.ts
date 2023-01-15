import axios, { AxiosResponse } from 'axios'
import { getClosestDrone, isInsideNoFlyZone, parseXmlToJson } from './helpers';
import { Drone, MappedDrone } from './types';

const BASE_URL = 'https://assignments.reaktor.com/birdnest';

const getDrones = async () => {
    try {
        const response: AxiosResponse = await axios.get(`${BASE_URL}/drones`);
        const { mappedDrones } = getMappedDroneList(response);

        const drones = await getDronePilotList(mappedDrones)

        return { drones }
    } catch (error) {
        console.error(error)
    }

}

const getDronePilotList = async (drones: MappedDrone[]) => {
    return await Promise.all(drones.map(async (drone: MappedDrone) => {
        const { data: pilot } = await axios.get(`${BASE_URL}/pilots/${drone.serialNumber}`);

        return {
            ...drone,
            pilot
        };
    }))
}

const getMappedDroneList = (response: AxiosResponse) => {
    const { capture } = parseXmlToJson(response.data);
    const snapshotTimestamp = capture['$'].snapshotTimestamp;
    const drones = capture.drone;

    const mappedDrones: MappedDrone[] = drones.map((drone: Drone) => {
        const { positionX, positionY, serialNumber, model, manufacturer } = drone;
        const x = Number(positionX);
        const y = Number(positionY);

        return {
            isInsideNoFlyZone: isInsideNoFlyZone(x, y),
            closestDistance: Math.round(getClosestDrone(x, y)),
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
