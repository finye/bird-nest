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
          {/* <canvas ref={canvasRef} width={500} height={500}/> */}
        </div>

        <Pilots />
      </header>

    </div>
  );
}

export default DronesApp;
