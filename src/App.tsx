import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminPage from './components/AdminPage';
import History from './components/admin/History';
import HistoryDetail from './pages/history/HistoryDetail';
import { WebSocketProvider } from './context/WebSocketContext';

function App() {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:category" element={<HistoryDetail />} />
        </Routes>
      </div>
    </WebSocketProvider>
  );
}

export default App;
