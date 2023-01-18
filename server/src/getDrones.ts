import axios, { AxiosResponse } from 'axios'
import { getClosestDrone, isInsideNoFlyZone, isWithinTheLastTenMinutes, parseXmlToJson } from './helpers';
import { Drone, DronesPilotList, MappedDrone } from './types';

const BASE_URL = 'https://assignments.reaktor.com/birdnest';

const getDrones = async (dronesInDb: DronesPilotList) => {

    const response: AxiosResponse = await axios.get(`${BASE_URL}/drones`);
    const { mappedDrones } = getMappedDroneList(response);

    const drones = await getDronePilotList(mappedDrones)

    const _filteredDrones = filteredDrones(dronesInDb, drones)

    return _filteredDrones
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


export const filteredDrones = (dronesInDb: DronesPilotList, dronesFromApi: MappedDrone[]): {
    drones: MappedDrone[]
} => {
    const isValidDroneInDb = dronesInDb.drones.filter((drone: MappedDrone) => isWithinTheLastTenMinutes(drone.snapshotTimestamp))

    // filter duplicate drones which already exists in DRONE_PILOTS_DB
    const filteredDronesFromApi = dronesFromApi.reduce((acc: MappedDrone[], drone: MappedDrone) => {
        const isANewViolatorDrone = drone.isInsideNoFlyZone // true
        const isViolatorDroneInDb = isValidDroneInDb.find((d: MappedDrone) => d.serialNumber === drone.serialNumber)

        if (!isViolatorDroneInDb && isANewViolatorDrone) {
            return [...acc, drone]
        }

        return acc;
    }, [])

    // combine unique drones from the db and the drones from the api
    const combinedDrones = isValidDroneInDb.concat(filteredDronesFromApi) // .filter((drone: MappedDrone) => drone.isInsideNoFlyZone)
    // const combinedDrones = filteredDrones
    return {
        drones: combinedDrones
    }
}

export default getDrones;
