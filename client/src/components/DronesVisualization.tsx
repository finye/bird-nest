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

    const dronesInTheZone = '#ffc302'
    const violatorColor = '#f44336'
    const endangeredBirdColor = '#4CAF50'

    const Legend = () => {
        return (
            <g fontSize='1rem'>
                <rect x="10" y="410" width="10" height="10" fill={dronesInTheZone} />
                <text x="40" y="425" fill='#fff'>Drones in the area</text>
                <rect x="10" y="440" width="10" height="10" fill={violatorColor} />
                <text x="40" y="455" fill='#fff'>Violators</text>
                <rect x="10" y="470" width="10" height="10" fill={endangeredBirdColor} />
                <text x="40" y="485" fill='#fff'>Endangered bird</text>
            </g>
        )
    }

    return (
        <svg width={500} height={500}>

            <circle cx={center} cy={center} r={center} fill='none' stroke='#607d8b' />
            <circle cx={center} cy={center} r={getRadius(100000)} fill='none' stroke='#ff5722' />

            <circle cx={center} cy={center} r={10} fill='#4CAF50' />

            {drones.map((drone: MappedDrone) => {
                return (
                    <circle
                        cx={getRadius(drone.x)}
                        cy={getRadius(drone.y)}
                        r={5}
                        fill={drone.isInsideNoFlyZone ? '#f44336' : '#ffc302'} />
                );
            })}

            <Legend />

        </svg>
    );
};

export default DronesVisualization
