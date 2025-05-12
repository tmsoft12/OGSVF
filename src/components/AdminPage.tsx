import React from 'react';
import Header from './Header';
import StatusBar from './StatusBar';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Header title='Admin' linkTo='/' />
   
      <footer className="mt-8">
        <StatusBar />
      </footer>
    </div>
  );
};

export default Dashboard;