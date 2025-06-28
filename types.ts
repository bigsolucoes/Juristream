



export interface User {
  id: string;
  username: string;
}

export enum CaseStatus {
  ATIVO = 'Ativo',
  SUSPENSO = 'Suspenso',
  ENCERRADO_EXITO = 'Encerrado com Êxito',
  ENCERRADO_SEM_EXITO = 'Encerrado sem Êxito',
  ARQUIVADO = 'Arquivado',
}

export enum CaseType {
  CIVEL = 'Cível',
  TRABALHISTA = 'Trabalhista',
  CRIMINAL = 'Criminal',
  TRIBUTARIO = 'Tributário',
  CONTRATUAL = 'Contratual',
  OUTRO = 'Outro',
}

export enum AppointmentType {
    AUDIENCIA = 'Audiência',
    REUNIAO = 'Reunião com Cliente',
    SUSTENTACAO_ORAL = 'Sustentação Oral',
    PRAZO_INTERNO = 'Prazo Interno',
    OUTRO = 'Outro',
}

export enum ContractType {
  PRO_LABORE = 'Pro Labore (Fixo)',
  AD_EXITUM = 'Ad Exitum (% do Êxito)',
  HOURLY = 'Por Hora',
  RETAINER = 'Contrato de Partido (Mensal)',
  MIXED = 'Misto',
}

export enum JobStatus {
    BRIEFING = 'Briefing',
    PRODUCTION = 'Em Produção',
    REVIEW = 'Revisão',
    FINALIZED = 'Finalizado',
    PAID = 'Pago',
}

export enum ServiceType {
    VIDEO = 'Vídeo',
    PHOTOGRAPHY = 'Fotografia',
    DESIGN = 'Design Gráfico',
    COPYWRITING = 'Copywriting',
    SOCIAL_MEDIA = 'Social Media',
    WEBSITE = 'Website',
    OTHER = 'Outro',
}


export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  cpf?: string;
  observations?: string;
  createdAt: string;
  isDeleted?: boolean;
  isArchived?: boolean;
}

export interface CaseUpdate {
  id: string;
  text: string;
  timestamp: string;
}

export interface Case {
  id:string;
  name: string; // "Ação de Indenização por Danos Morais"
  caseNumber: string;
  clientId: string;
  court?: string; // "3ª Vara Cível de São Paulo"
  caseType: CaseType;
  status: CaseStatus;
  responsibleLawyers: string[]; // For now, just names. Could be User IDs.
  updates: CaseUpdate[];
  createdAt: string;
  contractType?: ContractType;
  contractValue?: number;
  successFeePercentage?: number;
  isDeleted?: boolean;
  isArchived?: boolean;
}

export enum TaskStatus {
    PENDENTE = 'Pendente',
    FAZENDO = 'Fazendo',
    CONCLUIDA = 'Concluída',
}

export interface TaskUpdate {
  id: string;
  text: string;
  timestamp: string;
  updatedAt?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentData?: string; // base64
}

export interface Task {
    id: string;
    title: string;
    type: 'Prazo' | 'Tarefa';
    dueDate: string; // ISO String
    caseId: string; // Link to a case, now mandatory
    status: TaskStatus;
    assignedTo: string; // For now, just a name
    description?: string;
    createdAt: string;
    completedAt?: string;
    updates: TaskUpdate[];
    isDeleted?: boolean;
    isArchived?: boolean;
}

export interface Appointment {
    id: string;
    title: string;
    appointmentType: AppointmentType;
    date: string; // ISO String
    caseId?: string;
    clientId?: string;
    notes?: string;
    location?: string;
    createCalendarEvent?: boolean;
}

export enum InstallmentStatus {
  PENDENTE = 'Pendente',
  PAGA_PARCIALMENTE = 'Paga Parcialmente',
  PAGA = 'Paga',
  ATRASADA = 'Atrasada',
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method?: string;
  notes?: string;
}

export interface Installment {
  id: string;
  installmentNumber: number;
  dueDate: string;
  value: number;
  paidAmount: number;
  status: InstallmentStatus;
  paymentHistory: Payment[];
}

export interface AgreementUpdate {
  id: string;
  text: string;
  timestamp: string;
  updatedAt?: string;
}

export interface DebtorAgreement {
    id: string;
    debtorName: string;
    caseNumberLink?: string; // N do processo
    originalDebt: number;
    agreementValue: number;
    installments: Installment[];
    status: 'Ativo' | 'Quitado' | 'Inadimplente';
    notes?: string;
    feePercentage: number; // Honorários do advogado sobre o valor pago
    isDeleted?: boolean;
    isArchived?: boolean;
    updates?: AgreementUpdate[];
}

export interface AppSettings {
  customLogo?: string; // base64 string
  customFavicon?: string; // base64 string
  userName?: string; 
  privacyModeEnabled?: boolean; 
  googleCalendarConnected?: boolean;
  splashScreenBackgroundColor?: string;
}

export enum ContractStatus {
  DRAFT = 'Rascunho',
  ACTIVE = 'Ativo',
  FINISHED = 'Finalizado',
  CANCELED = 'Cancelado',
}

export interface Contract {
  id: string;
  name: string;
  caseId: string;
  clientId: string;
  contractType: ContractType;
  status: ContractStatus;
  value?: number;
  successFeePercentage?: number;
  startDate: string;
  endDate?: string;
  description?: string;
  isDeleted?: boolean;
  isArchived?: boolean;
  createdAt: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentData?: string; // base64
}

export interface JobObservation {
  id: string;
  text: string;
  timestamp: string;
}

export interface Job {
  id: string;
  name: string;
  clientId: string;
  serviceType: ServiceType;
  value: number;
  deadline: string; // ISO String
  status: JobStatus;
  isDeleted?: boolean;
  isPrePaid?: boolean;
  prePaymentDate?: string;
  paidAt?: string; // When moved to PAID column
  paymentDate?: string; // Official payment date from form
  paymentMethod?: string;
  paymentAttachmentName?: string;
  paymentAttachmentData?: string; 
  notes?: string;
  cloudLinks?: string[];
  observationsLog?: JobObservation[];
  createCalendarEvent?: boolean;
  createdAt: string;
  paymentNotes?: string;
}

export interface DraftNote {
  id: string;
  title: string;
  content: string;
  imageBase64?: string;
  imageMimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}