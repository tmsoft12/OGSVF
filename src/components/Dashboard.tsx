import React from 'react';
import Header from './Header';
import SensorGrid from './SensorGrid';
import StatusBar from './StatusBar';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Header />
      <main className="mt-8">
        <SensorGrid />
      </main>
      <footer className="mt-8">
        <StatusBar />
      </footer>
    </div>
  );
};

export default Dashboard;