import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Case, Client, DebtorAgreement, ContractType } from '../types';
import { Wallet, Users } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const FinancialsPage: React.FC = () => {
  const { cases, clients, debtorAgreements, settings, loading } = useAppData();

  const caseFinancials = cases
    .filter(c => !c.isDeleted && c.contractType)
    .map(c => ({
      ...c,
      clientName: clients.find(cl => cl.id === c.clientId)?.name || 'Desconhecido',
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }
  
  const renderContractInfo = (c: Case) => {
    switch(c.contractType) {
        case ContractType.PRO_LABORE:
        case ContractType.RETAINER:
        case ContractType.MIXED:
            return formatCurrency(c.contractValue, settings.privacyModeEnabled);
        case ContractType.HOURLY:
            return `${formatCurrency(c.contractValue, settings.privacyModeEnabled)} / hora`;
        case ContractType.AD_EXITUM:
            return `${c.successFeePercentage || 0}% de êxito`;
        default:
            return '---';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-2">
            <Wallet size={32} className="text-accent mr-3" />
            <h1 className="text-3xl font-bold text-text-primary">Controle Financeiro</h1>
        </div>
        <p className="text-text-secondary">Monitore os contratos de honorários e acordos de devedores.</p>
      </div>
      
      {/* Honorários Section */}
      <div className="bg-card-bg shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-text-primary p-4 bg-slate-50 border-b border-border-color">Controle de Honorários dos Processos</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-color">
            <thead className="bg-slate-50">
                <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Processo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Tipo de Contrato</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Valor / Condição</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status do Processo</th>
                </tr>
            </thead>
            <tbody className="bg-card-bg divide-y divide-border-color">
                {caseFinancials.length > 0 ? caseFinancials.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{c.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{c.clientName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{c.contractType}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary font-medium">{renderContractInfo(c)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{c.status}</td>
                </tr>
                )) : (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-text-secondary">
                        Nenhum processo com contrato de honorários definido.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
      
      {/* Debtor Agreements Section */}
      <div className="bg-card-bg shadow-lg rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-border-color">
            <h2 className="text-xl font-semibold text-text-primary ">Controle de Acordos com Devedores</h2>
            {/* <button className="bg-accent text-white px-3 py-1 rounded-lg text-sm shadow">Novo Acordo</button> */}
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-color">
            <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Devedor</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Valor do Acordo</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Parcelas</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Próx. Vencimento</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-card-bg divide-y divide-border-color">
                 {debtorAgreements.length > 0 ? debtorAgreements.map((agreement) => (
                    <tr key={agreement.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{agreement.debtorName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{formatCurrency(agreement.agreementValue, settings.privacyModeEnabled)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{`${agreement.installmentsPaid}/${agreement.installments}`}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{agreement.nextDueDate ? formatDate(agreement.nextDueDate) : '---'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{agreement.status}</td>
                    </tr>
                 )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-text-secondary">
                        Nenhum acordo de devedores cadastrado. (Funcionalidade em desenvolvimento)
                        </td>
                    </tr>
                 )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage;