import React, { useState, useEffect } from "react";
import { Server as ServerStack, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  showSettingsIcon?: boolean;
  linkTo?: string; // Dinamik linkTo prop'u
}

const Header: React.FC<HeaderProps> = ({ title, showSettingsIcon = true, linkTo = "/admin" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center mb-4 md:mb-0">
        <ServerStack size={36} className="text-blue-400 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1> {/* Dinamik title */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-3xl font-mono text-white">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-400 text-sm">{formatDate(currentTime)}</div>
        </div>

        {/* Admin Icon Button */}
        {showSettingsIcon && (
          <Link
            to={linkTo} // Dinamik yönlendirme yapılacak URL
            className="text-white p-3 rounded-full hover:bg-blue-600 hover:scale-110 transition-all border border-gray-600"
            title="Admin Paneline Git"
          >
            <Settings size={28} />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
