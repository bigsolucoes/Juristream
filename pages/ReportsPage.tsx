import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { Case, Client, CaseType, CaseStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-card-bg p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold text-text-primary mb-4">{title}</h2>
    <div className="h-72 md:h-96">
      {children}
    </div>
  </div>
);

const KPICard: React.FC<{ title: string; value: string | number; isCurrency?: boolean; privacyModeEnabled?: boolean }> = 
  ({ title, value, isCurrency = false, privacyModeEnabled = false }) => (
  <div className="bg-card-bg p-6 rounded-xl shadow-lg text-center">
    <h3 className="text-md font-medium text-text-secondary mb-1">{title}</h3>
    <p className="text-3xl font-bold text-accent">
      {isCurrency 
        ? formatCurrency(typeof value === 'number' ? value : parseFloat(value.toString()), privacyModeEnabled) 
        : value
      }
    </p>
  </div>
);

const ReportsPage: React.FC = () => {
  const { cases, clients, settings, loading } = useAppData();

  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }
  const privacyMode = settings.privacyModeEnabled || false;
  const accentColor = settings.accentColor || '#0d47a1'; 
  const activeCases = cases.filter(c => !c.isDeleted);

  // KPIs
  const totalContractValue = activeCases.reduce((sum, c) => sum + (c.contractValue || 0), 0);
  const successRate = activeCases.length > 0 ? (activeCases.filter(c => c.status === CaseStatus.ENCERRADO_EXITO).length / activeCases.filter(c => c.status.startsWith('Encerrado')).length * 100) : 0;
  
  // Casos Encerrados por Mês
  const monthlyClosedCases = activeCases
    .filter(c => c.status.startsWith('Encerrado'))
    .reduce((acc, c) => {
        // This is a simplification. In a real app, you'd have a 'closedAt' date.
        // We'll use createdAt for demonstration.
        const date = new Date(c.createdAt);
        if (isNaN(date.getTime())) return acc;
        const yearMonthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        acc[yearMonthKey] = (acc[yearMonthKey] || 0) + 1;
        return acc;
    }, {} as {[key: string]: number});
  
  const closedCasesData = Object.entries(monthlyClosedCases)
    .map(([key, count]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return { name: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit'}), Quantidade: count, key };
    })
    .sort((a,b) => a.key.localeCompare(b.key)).slice(-12);

  // Receita por Área do Direito
  const revenueByArea = Object.values(CaseType).map(area => {
    const total = activeCases
      .filter(c => c.caseType === area && c.contractValue)
      .reduce((sum, c) => sum + (c.contractValue || 0), 0);
    return { name: area, value: total };
  }).filter(s => s.value > 0);
  
  // Top Clientes por Valor de Contrato
  const clientRevenue = clients.map(client => {
    const total = activeCases
      .filter(c => c.clientId === client.id && c.contractValue)
      .reduce((sum, c) => sum + (c.contractValue || 0), 0);
    return { name: client.name, value: total };
  }).filter(c => c.value > 0).sort((a,b) => b.value - a.value).slice(0,5); 

  const PIE_COLORS = [accentColor, '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A0522D', '#D2691E'];
  const currencyTooltipFormatter = (value: number) => [formatCurrency(value, privacyMode), "Valor"];
  const currencyAxisTickFormatter = (value: number) => privacyMode ? 'R$•••' : `R$${value/1000}k`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Relatórios de Desempenho</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        <KPICard title="Valor Total em Contratos" value={totalContractValue} isCurrency={true} privacyModeEnabled={privacyMode} />
        <KPICard title="Taxa de Êxito (Processos Encerrados)" value={isNaN(successRate) ? 'N/A' : `${successRate.toFixed(1)}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Casos Encerrados por Mês">
            {closedCasesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={closedCasesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    <Bar dataKey="Quantidade" fill={accentColor} radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            ) : <p className="text-text-secondary text-center pt-10">Dados insuficientes.</p>}
        </ChartCard>
        
        <ChartCard title="Valor Contratado por Área do Direito">
          {revenueByArea.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={revenueByArea} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={currencyAxisTickFormatter} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip formatter={currencyTooltipFormatter} />
                <Bar dataKey="value" fill={accentColor} radius={[0, 4, 4, 0]} barSize={20}>
                    {revenueByArea.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ): <p className="text-text-secondary text-center pt-10">Dados insuficientes.</p>}
        </ChartCard>

        <ChartCard title="Top 5 Clientes (por Valor Contratado)">
           {clientRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={clientRevenue} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" cy="50%" 
                    outerRadius={100} 
                    labelLine={false} 
                    label={({ name, percent }) => privacyMode ? `${name} (•••%)` : `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {clientRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value, privacyMode)}/>
                <Legend wrapperStyle={{fontSize: "14px"}}/>
              </PieChart>
            </ResponsiveContainer>
           ) : <p className="text-text-secondary text-center pt-10">Dados insuficientes.</p>}
        </ChartCard>
      </div>
    </div>
  );
};

export default ReportsPage;
