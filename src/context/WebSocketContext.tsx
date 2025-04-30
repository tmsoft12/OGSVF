import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessageCallback: (data: any) => void;
  private onConnectCallback: () => void;
  private onDisconnectCallback: () => void;
  private onErrorCallback: (error: string) => void;

  constructor(
    url: string,
    onMessage: (data: any) => void,
    onConnect: () => void,
    onDisconnect: () => void,
    onError: (error: string) => void
  ) {
    this.url = url;
    this.onMessageCallback = onMessage;
    this.onConnectCallback = onConnect;
    this.onDisconnectCallback = onDisconnect;
    this.onErrorCallback = onError;
  }

  public connect(): void {
    try {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => this.onConnectCallback();
      this.socket.onclose = () => this.onDisconnectCallback();
      this.socket.onerror = () => this.onErrorCallback('Connection error');
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessageCallback(data);
        } catch {
          this.onErrorCallback('Failed to parse message');
        }
      };
    } catch {
      this.onErrorCallback('Failed to establish connection');
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'fire' | 'door' | 'motion';
  value: number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  location?: string;
}

interface WebSocketContextType {
  sensorData: SensorData[];
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({ sensorData: [], connected: false });

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

interface RawSensorData {
  timestamp: string;
  topic: string;
  value: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const processIncomingData = (rawData: RawSensorData): SensorData | null => {
    const sensorType = rawData.topic.split('/')[1];
    let type: SensorData['type'];
    let name: string = '';
    let unit: string = '';

    switch (sensorType) {
      case 'temprature':
        type = 'temperature';
        name = 'Temperature';
        unit = '°C';
        break;
      case 'humintity':
        type = 'humidity';
        name = 'Humidity';
        unit = '%';
        break;
      case 'fire':
        type = 'fire';
        name = 'Fire Detection';
        break;
      case 'door':
        type = 'door';
        name = 'Door Status';
        break;
      case 'motion':
        type = 'motion';
        name = 'Motion Detection';
        break;
      default:
        return null;
    }

    return {
      id: type,
      name,
      type,
      value: parseFloat(rawData.value),
      unit,
      status: 'normal',
      timestamp: rawData.timestamp,
      location: 'Server Room',
    };
  };

  useEffect(() => {
    const wsService = new WebSocketService(
      'ws://192.168.100.220:3000/ws',
      (data: RawSensorData) => {
        const processedData = processIncomingData(data);
        if (processedData) {
          const withStatus = {
            ...processedData,
            status: determineStatus(processedData),
          };
          setSensorData((prev) => {
            const exist = prev.find((s) => s.id === withStatus.id);
            if (exist) {
              return prev.map((s) => (s.id === withStatus.id ? withStatus : s));
            }
            return [...prev, withStatus];
          });
        }
      },
      () => setConnected(true),
      () => setConnected(false),
      () => setConnected(false)
    );

    wsService.connect();
    return () => {
      wsService.disconnect();
    };
  }, []);

  const determineStatus = (sensor: SensorData): 'normal' | 'warning' | 'critical' => {
    switch (sensor.type) {
      case 'temperature':
        if (sensor.value > 29) return 'critical';
        if (sensor.value > 28 || sensor.value < 15) return 'warning';
        if (sensor.value < 10) return 'critical';
        return 'normal';
      case 'humidity':
        if (sensor.value > 80) return 'critical';
        if (sensor.value < 35 || sensor.value > 65) return 'warning';
        return 'normal';
      case 'fire':
        return sensor.value === 1 ? 'critical' : 'normal';
      case 'door':
        return sensor.value === 1 ? 'warning' : 'normal';
      case 'motion':
        return sensor.value === 1 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <WebSocketContext.Provider value={{ sensorData, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

interface SensorCardProps {
  sensor: SensorData;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const getStatusColor = (status: SensorData['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const formatValue = (sensor: SensorData) => {
    if (sensor.type === 'motion') return sensor.value === 1 ? 'Motion Detected' : 'No Motion';
    if (sensor.type === 'fire') return sensor.value === 1 ? 'Fire Detected' : 'No Fire';
    if (sensor.type === 'door') return sensor.value === 1 ? 'Door Open' : 'Door Closed';
    return `${sensor.value}${sensor.unit || ''}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{sensor.name}</h3>
      <p className="text-gray-600">Value: {formatValue(sensor)}</p>
      <p className="text-gray-600">Status: {sensor.status}</p>
      <p className="text-gray-600">Time: {new Date(sensor.timestamp).toLocaleString()}</p>
      <p className="text-gray-600">Location: {sensor.location}</p>
      <div className={`w-4 h-4 rounded-full ${getStatusColor(sensor.status)}`}></div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { sensorData, connected } = useWebSocket();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Server Room Monitoring Dashboard</h1>
      {!connected && <p className="text-red-500">WebSocket connection lost</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorData.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
