import React from 'react';

interface SensorCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
  status: string;
  location: string;
  progressValue: number;
  progressColor: string;
  timestamp: string;
}

const SensorCard: React.FC<SensorCardProps> = ({
  icon,
  title,
  value,
  unit,
  status,
  location,
  progressValue,
  progressColor,
  timestamp
}) => {
  // Determine status text color
  const getStatusTextColor = () => {
    switch (progressColor) {
      case 'bg-green-500':
        return 'text-green-400';
      case 'bg-yellow-500':
        return 'text-yellow-400';
      case 'bg-red-500':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-gray-700 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg text-white">{title}</h3>
            <p className="text-gray-400 text-xs">{location}</p>
          </div>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusTextColor()} bg-opacity-20 ${progressColor.replace('bg-', 'bg-opacity-20 bg-')}`}>
          {status}
        </span>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-3xl font-bold text-white">
            {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}{unit}
          </span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${progressColor} transition-all duration-500 ease-in-out`} 
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;