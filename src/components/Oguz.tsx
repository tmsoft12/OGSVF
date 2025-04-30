import React from 'react';

const BottomBar: React.FC = () => {
  return (
    <div className="bg-gray-900 text-center py-3 text-white text-sm fixed bottom-0 left-0 w-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:translate-y-1">
      <span className="font-cursive text-2xl uppercase tracking-wider animate-pulse text-shadow-xl hover:text-teal-400">
        Oguzhan University
      </span>
    </div>
  );
};

export default BottomBar;
