import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import ClientsPage from './pages/ClientsPage';
import FinancialsPage from './pages/FinancialsPage';
import ReportsPage from './pages/ReportsPage';
import AgendaPage from './pages/AgendaPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import { useAppData } from './hooks/useAppData';
import { Toaster } from 'react-hot-toast';
import RestScreen from './components/RestScreen';

const MainLayout: React.FC = () => {
  return (
    <div 
      className="flex flex-col h-screen bg-main-bg text-text-primary" 
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/processos" element={<CasesPage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/financeiro" element={<FinancialsPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/tarefas" element={<TasksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const App: React.FC = () => {
  const { isRestScreenActive } = useAppData();

  return (
    <>
      {isRestScreenActive && <RestScreen />}
      <div className={isRestScreenActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
        <Routes>
            <Route path="/*" element={<MainLayout />} />
        </Routes>
      </div>
    </>
  );
};

export default App;