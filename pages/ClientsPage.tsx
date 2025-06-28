

import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Client, Case } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, BriefcaseIcon, UsersIcon, ArchiveFolderIcon, RestoreIcon } from '../constants';
import Modal from '../components/Modal';
import ClientForm from './forms/ClientForm';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ClientCard from '../components/ClientCard'; 
import { formatDate } from '../utils/formatters';

const ClientsPage: React.FC = () => {
  const { clients, cases, softDeleteClient, restoreClient, toggleClientArchive, permanentlyDeleteClient, loading } = useAppData();
  const { view } = useParams<{ view: 'lixeira' | 'arquivados' }>();
  const navigate = useNavigate();
  
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  
  const handleAddClient = () => {
    setSelectedClient(undefined);
    setFormModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setDetailsModalOpen(false); // Close details if open
    setFormModalOpen(true);
  };
  
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setDetailsModalOpen(true);
  };

  const handleSoftDelete = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja mover este cliente para a lixeira?')) {
      softDeleteClient(clientId);
      toast.success('Cliente movido para a lixeira!');
      if(selectedClient?.id === clientId) setDetailsModalOpen(false);
    }
  };
  
  const handlePermanentDelete = (clientId: string) => {
     if (window.confirm('Esta ação é irreversível. Deseja excluir permanentemente este cliente?')) {
      permanentlyDeleteClient(clientId);
      toast.success('Cliente excluído permanentemente.');
      if(selectedClient?.id === clientId) setDetailsModalOpen(false);
    }
  }

  const handleRestore = (clientId: string) => {
      restoreClient(clientId);
      toast.success('Cliente restaurado!');
  }

  const handleToggleArchive = (clientId: string) => {
      toggleClientArchive(clientId);
      toast.success('Status de arquivamento do cliente alterado!');
  }
  
  const handleFormSuccess = () => {
    setFormModalOpen(false);
    setSelectedClient(undefined);
  };

  const handleCaseClick = (caseId: string) => {
      setDetailsModalOpen(false);
      // Ideally, this would navigate to the specific case detail page
      // For now, it navigates to the main cases page.
      navigate('/processos');
  }

  const activeClients = useMemo(() => clients.filter(c => !c.isDeleted && !c.isArchived), [clients]);
  const trashedClients = useMemo(() => clients.filter(c => c.isDeleted), [clients]);
  const archivedClients = useMemo(() => clients.filter(c => !c.isDeleted && c.isArchived), [clients]);

  const clientsToDisplay = view === 'lixeira' ? trashedClients : view === 'arquivados' ? archivedClients : activeClients;
  const pageTitle = view === 'lixeira' ? 'Lixeira de Clientes' : view === 'arquivados' ? 'Clientes Arquivados' : 'Clientes';
  
  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
        <div className="flex items-center space-x-3">
            <Link to="/clientes/lixeira" className={`flex items-center space-x-1.5 text-sm p-2 rounded-lg ${view === 'lixeira' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}><TrashIcon size={16}/><span>Lixeira</span></Link>
            <Link to="/clientes/arquivados" className={`flex items-center space-x-1.5 text-sm p-2 rounded-lg ${view === 'arquivados' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}><ArchiveFolderIcon size={16}/><span>Arquivados</span></Link>
             <button onClick={handleAddClient} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all flex items-center">
                <PlusCircleIcon size={20} /> <span className="ml-2">Novo Cliente</span>
            </button>
        </div>
      </div>
      
      {view && <Link to="/clientes" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Voltar para Clientes Ativos</Link>}

      {clientsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientsToDisplay.sort((a,b) => a.name.localeCompare(b.name)).map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              cases={cases.filter(c => c.clientId === client.id)}
              onView={handleViewClient}
              onEdit={handleEditClient}
              onSoftDelete={handleSoftDelete}
              onToggleArchive={handleToggleArchive}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
              isArchivedView={!!view}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl shadow">
          <UsersIcon size={48} className="mx-auto text-slate-300 mb-4"/>
          <p className="text-xl text-slate-500">Nenhum cliente encontrado nesta visualização.</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedClient && (
         <Modal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="Detalhes do Cliente" size="lg">
            <div className="space-y-4">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedClient.name}</h3>
                    <p className="text-slate-500">{selectedClient.company}</p>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Email:</strong> {selectedClient.email}</p>
                    <p><strong>Telefone:</strong> {selectedClient.phone || 'N/A'}</p>
                    <p><strong>CPF/CNPJ:</strong> {selectedClient.cpf || 'N/A'}</p>
                    <p><strong>Cliente desde:</strong> {formatDate(selectedClient.createdAt)}</p>
                </div>
                {selectedClient.observations && (
                    <div>
                        <h4 className="font-semibold text-slate-700">Observações:</h4>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md mt-1 whitespace-pre-wrap">{selectedClient.observations}</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Processos Vinculados:</h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {cases.filter(c => c.clientId === selectedClient.id && !c.isDeleted).map(c => (
                            <li key={c.id}>
                                <div onClick={() => handleCaseClick(c.id)} className="text-sm p-2 bg-slate-100 rounded-md flex items-center hover:bg-blue-100 hover:text-blue-800 cursor-pointer transition-colors">
                                    <BriefcaseIcon size={14} className="mr-2 text-slate-500" />
                                    <span className="flex-grow">{c.name}</span>
                                </div>
                            </li>
                        ))}
                         {cases.filter(c => c.clientId === selectedClient.id).length === 0 && <li className="text-sm text-slate-400">Nenhum processo vinculado.</li>}
                    </ul>
                </div>
                 <div className="flex justify-end pt-4 border-t mt-4">
                     <button onClick={() => setDetailsModalOpen(false)} className="bg-slate-500 text-white px-4 py-2 rounded-lg shadow mr-2">Fechar</button>
                     <button onClick={() => handleEditClient(selectedClient)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center">
                        <PencilIcon size={16} className="mr-1" /> Editar
                     </button>
                 </div>
            </div>
        </Modal>
      )}

      {/* Form Modal */}
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title={selectedClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'} size="lg">
        <ClientForm onSuccess={handleFormSuccess} clientToEdit={selectedClient} />
      </Modal>
    </div>
  );
};

export default ClientsPage;