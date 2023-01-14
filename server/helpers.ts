import xml2js from 'xml2js';
import { Drone, DroneReport, Report } from './types';

export const parseXmlToJson = (xml: string): Report => {
    let json = {}

    xml2js.parseString(xml, { explicitArray: false }, (error: Error | null, result: DroneReport) => {
        if (error) {
            console.log(error);
        } else {
            json = result.report;
        }
    })

    return json as Report;
}

const noFlyZoneRadiusLimit: number = 100_000;

export const getClosestDrone = (x: number, y: number): number => {
    const center = 250_000;

    return Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2)) / 1000;
}

export const isInsideNoFlyZone = (x: number, y: number): boolean => {
    const closestDrone = getClosestDrone(x, y);

    return closestDrone < (noFlyZoneRadiusLimit / 1000)
}


export const isWithinTheLastTenMinutes = (snapShotTimestamp: string) => {
    // get the last 10 minutes
    const lastTenMinutes = new Date().getTime() - 10 * 60 * 1000;

    // checks if snapShotTimestamp is within the last 10 minutes
    return new Date(snapShotTimestamp).getTime() > lastTenMinutes;
}