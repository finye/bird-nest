export interface Drone {
    serialNumber: string
    model: string
    manufacturer: string
    mac: string
    ipv4: string
    ipv6: string
    firmware: string
    positionY: string
    positionX: string
    altitude: string
}

export interface Report {
    deviceInformation: {
        listenRange: string
        deviceStarted: string
        uptimeSeconds: string
        updateIntervalMs: string
    }
    capture: {
        '$': {
            snapshotTimestamp: string
        }
        drone: Drone[]
    }
}

export interface DroneReport {
    report: Report
}

export interface MappedDrone {
    serialNumber: string
    model: string
    manufacturer: string
    y: number
    x: number
    snapshotTimestamp: string // maybe this should be a Date
    isInsideNoFlyZone: boolean
    closestDistance: number
    pilot?: Pilot
}

interface Pilot {
    createdDt: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    pilotId: string
}

export interface DronesPilotList {
    drones: MappedDrone[]
}