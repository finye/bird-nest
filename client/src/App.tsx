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

const URL = process.env.NODE_ENV === 'development' ? 'ws://0.0.0.0' : 'wss://bird-nest-finnan.herokuapp.com'

const DronesApp = () => {
  const [drones, setDrones] = React.useState<MappedDrone[]>();

  // useEffect(() => {
  //   void getDrones();
  // }, []);


  useEffect(() => {
    const socket = new WebSocket(URL + ':8080');

    socket.onopen = () => {
      console.log('connected');
    }

    socket.onmessage = (event) => {
      const _drones = JSON.parse(event.data);

      setDrones(_drones);
    }

    socket.onclose = () => {
      console.log('disconnected');
    }

    // return () => socket.close();
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
