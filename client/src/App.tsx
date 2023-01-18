import React, { useEffect } from 'react';
import io from 'socket.io-client';
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

const socket = io({
  path: '/drones'
});

const DronesApp = () => {
  const [drones, setDrones] = React.useState<MappedDrone[]>();

  useEffect(() => {
    socket.on('drones', (_drones: string) => {

      setDrones(JSON.parse(_drones))
    });

    // Stop listening for emitted event drones when the component unmounts
    return () => {
      socket.off('drones');
    };
  }, []);

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
