import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Client, Case, CaseStatus } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, BriefcaseIcon } from '../constants';
import Modal from '../components/Modal';
import ClientForm from './forms/ClientForm';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ClientCardProps {
  client: Client;
  cases: Case[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  privacyModeEnabled: boolean;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, cases, onEdit, onDelete, privacyModeEnabled }) => {
  const clientCases = cases.filter(c => c.clientId === client.id && !c.isDeleted);
  const activeCasesCount = clientCases.filter(c => c.status === CaseStatus.ATIVO).length;
  const totalBilled = clientCases.reduce((sum, c) => sum + (c.contractValue || 0), 0);

  return (
    <div className="bg-card-bg p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">{client.name}</h3>
            {client.company && <p className="text-sm text-text-secondary">{client.company}</p>}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button onClick={() => onEdit(client)} className="text-slate-500 hover:text-accent p-1" title="Editar Cliente"><PencilIcon size={18} /></button>
            <button onClick={() => onDelete(client.id)} className="text-slate-500 hover:text-red-500 p-1" title="Excluir Cliente"><TrashIcon size={18} /></button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-text-secondary"><strong>Email:</strong> {client.email}</p>
          {client.phone && <p className="text-sm text-text-secondary"><strong>Telefone:</strong> {client.phone}</p>}
          {client.cpf && <p className="text-sm text-text-secondary"><strong>CPF/CNPJ:</strong> {client.cpf}</p>}
          <p className="text-sm text-text-secondary"><strong>Cliente desde:</strong> {formatDate(client.createdAt)}</p>
          {client.observations && (
            <div className="mt-2 pt-2 border-t border-border-color">
                <p className="text-sm font-medium text-text-secondary">Observações:</p>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{client.observations}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="flex items-center text-text-primary">
          <BriefcaseIcon size={20} />
          <span className="ml-2">Total de Processos Ativos: {activeCasesCount}</span>
        </div>
         <p className="text-sm text-text-secondary mt-1">Valor total contratado: {formatCurrency(totalBilled, privacyModeEnabled)}</p>
      </div>
    </div>
  );
};


const ClientsPage: React.FC = () => {
  const { clients, cases, deleteClient, settings, loading } = useAppData();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  const handleAddClient = () => {
    setEditingClient(undefined);
    setModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    const associatedCasesCount = cases.filter(c => c.clientId === clientId && !c.isDeleted).length;
    let confirmMessage = 'Tem certeza que deseja excluir este cliente?';
    if (associatedCasesCount > 0) {
      confirmMessage += `\nExistem ${associatedCasesCount} processo(s) associados a este cliente. Eles não serão removidos, mas o cliente não poderá ser selecionado para novos processos.`;
    }

    if (window.confirm(confirmMessage)) {
      deleteClient(clientId);
      toast.success('Cliente excluído com sucesso!');
    }
  };
  
  const handleFormSuccess = () => {
    setModalOpen(false);
    setEditingClient(undefined);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Clientes</h1>
        <button
          onClick={handleAddClient}
          className="bg-accent text-white px-4 py-2 rounded-lg shadow hover:brightness-90 transition-all flex items-center"
        >
          <PlusCircleIcon size={20} /> <span className="ml-2">Adicionar Novo Cliente</span>
        </button>
      </div>

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.sort((a,b) => a.name.localeCompare(b.name)).map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              cases={cases} 
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              privacyModeEnabled={settings.privacyModeEnabled || false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-text-secondary">Nenhum cliente cadastrado ainda.</p>
          <p className="mt-2 text-text-secondary">Clique em "Adicionar Novo Cliente" para começar.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'} size="lg">
        <ClientForm onSuccess={handleFormSuccess} clientToEdit={editingClient} />
      </Modal>
    </div>
  );
};

export default ClientsPage;