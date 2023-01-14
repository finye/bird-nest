import xml2js from 'xml2js';
import { DroneReport, Report } from './types';

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

export const isWithinTheLastTenMinutes = (snapShotTimestamp: string) => {
    // get the last 10 minutes
    const lastTenMinutes = new Date().getTime() - 10 * 60 * 1000;

    // checks if snapShotTimestamp is within the last 10 minutes
    return new Date(snapShotTimestamp).getTime() > lastTenMinutes;
}