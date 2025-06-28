import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { Case, Client, Task, Appointment, CaseStatus } from '../types';
import { PlusCircleIcon, BriefcaseIcon, UsersIcon, CalendarIcon, TaskIcon } from '../constants';
import Modal from '../components/Modal';
import CaseForm from './forms/CaseForm';
import ClientForm from './forms/ClientForm';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';

const DashboardPage: React.FC = () => {
  const { cases, clients, tasks, appointments, settings, loading } = useAppData();
  const [isCaseModalOpen, setCaseModalOpen] = React.useState(false);
  const [isClientModalOpen, setClientModalOpen] = React.useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next7Days = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  const activeCasesCount = cases.filter(c => c.status === CaseStatus.ATIVO).length;
  const deadlinesThisWeekCount = tasks.filter(t => !t.isCompleted && new Date(t.dueDate) >= todayStart && new Date(t.dueDate) <= next7Days).length;
  const appointmentsTodayCount = appointments.filter(a => {
    const appDate = new Date(a.date);
    return appDate.getFullYear() === todayStart.getFullYear() && appDate.getMonth() === todayStart.getMonth() && appDate.getDate() === todayStart.getDate();
  }).length;
  
  const caseStatusCounts = cases.reduce((acc, c) => {
    if (c.isDeleted) return acc;
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  const caseStatusData = Object.entries(caseStatusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = {
    [CaseStatus.ATIVO]: '#007AFF',
    [CaseStatus.SUSPENSO]: '#eab308',
    [CaseStatus.ENCERRADO_EXITO]: '#16a34a',
    [CaseStatus.ENCERRADO_SEM_EXITO]: '#ef4444',
    [CaseStatus.ARQUIVADO]: '#6b7280',
  };

  const upcomingEvents = [
    ...tasks.filter(t => !t.isCompleted && new Date(t.dueDate) >= todayStart),
    ...appointments.filter(a => new Date(a.date) >= todayStart)
  ]
  .map(item => 'dueDate' in item ? 
    { ...item, date: item.dueDate, type: item.type } : 
    { ...item, date: item.date, type: item.appointmentType }
  )
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 5);


  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string; linkTo: string; }> = 
    ({ title, value, icon, color = 'text-accent', linkTo }) => (
    <Link to={linkTo} className="block bg-card-bg p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')} ${color}`}>{icon}</div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">
                {settings.userName ? `Olá, ${settings.userName}!` : 'Painel de Controle'}
            </h1>
            <p className="text-text-secondary">Bem-vindo(a) ao seu painel Juristream.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setCaseModalOpen(true)} className="bg-accent text-white px-4 py-2 rounded-lg shadow hover:brightness-90 transition-all flex items-center">
            <PlusCircleIcon size={20} /> <span className="ml-2">Novo Processo</span>
          </button>
          <button onClick={() => setClientModalOpen(true)} className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-600 transition-colors flex items-center">
            <PlusCircleIcon size={20} /> <span className="ml-2">Novo Cliente</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Processos Ativos" value={activeCasesCount} icon={<BriefcaseIcon size={24} />} color="text-blue-500" linkTo="/processos" />
        <StatCard title="Prazos (7 dias)" value={deadlinesThisWeekCount} icon={<TaskIcon size={24} />} color="text-red-500" linkTo="/tarefas" />
        <StatCard title="Compromissos (Hoje)" value={appointmentsTodayCount} icon={<CalendarIcon size={24} />} color="text-green-500" linkTo="/agenda" />
        <StatCard title="Total Clientes" value={clients.length} icon={<UsersIcon size={24} />} color="text-purple-500" linkTo="/clientes" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-bg p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Visão Geral dos Processos</h2>
          {caseStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={caseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {caseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} processo(s)`}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-text-secondary">Nenhum processo para exibir.</p>}
        </div>

        <div className="bg-card-bg p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Próximos Prazos e Compromissos</h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-3">
              {upcomingEvents.map(event => (
                <li key={event.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-text-primary">{event.title}</span>
                    <span className="text-sm font-semibold text-accent">{formatDate(event.date, {month: 'short', day: 'numeric'})}</span>
                  </div>
                  <p className="text-xs text-text-secondary">Tipo: {event.type}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-text-secondary">Nenhum evento futuro.</p>}
        </div>
      </div>

      <Modal isOpen={isCaseModalOpen} onClose={() => setCaseModalOpen(false)} title="Adicionar Novo Processo">
        <CaseForm onSuccess={() => setCaseModalOpen(false)} />
      </Modal>
      <Modal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)} title="Adicionar Novo Cliente">
        <ClientForm onSuccess={() => setClientModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DashboardPage;