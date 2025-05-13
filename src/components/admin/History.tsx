import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Thermometer,
  Droplets,
  DoorOpen,
  MoveRight,
} from 'lucide-react';

type EventType = 'temperature' | 'humidity' | 'motion' | 'door' | 'fire';

const categories: { type: EventType; label: string }[] = [
  { type: 'temperature', label: 'Gyzgynlyk' }, // Temperature
  { type: 'humidity', label: 'Çyglylyk' },        // Humidity
  { type: 'motion', label: 'Hereket' },    // Motion
  { type: 'door', label: 'Gapy' },           // Door
  { type: 'fire', label: 'Ýangyn' },           // Fire
];

const getIcon = (type: EventType) => {
  const props = { size: 32, className: 'text-white' };
  switch (type) {
    case 'temperature': return <Thermometer {...props} />;
    case 'humidity': return <Droplets {...props} />;
    case 'motion': return <MoveRight {...props} />;
    case 'door': return <DoorOpen {...props} />;
    case 'fire': return <Flame {...props} />;
  }
};

const getColor = (type: EventType) => {
  switch (type) {
    case 'temperature': return 'bg-orange-500/20';
    case 'humidity': return 'bg-blue-500/20';
    case 'motion': return 'bg-purple-500/20';
    case 'door': return 'bg-green-500/20';
    case 'fire': return 'bg-red-600/20';
  }
};

const Gecmis: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
  <h3 className="text-lg font-semibold text-white">Gecmis maglumat</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700/30">
      {categories.map((item) => (
        <div
          key={item.type}
          className={`rounded-xl p-4 ${getColor(item.type)} text-white shadow-md cursor-pointer transition hover:scale-105`}
          onClick={() => navigate(`/history/${item.type}`)}
        >
          <div className="flex flex-col items-center">
            {getIcon(item.type)}
            <div className="text-sm mt-2 capitalize">{item.label}

            </div>
          </div>

        </div>

      ))}
    </div><br /><br /></>
  );
};

export default Gecmis;
