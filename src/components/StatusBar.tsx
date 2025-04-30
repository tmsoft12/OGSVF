import React from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const StatusBar: React.FC = () => {
  const { sensorData, connected } = useWebSocket();
  
  // Count sensors by status
  const statusCounts = sensorData.reduce(
    (acc, sensor) => {
      acc[sensor.status] = (acc[sensor.status] || 0) + 1;
      return acc;
    },
    { normal: 0, warning: 0, critical: 0 } as Record<string, number>
  );
  
  // Check if any alerts are active
  const hasAlerts = statusCounts.warning > 0 || statusCounts.critical > 0;
  
  return (
    <div className="bg-gray-900 fixed bottom-0 left-0 w-full p-4 shadow-lg border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-3 md:mb-0">
        {hasAlerts ? (
          <AlertCircle size={20} className="text-red-500 mr-2" />
        ) : (
          <CheckCircle2 size={20} className="text-green-500 mr-2" />
        )}
        <span className="text-white font-medium">
          {hasAlerts 
            ? `Alert${statusCounts.warning + statusCounts.critical > 1 ? 's' : ''} Active` 
            : 'All Systems Normal'}
        </span>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-300 text-sm">{statusCounts.normal} Normal</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-gray-300 text-sm">{statusCounts.warning} Warning</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-gray-300 text-sm">{statusCounts.critical} Critical</span>
        </div>
      </div>
      
      {/* <div className="text-gray-400 text-xs mt-3 md:mt-0">
        {connected ? 'Data updating in real-time' : 'Connection lost'}
      </div> */}
    </div>
  );
};

export default StatusBar;
