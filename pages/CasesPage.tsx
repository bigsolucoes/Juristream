import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Case, Client, CaseStatus } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../constants';
import Modal from '../components/Modal';
import CaseForm from './forms/CaseForm';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const getStatusClass = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ATIVO: return 'bg-blue-100 text-blue-700';
      case CaseStatus.SUSPENSO: return 'bg-yellow-100 text-yellow-700';
      case CaseStatus.ENCERRADO_EXITO: return 'bg-green-100 text-green-700';
      case CaseStatus.ENCERRADO_SEM_EXITO: return 'bg-red-100 text-red-700';
      case CaseStatus.ARQUIVADO: return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

const CasesPage: React.FC = () => {
    const { cases, clients, deleteCase, loading } = useAppData();
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<Case | undefined>(undefined);
    const [filter, setFilter] = useState<string>('all');
    
    const activeCases = useMemo(() => {
        return cases.filter(c => !c.isDeleted);
    }, [cases]);

    const filteredCases = useMemo(() => {
        if (filter === 'all') return activeCases;
        return activeCases.filter(c => c.status === filter);
    }, [activeCases, filter]);
    
    const handleAddCase = () => {
        setEditingCase(undefined);
        setFormModalOpen(true);
    };

    const handleEditCase = (caseToEdit: Case) => {
        setEditingCase(caseToEdit);
        setFormModalOpen(true);
    };
    
    const handleDeleteCase = (caseId: string) => {
        if (window.confirm('Tem certeza que deseja arquivar este processo? Ele poderá ser recuperado posteriormente.')) {
            deleteCase(caseId); // This is a soft delete
            toast.success('Processo arquivado!');
        }
    };

    const handleFormSuccess = () => {
        setFormModalOpen(false);
        setEditingCase(undefined);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    return(
        <div className="h-full flex flex-col">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text-primary">Gerenciamento de Processos</h1>
                <button
                    onClick={handleAddCase}
                    className="bg-accent text-white px-4 py-2 rounded-lg shadow hover:brightness-90 transition-all flex items-center"
                >
                    <PlusCircleIcon size={20} /> <span className="ml-2">Adicionar Processo</span>
                </button>
            </div>

            {/* TODO: Add filter buttons here */}

            <div className="bg-card-bg shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-color">
                    <thead className="bg-slate-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nome / N° do Processo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Cliente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Tipo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Responsável</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card-bg divide-y divide-border-color">
                        {filteredCases.length > 0 ? filteredCases.map((c) => {
                        const client = clients.find(cl => cl.id === c.clientId);
                        return (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-text-primary">{c.name}</div>
                                <div className="text-xs text-text-secondary">{c.caseNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{client?.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.caseType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.responsibleLawyers.join(', ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(c.status)}`}>
                                {c.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button onClick={() => handleEditCase(c)} className="text-slate-500 hover:text-accent p-1" title="Editar Processo"><PencilIcon /></button>
                                <button onClick={() => handleDeleteCase(c.id)} className="text-slate-500 hover:text-red-500 p-1" title="Arquivar Processo"><TrashIcon /></button>
                            </td>
                            </tr>
                        );
                        }) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-sm text-text-secondary">
                            Nenhum processo para exibir.
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title={editingCase ? 'Editar Processo' : 'Adicionar Novo Processo'} size="lg">
                <CaseForm onSuccess={handleFormSuccess} caseToEdit={editingCase} />
            </Modal>
        </div>
    );
}

export default CasesPage;
