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
}

export interface CaseUpdate {
  id: string;
  text: string;
  timestamp: string;
}

export interface Case {
  id: string;
  name: string; // "Ação de Indenização por Danos Morais"
  caseNumber: string;
  clientId: string;
  court?: string; // "3ª Vara Cível de São Paulo"
  caseType: CaseType;
  status: CaseStatus;
  responsibleLawyers: string[]; // For now, just names. Could be User IDs.
  updates: CaseUpdate[];
  contractType?: ContractType;
  contractValue?: number; // Could be fixed value, hourly rate, etc.
  successFeePercentage?: number;
  createdAt: string;
  isDeleted?: boolean;
}

export interface Task {
    id: string;
    title: string;
    type: 'Prazo' | 'Tarefa';
    dueDate: string; // ISO String
    caseId?: string; // Link to a case
    isCompleted: boolean;
    assignedTo: string; // For now, just a name
    description?: string;
    createdAt: string;
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
}

export interface DebtorAgreement {
    id: string;
    debtorName: string;
    caseNumberLink?: string; // N do processo
    originalDebt: number;
    agreementValue: number;
    installments: number; // numero de parcelas
    installmentsPaid: number;
    nextDueDate?: string;
    status: 'Ativo' | 'Quitado' | 'Inadimplente';
    notes?: string;
}

export interface AppSettings {
  customLogo?: string; // base64 string
  userName?: string; 
  primaryColor?: string;
  accentColor?: string;
  splashScreenBackgroundColor?: string;
  privacyModeEnabled?: boolean; 
  googleCalendarConnected?: boolean;
}

export interface User {
  id:string;
  username: string; 
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