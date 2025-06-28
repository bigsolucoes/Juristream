import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Case, Client, CaseStatus, CaseType, ContractType, AppSettings, CaseUpdate, Task, Appointment, DebtorAgreement, AppointmentType, Job, DraftNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PRIMARY_COLOR = '#FFFFFF';
const DEFAULT_ACCENT_COLOR = '#0d47a1'; // A more professional blue
const DEFAULT_SPLASH_BACKGROUND_COLOR = '#FFFFFF';


interface AppDataContextType {
  cases: Case[];
  clients: Client[];
  tasks: Task[];
  appointments: Appointment[];
  debtorAgreements: DebtorAgreement[];
  jobs: Job[];
  draftNotes: DraftNote[];
  settings: AppSettings;
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updates' | 'isDeleted'>) => void;
  updateCase: (caseData: Case) => void;
  deleteCase: (caseId: string) => void;
  getCaseById: (caseId: string) => Case | undefined;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  getClientById: (clientId: string) => Client | undefined;
  addTask: (task: Omit<Task, 'id'|'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'isDeleted' | 'isPrePaid' | 'paidAt' | 'observationsLog'>) => void;
  updateJob: (jobData: Job) => void;
  deleteJob: (jobId: string) => void; // soft delete
  permanentlyDeleteJob: (jobId: string) => void;
  addDraftNote: (draftData: Omit<DraftNote, 'id' | 'createdAt' | 'updatedAt'>) => DraftNote;
  updateDraftNote: (draftData: DraftNote) => void;
  deleteDraftNote: (draftId: string) => void;
  isRestScreenActive: boolean;
  toggleRestScreen: () => void;
  loading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialClients: Client[] = [
    { id: 'client1', name: 'GlobalCorp S.A.', company: 'Indústria de Tecnologia', email: 'juridico@globalcorp.com', phone: '11987654321', createdAt: new Date().toISOString(), cpf: '12.345.678/0001-99', observations: 'Cliente estratégico. Priorizar demandas.' },
    { id: 'client2', name: 'Mariana Almeida', email: 'mari.almeida@email.com', createdAt: new Date().toISOString(), cpf: '111.222.333-44', observations: 'Contato preferencial por WhatsApp.' },
];

const initialCases: Case[] = [
    { id: uuidv4(), name: 'Ação de Cobrança vs. Inovatech', caseNumber: '0012345-67.2023.8.26.0100', clientId: 'client1', court: '15ª Vara Cível de São Paulo', caseType: CaseType.CIVEL, status: CaseStatus.ATIVO, responsibleLawyers: ['Dr. Carlos'], updates: [], contractType: ContractType.AD_EXITUM, successFeePercentage: 20, createdAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Reclamação Trabalhista - João da Silva', caseNumber: '1000876-21.2023.5.02.0030', clientId: 'client1', court: '30ª Vara do Trabalho de SP', caseType: CaseType.TRABALHISTA, status: CaseStatus.ATIVO, responsibleLawyers: ['Dra. Beatriz'], updates: [], contractType: ContractType.RETAINER, createdAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Divórcio Consensual', caseNumber: 'N/A - Extrajudicial', clientId: 'client2', court: 'Tabelionato de Notas', caseType: CaseType.CIVEL, status: CaseStatus.ENCERRADO_EXITO, responsibleLawyers: ['Dr. Carlos'], updates: [], contractType: ContractType.PRO_LABORE, contractValue: 5000, createdAt: new Date().toISOString() },
];

const initialTasks: Task[] = [
    { id: uuidv4(), title: 'Protocolar Apelação', type: 'Prazo', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), caseId: initialCases[0].id, isCompleted: false, assignedTo: 'Dr. Carlos', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Elaborar Contestação', type: 'Tarefa', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), caseId: initialCases[1].id, isCompleted: false, assignedTo: 'Dra. Beatriz', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Ligar para cliente Mariana', type: 'Tarefa', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: true, assignedTo: 'Estagiário', createdAt: new Date().toISOString() },
];

const initialAppointments: Appointment[] = [
    { id: uuidv4(), title: 'Audiência de Conciliação - Caso Inovatech', appointmentType: AppointmentType.AUDIENCIA, date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), caseId: initialCases[0].id, location: 'Fórum João Mendes Jr.' },
    { id: uuidv4(), title: 'Reunião com GlobalCorp', appointmentType: AppointmentType.REUNIAO, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), clientId: 'client1', location: 'Escritório' },
];

const initialDebtorAgreements: DebtorAgreement[] = [];
const initialJobs: Job[] = [];
const initialDraftNotes: DraftNote[] = [];

const initialSettings: AppSettings = {
  customLogo: undefined,
  userName: 'Advogado(a)',
  primaryColor: DEFAULT_PRIMARY_COLOR,
  accentColor: DEFAULT_ACCENT_COLOR,
  splashScreenBackgroundColor: DEFAULT_SPLASH_BACKGROUND_COLOR,
  privacyModeEnabled: false,
  googleCalendarConnected: false,
};


export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [debtorAgreements, setDebtorAgreements] = useState<DebtorAgreement[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRestScreenActive, setRestScreenActive] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-main-bg', settings.primaryColor || DEFAULT_PRIMARY_COLOR);
    const currentAccentColor = settings.accentColor || DEFAULT_ACCENT_COLOR;
    document.documentElement.style.setProperty('--color-accent', currentAccentColor);
    document.documentElement.style.setProperty('--color-input-focus-border', currentAccentColor);
  }, [settings.primaryColor, settings.accentColor]);

  useEffect(() => {
    try {
      const storedData = {
          cases: localStorage.getItem('juristream_cases'),
          clients: localStorage.getItem('juristream_clients'),
          tasks: localStorage.getItem('juristream_tasks'),
          appointments: localStorage.getItem('juristream_appointments'),
          agreements: localStorage.getItem('juristream_debtorAgreements'),
          settings: localStorage.getItem('juristream_settings'),
          jobs: localStorage.getItem('juristream_jobs'),
          draftNotes: localStorage.getItem('juristream_draftNotes'),
      };
      setCases(storedData.cases ? JSON.parse(storedData.cases) : initialCases);
      setClients(storedData.clients ? JSON.parse(storedData.clients) : initialClients);
      setTasks(storedData.tasks ? JSON.parse(storedData.tasks) : initialTasks);
      setAppointments(storedData.appointments ? JSON.parse(storedData.appointments) : initialAppointments);
      setDebtorAgreements(storedData.agreements ? JSON.parse(storedData.agreements) : initialDebtorAgreements);
      setSettings(storedData.settings ? JSON.parse(storedData.settings) : initialSettings);
      setJobs(storedData.jobs ? JSON.parse(storedData.jobs) : initialJobs);
      setDraftNotes(storedData.draftNotes ? JSON.parse(storedData.draftNotes) : initialDraftNotes);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setCases(initialCases);
      setClients(initialClients);
      setTasks(initialTasks);
      setAppointments(initialAppointments);
      setDebtorAgreements(initialDebtorAgreements);
      setSettings(initialSettings);
      setJobs(initialJobs);
      setDraftNotes(initialDraftNotes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (!loading) localStorage.setItem('juristream_cases', JSON.stringify(cases)); }, [cases, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_clients', JSON.stringify(clients)); }, [clients, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_tasks', JSON.stringify(tasks)); }, [tasks, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_appointments', JSON.stringify(appointments)); }, [appointments, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_debtorAgreements', JSON.stringify(debtorAgreements)); }, [debtorAgreements, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_settings', JSON.stringify(settings)); }, [settings, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_jobs', JSON.stringify(jobs)); }, [jobs, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('juristream_draftNotes', JSON.stringify(draftNotes)); }, [draftNotes, loading]);

  const addCase = useCallback((caseData: Omit<Case, 'id' | 'createdAt' | 'updates' | 'isDeleted'>) => {
    const newCase: Case = { ...caseData, id: uuidv4(), createdAt: new Date().toISOString(), updates: [], isDeleted: false };
    setCases(prev => [...prev, newCase]);
  }, []);
  const updateCase = useCallback((updatedCase: Case) => setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c)), []);
  const deleteCase = useCallback((caseId: string) => setCases(prev => prev.map(c => c.id === caseId ? { ...c, isDeleted: true } : c)), []);
  const getCaseById = useCallback((caseId: string) => cases.find(c => c.id === caseId), [cases]);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt'>) => setClients(prev => [...prev, { ...clientData, id: uuidv4(), createdAt: new Date().toISOString() }]), []);
  const updateClient = useCallback((updatedClient: Client) => setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c)), []);
  const deleteClient = useCallback((clientId: string) => setClients(prev => prev.filter(c => c.id !== clientId)), []);
  const getClientById = useCallback((clientId: string) => clients.find(client => client.id === clientId), [clients]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => setTasks(prev => [...prev, {...taskData, id: uuidv4(), createdAt: new Date().toISOString()}]), []);
  const updateTask = useCallback((updatedTask: Task) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t)), []);
  const deleteTask = useCallback((taskId: string) => setTasks(prev => prev.filter(t => t.id !== taskId)), []);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => setAppointments(prev => [...prev, {...appointmentData, id: uuidv4()}]), []);
  const updateAppointment = useCallback((updatedAppointment: Appointment) => setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)), []);
  const deleteAppointment = useCallback((appointmentId: string) => setAppointments(prev => prev.filter(a => a.id !== appointmentId)), []);
  
  const addJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'isDeleted' | 'isPrePaid' | 'paidAt' | 'observationsLog'>) => {
    const newJob: Job = { ...jobData, id: uuidv4(), createdAt: new Date().toISOString(), isDeleted: false, isPrePaid: false, observationsLog: [] };
    setJobs(prev => [...prev, newJob]);
  }, []);
  const updateJob = useCallback((updatedJob: Job) => setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j)), []);
  const deleteJob = useCallback((jobId: string) => setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isDeleted: true } : j)), []);
  const permanentlyDeleteJob = useCallback((jobId: string) => setJobs(prev => prev.filter(j => j.id !== jobId)), []);
  
  const addDraftNote = useCallback((draftData: Omit<DraftNote, 'id' | 'createdAt' | 'updatedAt'>): DraftNote => {
    const now = new Date().toISOString();
    const newDraft: DraftNote = { ...draftData, id: uuidv4(), createdAt: now, updatedAt: now };
    setDraftNotes(prev => [newDraft, ...prev].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    return newDraft;
  }, []);
  const updateDraftNote = useCallback((updatedDraft: DraftNote) => {
    const now = new Date().toISOString();
    setDraftNotes(prev => prev.map(d => d.id === updatedDraft.id ? { ...updatedDraft, updatedAt: now } : d).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);
  const deleteDraftNote = useCallback((draftId: string) => setDraftNotes(prev => prev.filter(d => d.id !== draftId)), []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => setSettings(prev => ({ ...prev, ...newSettings })), []);
  const toggleRestScreen = useCallback(() => setRestScreenActive(prev => !prev), []);

  return React.createElement(AppDataContext.Provider, { 
      value: { cases, clients, tasks, appointments, debtorAgreements, jobs, draftNotes, settings, addCase, updateCase, deleteCase, getCaseById, addClient, updateClient, deleteClient, getClientById, addTask, updateTask, deleteTask, addAppointment, updateAppointment, deleteAppointment, addJob, updateJob, deleteJob, permanentlyDeleteJob, addDraftNote, updateDraftNote, deleteDraftNote, updateSettings, isRestScreenActive, toggleRestScreen, loading } 
    }, children);
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
};