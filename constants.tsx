import React from 'react';
import { CaseStatus, CaseType, ContractType, JobStatus, ServiceType } from './types';
import { 
  Home, Briefcase, Users, CreditCard, BarChartBig, MessageCircle, Link2, FolderArchive, 
  Sparkles, Cog, PlusCircle, X, Trash2, Edit3, CheckCircle, AlertCircle, Clock, 
  DollarSign, Eye, EyeOff, List, ArrowRight, Settings, CalendarDays, Archive as ArchiveIconLucide, FileText, Bot,
  Save, Check, ChevronLeft, ChevronRight, Wallet, ExternalLink, ImageUp, ImageOff, UserCheck, Gavel, Scale, BookUser,
  Plus, Link as LinkLucide, XCircle
} from 'lucide-react';

export const APP_NAME = "Juristream";
export const ACCENT_COLOR = "custom-brown"; // This will be dynamically overridden by settings

// Lucide Icons Exports
export const HomeIcon = Home;
export const BriefcaseIcon = Briefcase; // Represents "Processos" (Cases)
export const UsersIcon = Users; // Represents "Clientes"
export const CreditCardIcon = CreditCard; // Represents "Financeiro"
export const ChartBarIcon = BarChartBig; // Represents "Relatórios"
export const CalendarIcon = CalendarDays; // Represents "Agenda"
export const TaskIcon = CheckCircle; // Represents "Tarefas"
export const SettingsIcon = Settings;
export const EyeOpenIcon = Eye;
export const EyeClosedIcon = EyeOff;
export const PlusCircleIcon = PlusCircle;
export const PencilIcon = Edit3;
export const TrashIcon = Trash2;
export const XIcon = X;
export const SaveIcon = Save;
export const LinkIcon = Link2;
export const GavelIcon = Gavel; // For legal context
export const ScaleIcon = Scale; // For legal context
export const ClientIcon = BookUser; // Better icon for clients

// Icons that were missing
export const ExternalLinkIcon = ExternalLink;
export const SparklesIcon = Sparkles;
export const ListBulletIcon = List;
export const ArchiveIcon = ArchiveIconLucide;
export const CurrencyDollarIcon = DollarSign;
export const PageTrashIcon = Trash2; // Re-using Trash2 for PageTrashIcon
export const PlusIcon = Plus;
export const CloudLinkIcon = LinkLucide;
export const RemoveLinkIcon = XCircle;
export const CheckIcon = Check;
export const BotIcon = Bot;
export const DraftIcon = FileText; // Using FileText for Drafts
export const ImageUpIcon = ImageUp;
export const ImageOffIcon = ImageOff;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;


export const NAVIGATION_ITEMS = [
  { name: 'Painel de Controle', path: '/dashboard', icon: HomeIcon },
  { name: 'Processos', path: '/processos', icon: BriefcaseIcon },
  { name: 'Clientes', path: '/clientes', icon: ClientIcon },
  { name: 'Financeiro', path: '/financeiro', icon: Wallet },
  { name: 'Agenda', path: '/agenda', icon: CalendarIcon },
  { name: 'Tarefas e Prazos', path: '/tarefas', icon: TaskIcon },
  { name: 'Relatórios', path: '/relatorios', icon: ChartBarIcon },
];

// Constants for Jobs (from the other app)
export const KANBAN_COLUMNS = [
  { id: 'col-1', title: 'Briefing / Proposta', status: JobStatus.BRIEFING },
  { id: 'col-2', title: 'Em Produção', status: JobStatus.PRODUCTION },
  { id: 'col-3', title: 'Revisão', status: JobStatus.REVIEW },
  { id: 'col-4', title: 'Finalizado / Entregue', status: JobStatus.FINALIZED },
  { id: 'col-5', title: 'Pago / Arquivado', status: JobStatus.PAID },
];

export const JOB_STATUS_OPTIONS = [
  { value: JobStatus.BRIEFING, label: 'Briefing' },
  { value: JobStatus.PRODUCTION, label: 'Em Produção' },
  { value: JobStatus.REVIEW, label: 'Revisão' },
  { value: JobStatus.FINALIZED, label: 'Finalizado' },
  { value: JobStatus.PAID, label: 'Pago' },
];

export const SERVICE_TYPE_OPTIONS = [
  { value: ServiceType.VIDEO, label: 'Vídeo' },
  { value: ServiceType.PHOTOGRAPHY, label: 'Fotografia' },
  { value: ServiceType.DESIGN, label: 'Design Gráfico' },
  { value: ServiceType.COPYWRITING, label: 'Copywriting' },
  { value: ServiceType.SOCIAL_MEDIA, label: 'Social Media' },
  { value: ServiceType.WEBSITE, label: 'Website' },
  { value: ServiceType.OTHER, label: 'Outro' },
];

export const CASE_STATUS_OPTIONS = [
  { value: CaseStatus.ATIVO, label: 'Ativo' },
  { value: CaseStatus.SUSPENSO, label: 'Suspenso' },
  { value: CaseStatus.ENCERRADO_EXITO, label: 'Encerrado com Êxito' },
  { value: CaseStatus.ENCERRADO_SEM_EXITO, label: 'Encerrado sem Êxito' },
  { value: CaseStatus.ARQUIVADO, label: 'Arquivado' },
];

export const CASE_TYPE_OPTIONS = [
  { value: CaseType.CIVEL, label: 'Cível' },
  { value: CaseType.TRABALHISTA, label: 'Trabalhista' },
  { value: CaseType.CRIMINAL, label: 'Criminal' },
  { value: CaseType.TRIBUTARIO, label: 'Tributário' },
  { value: CaseType.CONTRATUAL, label: 'Contratual' },
  { value: CaseType.OUTRO, label: 'Outro' },
];

export const CONTRACT_TYPE_OPTIONS = [
  { value: ContractType.PRO_LABORE, label: 'Pro Labore (Fixo)' },
  { value: ContractType.AD_EXITUM, label: 'Ad Exitum (% do Êxito)' },
  { value: ContractType.HOURLY, label: 'Por Hora' },
  { value: ContractType.RETAINER, label: 'Contrato de Partido (Mensal)' },
  { value: ContractType.MIXED, label: 'Misto' },
];