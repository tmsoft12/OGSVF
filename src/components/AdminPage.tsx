import React from 'react';
import Header from './Header';
import StatusBar from './StatusBar';
import SensorHistory from './admin/History';
import PhoneNumberChange from './admin/Phone';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Header title="Admin" linkTo="/" />
      
      {}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Telefon Belgisini Täzele</h2>
        <PhoneNumberChange  />
      </div>
      <SensorHistory/>
      <footer className="mt-8">
        <StatusBar />
      </footer>
    </div>
  );
};

export default Dashboard;
