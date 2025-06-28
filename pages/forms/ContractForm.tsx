

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Contract, ContractType, ContractStatus } from '../../types';
import toast from 'react-hot-toast';
import { CONTRACT_TYPE_OPTIONS } from '../../constants';

interface ContractFormProps {
  onSuccess: () => void;
  contractToEdit?: Contract;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSuccess, contractToEdit }) => {
    const { cases, clients, addContract, updateContract } = useAppData();
    const [name, setName] = useState('');
    const [caseId, setCaseId] = useState('');
    const [clientId, setClientId] = useState('');
    const [contractType, setContractType] = useState<ContractType>(ContractType.PRO_LABORE);
    const [status, setStatus] = useState<ContractStatus>(ContractStatus.DRAFT);
    const [value, setValue] = useState<number | undefined>();
    const [successFeePercentage, setSuccessFeePercentage] = useState<number | undefined>();
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState<{name: string, mimeType: string, data: string} | null>(null);

    useEffect(() => {
        if (contractToEdit) {
            setName(contractToEdit.name);
            setCaseId(contractToEdit.caseId);
            setClientId(contractToEdit.clientId);
            setContractType(contractToEdit.contractType);
            setStatus(contractToEdit.status);
            setValue(contractToEdit.value);
            setSuccessFeePercentage(contractToEdit.successFeePercentage);
            setStartDate(new Date(contractToEdit.startDate).toISOString().split('T')[0]);
            setDescription(contractToEdit.description || '');
            if (contractToEdit.attachmentData) {
                setAttachment({
                    name: contractToEdit.attachmentName || 'arquivo',
                    mimeType: contractToEdit.attachmentMimeType || 'application/octet-stream',
                    data: contractToEdit.attachmentData
                });
            } else {
                setAttachment(null);
            }
        } else {
            // Reset form
            setName('');
            setCaseId(cases.length > 0 ? cases[0].id : '');
            setClientId(clients.length > 0 ? clients[0].id : '');
            setContractType(ContractType.PRO_LABORE);
            setStatus(ContractStatus.DRAFT);
            setValue(undefined);
            setSuccessFeePercentage(undefined);
            setStartDate(new Date().toISOString().split('T')[0]);
            setDescription('');
            setAttachment(null);
        }
    }, [contractToEdit, cases, clients]);

    useEffect(() => {
        // Auto-select client when case changes
        const selectedCase = cases.find(c => c.id === caseId);
        if (selectedCase) {
            setClientId(selectedCase.clientId);
        }
    }, [caseId, cases]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error("Arquivo muito grande. Máximo 10MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({
                    name: file.name,
                    mimeType: file.type,
                    data: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !caseId || !clientId) {
            toast.error("Nome, Processo e Cliente são obrigatórios.");
            return;
        }

        const contractData = {
            name, caseId, clientId, contractType, status, startDate,
            value: [ContractType.PRO_LABORE, ContractType.RETAINER, ContractType.HOURLY, ContractType.MIXED].includes(contractType) ? value : undefined,
            successFeePercentage: [ContractType.AD_EXITUM, ContractType.MIXED].includes(contractType) ? successFeePercentage : undefined,
            description,
            attachmentName: attachment?.name,
            attachmentMimeType: attachment?.mimeType,
            attachmentData: attachment?.data,
        };

        if (contractToEdit) {
            updateContract({ ...contractToEdit, ...contractData });
            toast.success("Contrato atualizado!");
        } else {
            addContract(contractData);
            toast.success("Contrato criado!");
        }
        onSuccess();
    };

    const commonInputClass = "w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-800 outline-none transition-shadow bg-white";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nome do Contrato" value={name} onChange={e => setName(e.target.value)} className={commonInputClass} required />
            <select value={caseId} onChange={e => setCaseId(e.target.value)} className={commonInputClass} required>
                <option value="">Selecione um Processo</option>
                {cases.filter(c => !c.isDeleted).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className={commonInputClass} required disabled>
                <option value="">Selecione um Cliente</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={contractType} onChange={e => setContractType(e.target.value as ContractType)} className={commonInputClass}>
                {CONTRACT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
             {(contractType === ContractType.PRO_LABORE || contractType === ContractType.RETAINER || contractType === ContractType.HOURLY || contractType === ContractType.MIXED) && (
                <input type="number" placeholder="Valor (R$)" value={value || ''} onChange={e => setValue(Number(e.target.value))} className={commonInputClass} />
            )}
            {(contractType === ContractType.AD_EXITUM || contractType === ContractType.MIXED) && (
                <input type="number" placeholder="% de Êxito" value={successFeePercentage || ''} onChange={e => setSuccessFeePercentage(Number(e.target.value))} className={commonInputClass} />
            )}
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={commonInputClass} />
            <select value={status} onChange={e => setStatus(e.target.value as ContractStatus)} className={commonInputClass}>
                {Object.values(ContractStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div>
                 <label className="block text-sm font-medium text-slate-500 mb-1">Anexo do Contrato (Opcional)</label>
                 <input type="file" onChange={handleFileChange} className={`${commonInputClass} file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700`} />
                 {attachment && !contractToEdit?.attachmentData && <p className="text-xs text-slate-500 mt-1">Anexo atual: {attachment.name}</p>}
                 {contractToEdit?.attachmentName && <p className="text-xs text-slate-500 mt-1">Anexo salvo: {contractToEdit.attachmentName}</p>}
            </div>
            <textarea placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} className={commonInputClass} rows={3}></textarea>
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">{contractToEdit ? 'Salvar' : 'Criar'}</button>
            </div>
        </form>
    );
};

export default ContractForm;