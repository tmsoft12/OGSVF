import React, { useState, useEffect } from 'react';
import { Server as ServerStack } from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

const Header: React.FC = () => {
  const { connected } = useWebSocket();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center mb-4 md:mb-0">
        <ServerStack size={36} className="text-blue-400 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-white">Server Otagynyň Gözegçiligi</h1>
   
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="text-3xl font-mono text-white">{formatTime(currentTime)}</div>
        <div className="text-gray-400 text-sm">{formatDate(currentTime)}</div>
      </div>
    </header>
  );
};

export default Header;