


import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Case, Client, CaseStatus, CaseType, Contract, ContractStatus, ContractType, AppSettings, CaseUpdate, Task, Appointment, DebtorAgreement, AppointmentType, Job, DraftNote, TaskStatus, TaskUpdate, AIChatMessage, Installment, InstallmentStatus, Payment, AgreementUpdate } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface AppDataContextType {
  cases: Case[];
  clients: Client[];
  contracts: Contract[];
  tasks: Task[];
  appointments: Appointment[];
  debtorAgreements: DebtorAgreement[];
  jobs: Job[];
  draftNotes: DraftNote[];
  settings: AppSettings;
  aiChatHistory: AIChatMessage[];
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updates' | 'isDeleted' | 'isArchived'>) => void;
  updateCase: (caseData: Case) => void;
  toggleCaseArchive: (caseId: string) => void;
  softDeleteCase: (caseId: string) => void;
  restoreCase: (caseId: string) => void;
  permanentlyDeleteCase: (caseId: string) => void;
  getCaseById: (caseId: string) => Case | undefined;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'isDeleted' | 'isArchived'>) => void;
  updateClient: (client: Client) => void;
  toggleClientArchive: (clientId: string) => void;
  softDeleteClient: (clientId: string) => void;
  restoreClient: (clientId: string) => void;
  permanentlyDeleteClient: (clientId: string) => void;
  getClientById: (clientId: string) => Client | undefined;
  addContract: (contractData: Omit<Contract, 'id' | 'createdAt' | 'isDeleted' | 'isArchived'>) => void;
  updateContract: (contract: Contract) => void;
  toggleContractArchive: (contractId: string) => void;
  softDeleteContract: (contractId: string) => void;
  restoreContract: (contractId: string) => void;
  permanentlyDeleteContract: (contractId: string) => void;
  addTask: (task: Omit<Task, 'id'|'createdAt'|'updates'|'isDeleted'|'isArchived'|'completedAt'>) => void;
  updateTask: (task: Task) => void;
  toggleTaskArchive: (taskId: string) => void;
  softDeleteTask: (taskId: string) => void;
  restoreTask: (taskId: string) => void;
  permanentlyDeleteTask: (taskId: string) => void;
  addTaskUpdate: (taskId: string, updateData: Omit<TaskUpdate, 'id' | 'timestamp'>) => void;
  updateTaskUpdate: (taskId: string, updateData: TaskUpdate) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
  addDebtorAgreement: (agreementData: Omit<DebtorAgreement, 'id' | 'isDeleted' | 'isArchived' | 'updates'>) => void;
  updateDebtorAgreement: (agreement: DebtorAgreement) => void;
  toggleDebtorAgreementArchive: (agreementId: string) => void;
  softDeleteDebtorAgreement: (agreementId: string) => void;
  restoreDebtorAgreement: (agreementId: string) => void;
  permanentlyDeleteDebtorAgreement: (agreementId: string) => void;
  addAgreementUpdate: (agreementId: string, updateData: Omit<AgreementUpdate, 'id' | 'timestamp'>) => void;
  updateAgreementUpdate: (agreementId: string, updateData: AgreementUpdate) => void;
  registerInstallmentPayment: (agreementId: string, installmentId: string, paymentAmount: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addAiChatMessage: (message: AIChatMessage) => void;
  addJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'isDeleted' | 'isPrePaid' | 'paidAt' | 'observationsLog'>) => void;
  updateJob: (jobData: Job) => void;
  deleteJob: (jobId: string) => void; // soft delete
  permanentlyDeleteJob: (jobId: string) => void;
  addDraftNote: (draftData: Omit<DraftNote, 'id' | 'createdAt' | 'updatedAt'>) => DraftNote;
  updateDraftNote: (draftData: DraftNote) => void;
  deleteDraftNote: (draftId: string) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  loading: boolean;
  isResting: boolean;
  enterRestMode: () => void;
  exitRestMode: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialClients: Client[] = [
    { id: 'client1', name: 'GlobalCorp S.A.', company: 'Indústria de Tecnologia', email: 'juridico@globalcorp.com', phone: '11987654321', createdAt: new Date().toISOString(), cpf: '12.345.678/0001-99', observations: 'Cliente estratégico. Priorizar demandas.' },
    { id: 'client2', name: 'Mariana Almeida', email: 'mari.almeida@email.com', createdAt: new Date().toISOString(), cpf: '111.222.333-44', observations: 'Contato preferencial por WhatsApp.' },
];

const initialCases: Case[] = [
    { id: 'case1', name: 'Ação de Cobrança vs. Inovatech', caseNumber: '0012345-67.2023.8.26.0100', clientId: 'client1', court: '15ª Vara Cível de São Paulo', caseType: CaseType.CIVEL, status: CaseStatus.ATIVO, responsibleLawyers: ['Dr. Carlos'], updates: [], createdAt: new Date().toISOString() },
    { id: 'case2', name: 'Reclamação Trabalhista - João da Silva', caseNumber: '1000876-21.2023.5.02.0030', clientId: 'client1', court: '30ª Vara do Trabalho de SP', caseType: CaseType.TRABALHISTA, status: CaseStatus.ATIVO, responsibleLawyers: ['Dra. Beatriz'], updates: [], createdAt: new Date().toISOString() },
    { id: 'case3', name: 'Divórcio Consensual', caseNumber: 'N/A - Extrajudicial', clientId: 'client2', court: 'Tabelionato de Notas', caseType: CaseType.CIVEL, status: CaseStatus.ENCERRADO_EXITO, responsibleLawyers: ['Dr. Carlos'], updates: [], createdAt: new Date().toISOString() },
];

const initialContracts: Contract[] = [
    { id: 'contract1', name: 'Contrato de Êxito - GlobalCorp', caseId: 'case1', clientId: 'client1', contractType: ContractType.AD_EXITUM, status: ContractStatus.ACTIVE, successFeePercentage: 20, startDate: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: 'contract2', name: 'Contrato Fixo - Divórcio', caseId: 'case3', clientId: 'client2', contractType: ContractType.PRO_LABORE, status: ContractStatus.FINISHED, value: 5000, startDate: new Date().toISOString(), createdAt: new Date().toISOString() }
];

const initialTasks: Task[] = [
    { id: uuidv4(), title: 'Protocolar Apelação', type: 'Prazo', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), caseId: 'case1', status: TaskStatus.PENDENTE, assignedTo: 'Dr. Carlos', createdAt: new Date().toISOString(), updates: [] },
    { id: uuidv4(), title: 'Elaborar Contestação', type: 'Tarefa', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), caseId: 'case2', status: TaskStatus.FAZENDO, assignedTo: 'Dra. Beatriz', createdAt: new Date().toISOString(), updates: [] },
    { id: uuidv4(), title: 'Ligar para cliente Mariana', type: 'Tarefa', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), caseId: 'case3', status: TaskStatus.CONCLUIDA, completedAt: new Date().toISOString(), assignedTo: 'Estagiário', createdAt: new Date().toISOString(), updates: [] },
];

const initialAppointments: Appointment[] = [
    { id: uuidv4(), title: 'Audiência de Conciliação - Caso Inovatech', appointmentType: AppointmentType.AUDIENCIA, date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), caseId: 'case1', location: 'Fórum João Mendes Jr.', createCalendarEvent: true },
    { id: uuidv4(), title: 'Reunião com GlobalCorp', appointmentType: AppointmentType.REUNIAO, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), clientId: 'client1', location: 'Escritório', createCalendarEvent: true },
];

const initialDebtorAgreements: DebtorAgreement[] = [
    {
        id: 'agreement1',
        debtorName: 'Infratech Ltda',
        caseNumberLink: '0012345-67.2023.8.26.0100',
        originalDebt: 100000,
        agreementValue: 80000,
        status: 'Ativo',
        feePercentage: 20, // 20% de honorários sobre o recebido
        installments: Array.from({ length: 8 }, (_, i) => ({
            id: uuidv4(),
            installmentNumber: i + 1,
            dueDate: new Date(2024, 6 + i, 15).toISOString(),
            value: 10000,
            paidAmount: i < 2 ? 10000 : 0, // Primeiras 2 pagas
            status: i < 2 ? InstallmentStatus.PAGA : InstallmentStatus.PENDENTE,
            paymentHistory: i < 2 ? [{ id: uuidv4(), date: new Date(2024, 6+i, 14).toISOString(), amount: 10000, method: 'PIX'}] : [],
        })),
        updates: [],
    }
];

const initialJobs: Job[] = [];
const initialDraftNotes: DraftNote[] = [];
const initialAiChatHistory: AIChatMessage[] = [];

const initialSettings: AppSettings = {
  customLogo: undefined,
  customFavicon: undefined,
  userName: 'Advogado(a)',
  privacyModeEnabled: false,
  googleCalendarConnected: false,
  splashScreenBackgroundColor: undefined,
};

// Internal helper to calculate agreement status based on its installments
const _getUpdatedAgreementState = (agreement: DebtorAgreement): DebtorAgreement => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasOverdue = false;
    const updatedInstallments = agreement.installments.map(inst => {
        const dueDate = new Date(inst.dueDate);
        // If an installment is not fully paid and its due date has passed, it's late.
        if (inst.status !== InstallmentStatus.PAGA && dueDate < today) {
            hasOverdue = true;
            return { ...inst, status: InstallmentStatus.ATRASADA };
        }
        return inst;
    });
    
    const allPaid = updatedInstallments.every(inst => inst.status === InstallmentStatus.PAGA);

    let newStatus: 'Ativo' | 'Quitado' | 'Inadimplente' = 'Ativo';
    if (allPaid) {
        newStatus = 'Quitado';
    } else if (hasOverdue) { // Check the flag set during the loop
        newStatus = 'Inadimplente';
    }

    return { ...agreement, installments: updatedInstallments, status: newStatus };
};


export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [debtorAgreements, setDebtorAgreements] = useState<DebtorAgreement[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [aiChatHistory, setAiChatHistory] = useState<AIChatMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (settings.customFavicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.customFavicon;
    }
  }, [settings.customFavicon]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedData = {
          cases: localStorage.getItem('juristream_cases'),
          clients: localStorage.getItem('juristream_clients'),
          contracts: localStorage.getItem('juristream_contracts'),
          tasks: localStorage.getItem('juristream_tasks'),
          appointments: localStorage.getItem('juristream_appointments'),
          agreements: localStorage.getItem('juristream_debtorAgreements'),
          settings: localStorage.getItem('juristream_settings'),
          aiChat: localStorage.getItem('juristream_aiChatHistory'),
          auth: localStorage.getItem('juristream_isAuthenticated'),
      };
      setCases(storedData.cases ? JSON.parse(storedData.cases) : initialCases);
      setClients(storedData.clients ? JSON.parse(storedData.clients) : initialClients);
      setContracts(storedData.contracts ? JSON.parse(storedData.contracts) : initialContracts);
      setTasks(storedData.tasks ? JSON.parse(storedData.tasks) : initialTasks);
      setAppointments(storedData.appointments ? JSON.parse(storedData.appointments) : initialAppointments);
      
      let loadedAgreements = storedData.agreements ? JSON.parse(storedData.agreements) : initialDebtorAgreements;
      // Automatically update agreement statuses on every app load
      loadedAgreements = loadedAgreements.map(_getUpdatedAgreementState);
      setDebtorAgreements(loadedAgreements);
      
      setSettings(storedData.settings ? JSON.parse(storedData.settings) : initialSettings);
      setAiChatHistory(storedData.aiChat ? JSON.parse(storedData.aiChat) : initialAiChatHistory);
      setIsAuthenticated(storedData.auth ? JSON.parse(storedData.auth) : false);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Reset to initials on error
      setCases(initialCases);
      setClients(initialClients);
      setContracts(initialContracts);
      setTasks(initialTasks);
      setAppointments(initialAppointments);
      setDebtorAgreements(initialDebtorAgreements);
      setSettings(initialSettings);
      setAiChatHistory(initialAiChatHistory);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => { if (!loading) localStorage.setItem('juristream_cases', JSON.stringify(cases)); }, [cases, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_clients', JSON.stringify(clients)); }, [clients, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_contracts', JSON.stringify(contracts)); }, [contracts, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_tasks', JSON.stringify(tasks)); }, [tasks, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_appointments', JSON.stringify(appointments)); }, [appointments, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_debtorAgreements', JSON.stringify(debtorAgreements)); }, [debtorAgreements, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_settings', JSON.stringify(settings)); }, [settings, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_aiChatHistory', JSON.stringify(aiChatHistory)); }, [aiChatHistory, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_isAuthenticated', JSON.stringify(isAuthenticated)); }, [isAuthenticated, loading]);

  const addCase = useCallback((data: Omit<Case, 'id' | 'createdAt' | 'updates' | 'isDeleted'|'isArchived'>) => setCases(p => [...p, { ...data, id: uuidv4(), createdAt: new Date().toISOString(), updates: [], isDeleted: false, isArchived: false }]), []);
  const updateCase = useCallback((data: Case) => setCases(p => p.map(c => c.id === data.id ? data : c)), []);
  const toggleCaseArchive = useCallback((id: string) => setCases(p => p.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c)), []);
  const softDeleteCase = useCallback((id: string) => setCases(p => p.map(c => c.id === id ? { ...c, isDeleted: true } : c)), []);
  const restoreCase = useCallback((id: string) => setCases(p => p.map(c => c.id === id ? { ...c, isDeleted: false } : c)), []);
  const permanentlyDeleteCase = useCallback((id: string) => setCases(p => p.filter(c => c.id !== id)), []);
  const getCaseById = useCallback((id: string) => cases.find(c => c.id === id), [cases]);

  const addClient = useCallback((data: Omit<Client, 'id' | 'createdAt'|'isDeleted'|'isArchived'>) => setClients(p => [...p, { ...data, id: uuidv4(), createdAt: new Date().toISOString(), isDeleted: false, isArchived: false }]), []);
  const updateClient = useCallback((data: Client) => setClients(p => p.map(c => c.id === data.id ? data : c)), []);
  const toggleClientArchive = useCallback((id: string) => setClients(p => p.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c)), []);
  const softDeleteClient = useCallback((id: string) => setClients(p => p.map(c => c.id === id ? { ...c, isDeleted: true } : c)), []);
  const restoreClient = useCallback((id: string) => setClients(p => p.map(c => c.id === id ? { ...c, isDeleted: false } : c)), []);
  const permanentlyDeleteClient = useCallback((id: string) => setClients(p => p.filter(c => c.id !== id)), []);
  const getClientById = useCallback((id: string) => clients.find(c => c.id === id), [clients]);

  const addContract = useCallback((data: Omit<Contract, 'id'|'createdAt'|'isDeleted'|'isArchived'>) => setContracts(p => [...p, { ...data, id: uuidv4(), createdAt: new Date().toISOString(), isDeleted: false, isArchived: false }]), []);
  const updateContract = useCallback((data: Contract) => setContracts(p => p.map(c => c.id === data.id ? data : c)), []);
  const toggleContractArchive = useCallback((id: string) => setContracts(p => p.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c)), []);
  const softDeleteContract = useCallback((id: string) => setContracts(p => p.map(c => c.id === id ? { ...c, isDeleted: true } : c)), []);
  const restoreContract = useCallback((id: string) => setContracts(p => p.map(c => c.id === id ? { ...c, isDeleted: false } : c)), []);
  const permanentlyDeleteContract = useCallback((id: string) => setContracts(p => p.filter(c => c.id !== id)), []);

  const addTask = useCallback((data: Omit<Task, 'id'|'createdAt'|'updates'|'isDeleted'|'isArchived'|'completedAt'>) => setTasks(p => [...p, { ...data, id: uuidv4(), createdAt: new Date().toISOString(), updates: [], isDeleted: false, isArchived: false }]), []);
  const updateTask = useCallback((data: Task) => setTasks(p => p.map(t => {
      if (t.id === data.id) {
          const wasCompleted = t.status === TaskStatus.CONCLUIDA;
          const isNowCompleted = data.status === TaskStatus.CONCLUIDA;
          if (isNowCompleted && !wasCompleted) {
              return { ...data, completedAt: new Date().toISOString() };
          }
          if (!isNowCompleted && wasCompleted) {
              const { completedAt, ...rest } = data;
              return rest;
          }
          return data;
      }
      return t;
  })), []);
  const toggleTaskArchive = useCallback((id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, isArchived: !t.isArchived } : t)), []);
  const softDeleteTask = useCallback((id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, isDeleted: true } : t)), []);
  const restoreTask = useCallback((id: string) => setTasks(p => p.map(t => t.id === id ? { ...t, isDeleted: false } : t)), []);
  const permanentlyDeleteTask = useCallback((id: string) => setTasks(p => p.filter(t => t.id !== id)), []);
  const addTaskUpdate = useCallback((taskId: string, updateData: Omit<TaskUpdate, 'id' | 'timestamp'>) => setTasks(p => p.map(t => t.id === taskId ? { ...t, updates: [...t.updates, { ...updateData, id: uuidv4(), timestamp: new Date().toISOString() }] } : t)), []);
  const updateTaskUpdate = useCallback((taskId: string, updatedUpdate: TaskUpdate) => setTasks(p => p.map(t => t.id === taskId ? { ...t, updates: t.updates.map(u => u.id === updatedUpdate.id ? { ...updatedUpdate, updatedAt: new Date().toISOString() } : u) } : t)), []);
  
  const addAppointment = useCallback((data: Omit<Appointment, 'id'>) => setAppointments(p => [...p, { ...data, id: uuidv4() }]), []);
  const updateAppointment = useCallback((data: Appointment) => setAppointments(p => p.map(a => a.id === data.id ? data : a)), []);
  const deleteAppointment = useCallback((id: string) => setAppointments(p => p.filter(a => a.id !== id)), []);
  
  // Debtor Agreements CRUD
  const addDebtorAgreement = useCallback((data: Omit<DebtorAgreement, 'id' | 'isDeleted' | 'isArchived' | 'updates'>) => setDebtorAgreements(p => [...p, { ...data, id: uuidv4(), updates: [], isDeleted: false, isArchived: false }]), []);
  const updateDebtorAgreement = useCallback((data: DebtorAgreement) => setDebtorAgreements(p => p.map(a => a.id === data.id ? data : a)), []);
  const toggleDebtorAgreementArchive = useCallback((id: string) => setDebtorAgreements(p => p.map(a => a.id === id ? { ...a, isArchived: !a.isArchived } : a)), []);
  const softDeleteDebtorAgreement = useCallback((id: string) => setDebtorAgreements(p => p.map(a => a.id === id ? { ...a, isDeleted: true } : a)), []);
  const restoreDebtorAgreement = useCallback((id: string) => setDebtorAgreements(p => p.map(a => a.id === id ? { ...a, isDeleted: false } : a)), []);
  const permanentlyDeleteDebtorAgreement = useCallback((id: string) => setDebtorAgreements(p => p.filter(a => a.id !== id)), []);
  const addAgreementUpdate = useCallback((agreementId: string, updateData: Omit<AgreementUpdate, 'id' | 'timestamp'>) => setDebtorAgreements(p => p.map(a => a.id === agreementId ? { ...a, updates: [...(a.updates || []), { ...updateData, id: uuidv4(), timestamp: new Date().toISOString() }] } : a)), []);
  const updateAgreementUpdate = useCallback((agreementId: string, updatedUpdate: AgreementUpdate) => setDebtorAgreements(p => p.map(a => a.id === agreementId ? { ...a, updates: (a.updates || []).map(u => u.id === updatedUpdate.id ? { ...updatedUpdate, updatedAt: new Date().toISOString() } : u) } : a)), []);

  const registerInstallmentPayment = useCallback((agreementId: string, installmentId: string, paymentAmount: number) => {
    setDebtorAgreements(prevAgreements => {
        const newAgreements = prevAgreements.map(agreement => {
            if (agreement.id !== agreementId) return agreement;

            let installmentUpdated = false;
            const newInstallments = agreement.installments.map(inst => {
                if (inst.id !== installmentId) return inst;

                installmentUpdated = true;
                const newPaidAmount = inst.paidAmount + paymentAmount;
                const remaining = inst.value - newPaidAmount;

                let newStatus = inst.status;
                if (remaining <= 0) {
                    newStatus = InstallmentStatus.PAGA;
                } else {
                    newStatus = InstallmentStatus.PAGA_PARCIALMENTE;
                }

                const newPayment: Payment = {
                    id: uuidv4(),
                    date: new Date().toISOString(),
                    amount: paymentAmount,
                    notes: `Pagamento de ${paymentAmount.toFixed(2)} registrado.`
                };
                
                return {
                    ...inst,
                    paidAmount: newPaidAmount,
                    status: newStatus,
                    paymentHistory: [...inst.paymentHistory, newPayment]
                };
            });
            
            if (!installmentUpdated) return agreement;

            // After payment, immediately re-evaluate the agreement's status
            const updatedAgreement = { ...agreement, installments: newInstallments };
            return _getUpdatedAgreementState(updatedAgreement);
        });
        return newAgreements;
    });
  }, []);

  const addAiChatMessage = useCallback((message: AIChatMessage) => setAiChatHistory(prev => [...prev, message]), []);
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => setSettings(prev => ({ ...prev, ...newSettings })), []);

  // Other functions (jobs, drafts, auth)
  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'isDeleted' | 'isPrePaid' | 'paidAt' | 'observationsLog'>) => {/* ... */};
  const updateJob = (jobData: Job) => {/* ... */};
  const deleteJob = (jobId: string) => {/* ... */};
  const permanentlyDeleteJob = (jobId: string) => {/* ... */};
  const addDraftNote = (draftData: Omit<DraftNote, 'id' | 'createdAt' | 'updatedAt'>): DraftNote => {
    const now = new Date().toISOString();
    const newDraft: DraftNote = { ...draftData, id: uuidv4(), createdAt: now, updatedAt: now };
    setDraftNotes(prev => [newDraft, ...prev]);
    return newDraft;
  };
  const updateDraftNote = (updatedDraft: DraftNote) => {/* ... */};
  const deleteDraftNote = (draftId: string) => {/* ... */};
  
  const logout = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setIsAuthenticated(false);
    setIsResting(false);
    toast("Você foi desconectado.");
  }, []);

  const login = useCallback((pin: string): boolean => {
    if (pin === '0000') {
        setIsAuthenticated(true);
        setIsResting(false);
        toast.success("Acesso Liberado!");
        return true;
    }
    return false;
  }, []);

  const enterRestMode = useCallback(() => {
    setIsResting(true);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
        logout();
        toast.error("Sessão encerrada por inatividade.");
    }, 5 * 60 * 1000);
  }, [logout]);

  const exitRestMode = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setIsResting(false);
  }, []);


  const value = { 
    cases, clients, contracts, tasks, appointments, debtorAgreements, jobs, draftNotes, settings, aiChatHistory,
    addCase, updateCase, toggleCaseArchive, softDeleteCase, restoreCase, permanentlyDeleteCase, getCaseById, 
    addClient, updateClient, toggleClientArchive, softDeleteClient, restoreClient, permanentlyDeleteClient, getClientById,
    addContract, updateContract, toggleContractArchive, softDeleteContract, restoreContract, permanentlyDeleteContract,
    addTask, updateTask, toggleTaskArchive, softDeleteTask, restoreTask, permanentlyDeleteTask, addTaskUpdate, updateTaskUpdate,
    addAppointment, updateAppointment, deleteAppointment,
    addDebtorAgreement, updateDebtorAgreement, toggleDebtorAgreementArchive, softDeleteDebtorAgreement, restoreDebtorAgreement, permanentlyDeleteDebtorAgreement,
    addAgreementUpdate, updateAgreementUpdate,
    registerInstallmentPayment,
    addAiChatMessage, updateSettings, addJob, updateJob, deleteJob, permanentlyDeleteJob, addDraftNote, updateDraftNote, deleteDraftNote, 
    isAuthenticated, login, logout, loading, isResting, enterRestMode, exitRestMode 
  };
  
  return React.createElement(AppDataContext.Provider, { value }, children);
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
};