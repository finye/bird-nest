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