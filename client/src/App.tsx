import React, { useEffect } from 'react';
import axios from 'axios'
import './App.css';
import DronesVisualization from './components/DronesVisualization';
import Pilots from './components/Pilots';

// TODO: use shared types in client and server
interface Pilot {
  createdDt: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  pilotId: string
}

export interface MappedDrone {
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

  return (
    <div className="App">
      <header className="App-header">
        <DronesVisualization drones={drones} />

        <Pilots drones={drones} />
      </header>

    </div>
  );
}

export default DronesApp;
