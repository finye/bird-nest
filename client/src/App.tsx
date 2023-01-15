import React, { ReactElement, useEffect } from 'react';
import axios from 'axios'
import './App.css';

// TODO: use shared types in client and server
interface Pilot {
  createdDt: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  pilotId: string
}

interface MappedDrone {
  serialNumber: string
  model: string
  manufacturer: string
  y: number
  x: number
  isInsideNoFlyZone: boolean
  closestDistance: number
  snapshotTimestamp: string // maybe this should be a Date
  pilot?: Pilot
}

interface DronesInSightProps {
  drones?: MappedDrone[]
}

const DronesInSight = ({ drones }: DronesInSightProps): ReactElement => {
  if (!drones) {
    return <div>loading...</div>
  }

  const scaleBy = 1.25
  const getRadius = (r: number) => r / 1000 / scaleBy
  const center = getRadius(250_000);

  return (
    <svg width={500} height={500}>

      <circle cx={center} cy={center} r={center} fill='none' stroke='#607d8b' />
      <circle cx={center} cy={center} r={getRadius(100_000)} fill='none' stroke='#ff5722' />

      <circle cx={center} cy={center} r={10} fill='#4CAF50' />
      <text x={center} y={center} text-anchor="right" alignment-baseline="central" fill="white" fontSize='1rem'>Endangered bird</text>

      {drones.map((drone: MappedDrone) => {
        return (
          <circle
            cx={getRadius(drone.x)}
            cy={getRadius(drone.y)}
            r={5}
            fill={drone.isInsideNoFlyZone ? '#f44336' : '#ffc302'}
          />
        )
      })}

    </svg>
  )
}

const DronesApp = () => {
  const [drones, setDrones] = React.useState<MappedDrone[]>();

  useEffect(() => {
    void getDrones();
  }, []);


  const getDrones = async () => {
    try {
      const { data } = await axios.get('/drones')

      setDrones(data.drones);
    } catch (error) {
      console.log(error);
    }
  }

  const hasViolators = drones && drones.some(drone => drone.isInsideNoFlyZone)

  console.log(drones);


  const Pilots = (): ReactElement => {
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
          {
            drones && drones.map(drone => {
              return (
                drone.isInsideNoFlyZone && (
                  <tr>
                    <td>{drone.pilot?.firstName} {drone.pilot?.lastName}</td>
                    <td>{drone.pilot?.email}</td>
                    <td>{drone.pilot?.phoneNumber}</td>
                    <td>{drone.closestDistance}</td>
                  </tr>
                )
              )
            })
          }
        </table>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <DronesInSight drones={drones} />
        </div>

        <Pilots />
      </header>

    </div>
  );
}

export default DronesApp;
