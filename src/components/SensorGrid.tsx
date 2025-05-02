import React from 'react';
import SensorCard from './SensorCard';
import { useWebSocket } from '../context/WebSocketContext';
import { Thermometer, Droplets, Flame, DoorOpen, Eye } from 'lucide-react';

const SensorGrid: React.FC = () => {
  const { sensorData } = useWebSocket();

  // Sensör görnüşine görä degişli ikonany yzyna gaýtaryp berer
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

  // Statusa görä reňkleri yzyna gaýtaryp berer
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

  // Sensör görnüşine görä has jikme-jik ilerleme bahasy hasaplanar
  const getProgressValue = (sensor: any) => {
    switch (sensor.type) {
      case 'temperature':
        // Selsiýde 18-30°C aralygynda normalizasiýa
        return Math.min(100, Math.max(0, ((sensor.value - 18) / (30 - 18)) * 100));
      case 'humidity': 
        // Nem: 0-100%
        return sensor.value;
      case 'fire':
        // Oka garşy: 0 ýa-da 100%
        return sensor.value * 100;
      case 'door':
        // Gapynyň ýagdaýy: 0 ýa-da 100%
        return sensor.value * 100;
      case 'motion':
        // Hereket: 0 ýa-da 100%
        return sensor.value * 100;
      default:
        return 0;
    }
  };

  // Sensör görnüşine görä has jikme-jik ýagdaý etiketleri
  const getStatusLabel = (sensor: any) => {
    switch (sensor.type) {
      case 'door':
        return sensor.value === 0 ? 'Ýapyk' : 'Açyk';
      case 'fire':
        return sensor.value === 0 ? 'Yangyn ýok' : 'Yangyn ALARM!';
      case 'motion':
        return sensor.value === 0 ? 'Hereket ýok' : 'Hereket bar';
        case 'temperature':
          if (sensor.value < 18) return 'Sowuk';  
          if (sensor.value > 30) return 'Gyzgyn';  
          return 'Adaty'; 
        case 'humidity':
          if (sensor.value < 30) return 'Pes çyglylyk';
          if (sensor.value > 70) return 'Beýik çyglylyk';
          return 'Adaty çyglylyk'; 
      default:
        return sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
