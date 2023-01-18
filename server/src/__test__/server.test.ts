import { testDrones } from "./mockData";
import { isWithinTheLastTenMinutes } from "../helpers";
import { MappedDrone } from "../types";
import { filteredDrones } from "../getDrones";

describe('Server', () => {
    describe('isWithinTheLastTenMinutes', () => {
        it('should remove drones that are older than 10 minutes', () => {
            const drones = testDrones.drones.filter(drone => isWithinTheLastTenMinutes(drone.snapshotTimestamp));

            expect(drones).toHaveLength(0);

            const drone = testDrones.drones.find(drone => drone.serialNumber === 'SN-Mz_o8bxhIw');
            const newDrone = { ...drone, snapshotTimestamp: new Date().toISOString() };
            const newDrones = [...testDrones.drones, newDrone];
            const dronesWithinLastTenMinutes = newDrones.filter(drone => isWithinTheLastTenMinutes(drone.snapshotTimestamp));

            expect(dronesWithinLastTenMinutes).toHaveLength(1);
        });
    })

    describe('filteredDrones', () => {
        it('should not add a new drone if it exists in db', () => {
            const dbDroneWithExistingSerialNumber = {
                "isInsideNoFlyZone": true,
                "closestDistance": 87,
                "serialNumber": "SN-PLwg0ge4FM",
                "model": "Altitude X",
                "manufacturer": "DroneGoat Inc",
                "snapshotTimestamp": '2023-01-16T8:19:46.802Z',
                "y": 400146.9720346696,
                "x": 465213.72767753043,
                "pilot": {
                    "pilotId": "P-i4gqNGGtXM",
                    "firstName": "Abdul",
                    "lastName": "Huel",
                    "phoneNumber": "+210828821074",
                    "createdDt": "2022-02-22T09:00:33.808Z",
                    "email": "abdul.huel@example.com"
                }
            }
            const LOCAL_DB = {
                drones: [dbDroneWithExistingSerialNumber],
            }

            const droneFromApi = testDrones.drones.map((drone: MappedDrone) =>
                ({ ...drone, isInsideNoFlyZone: true, snapshotTimestamp: new Date().toISOString() }))
            const { drones } = filteredDrones(LOCAL_DB, droneFromApi); // 5 violator drones

            expect(drones.length).toEqual(testDrones.drones.length);
        });

        it('should filter the last 10 minutes from db', () => {
            const dronesFromDb = testDrones
            const { drones } = filteredDrones(dronesFromDb, []);

            expect(drones.length).toEqual(0);
        });
    })
})
