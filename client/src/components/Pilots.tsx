import React, { ReactElement } from 'react';
import { MappedDrone } from '../App';

interface PilotsProps {
    drones?: MappedDrone[];
}

const Pilots = ({ drones }: PilotsProps): ReactElement => {
    const hasViolators = drones && drones.some(drone => drone.isInsideNoFlyZone);

    if (!hasViolators) {
        return <p>No pilot in the NFZ!</p>;
    }

    return (
        <div>
            <h2>Pilots in the NFZ</h2>

            <table>
                <colgroup span={4}></colgroup>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone no.</th>
                    <th>Closest distance(in meters)</th>
                </tr>
                {drones && drones.map(drone => {
                    return (
                        drone.isInsideNoFlyZone && (
                            <tr>
                                <td>{drone.pilot?.firstName} {drone.pilot?.lastName}</td>
                                <td>{drone.pilot?.email}</td>
                                <td>{drone.pilot?.phoneNumber}</td>
                                <td>{drone.closestDistance}</td>
                            </tr>
                        )
                    );
                })}
            </table>
        </div>
    );
};

export default Pilots
