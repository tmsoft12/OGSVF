import React from 'react';
import Dashboard from './components/Dashboard';
import { WebSocketProvider } from './context/WebSocketContext';

function App() {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Dashboard />
      </div>
    </WebSocketProvider>
  );
}

export default App;