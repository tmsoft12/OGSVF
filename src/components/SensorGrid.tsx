import React from 'react';
import SensorCard from './SensorCard';
import { useWebSocket } from '../context/WebSocketContext';
import { Thermometer, Droplets, Flame, DoorOpen, Eye } from 'lucide-react';

const SensorGrid: React.FC = () => {
  const { sensorData } = useWebSocket();

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer size={28} className="text-red-400" />;
      case 'humidity':
        return <Droplets size={28} className="text-blue-400" />;
      case 'fire':
        return <Flame size={28} className="text-orange-500" />;
      case 'door':
        return <DoorOpen size={28} className="text-indigo-400" />;
      case 'motion':
        return <Eye size={28} className="text-purple-400" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressValue = (sensor: any) => {
    // Calculate appropriate progress values for different sensor types
    switch (sensor.type) {
      case 'temperature':
        // Normalize temperature between 18-30°C
        return Math.min(100, Math.max(0, ((sensor.value - 18) / (30 - 18)) * 100));
      case 'humidity': 
        // Humidity is already 0-100%
        return sensor.value;
      case 'fire':
        // Binary: 0 or 100%
        return sensor.value * 100;
      case 'door':
        // Binary: 0 or 100%
        return sensor.value * 100;
      case 'motion':
        // Binary: 0 or 100%
        return sensor.value * 100;
      default:
        return 0;
    }
  };

  const getStatusLabel = (sensor: any) => {
    if (sensor.type === 'door') {
      return sensor.value === 0 ? 'Closed' : 'Open';
    } else if (sensor.type === 'fire') {
      return sensor.value === 0 ? 'No Fire Detected' : 'FIRE ALERT!';
    } else if (sensor.type === 'motion') {
      return sensor.value === 0 ? 'No Motion' : 'Motion Detected';
    } else {
      return sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sensorData.map(sensor => (
        <SensorCard
          key={sensor.id}
          icon={getSensorIcon(sensor.type)}
          title={sensor.name}
          value={sensor.value}
          unit={sensor.unit || ''}
          status={getStatusLabel(sensor)}
          location={sensor.location || ''}
          progressValue={getProgressValue(sensor)}
          progressColor={getProgressColor(sensor.status)}
          timestamp={new Date(sensor.timestamp).toLocaleTimeString()}
        />
      ))}
    </div>
  );
};

export default SensorGrid;