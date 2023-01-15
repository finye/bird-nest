import React, { ReactElement } from 'react';
import { MappedDrone } from '../App';

interface DronesVisualizationProps {
    drones?: MappedDrone[];
}

const DronesVisualization = ({ drones }: DronesVisualizationProps): ReactElement => {
    if (!drones) {
        return <div>loading...</div>;
    }

    const scaleBy = 1.25;
    const getRadius = (r: number) => r / 1000 / scaleBy;
    const center = getRadius(250000);

    return (
        <svg width={500} height={500}>

            <circle cx={center} cy={center} r={center} fill='none' stroke='#607d8b' />
            <circle cx={center} cy={center} r={getRadius(100000)} fill='none' stroke='#ff5722' />

            <circle cx={center} cy={center} r={10} fill='#4CAF50' />
            <text x={center} y={center} text-anchor="right" alignment-baseline="central" fill="white" fontSize='1rem'>Endangered bird</text>

            {drones.map((drone: MappedDrone) => {
                return (
                    <circle
                        cx={getRadius(drone.x)}
                        cy={getRadius(drone.y)}
                        r={5}
                        fill={drone.isInsideNoFlyZone ? '#f44336' : '#ffc302'} />
                );
            })}

        </svg>
    );
};

export default DronesVisualization
