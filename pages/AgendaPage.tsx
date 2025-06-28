import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import toast from 'react-hot-toast';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from '../constants';
import { Appointment, AppointmentType } from '../types';
import { formatDate } from '../utils/formatters';
import Modal from '../components/Modal';
import AppointmentForm from './forms/AppointmentForm';

const AgendaPage: React.FC = () => {
  const { appointments, loading } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  const daysInMonth = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(null); // Blanks for previous month
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate]);

  const appointmentsByDate = useMemo(() => {
    return appointments.reduce((acc, app) => {
        const appDate = new Date(app.date).toDateString();
        if(!acc[appDate]) acc[appDate] = [];
        acc[appDate].push(app);
        return acc;
    }, {} as {[key: string]: Appointment[]});
  }, [appointments]);
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };
  
  const handleAddAppointment = (date: Date) => {
      setSelectedDate(date);
      setSelectedAppointment(undefined);
      setFormModalOpen(true);
  };
  
  const handleEditAppointment = (appointment: Appointment) => {
      setSelectedDate(new Date(appointment.date));
      setSelectedAppointment(appointment);
      setFormModalOpen(true);
  }

  const getAppointmentColor = (type: AppointmentType) => {
      switch(type) {
          case AppointmentType.AUDIENCIA: return 'bg-red-200 border-red-500';
          case AppointmentType.REUNIAO: return 'bg-blue-200 border-blue-500';
          case AppointmentType.SUSTENTACAO_ORAL: return 'bg-purple-200 border-purple-500';
          case AppointmentType.PRAZO_INTERNO: return 'bg-yellow-200 border-yellow-500';
          default: return 'bg-slate-200 border-slate-500';
      }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
            <CalendarIcon size={32} className="text-accent mr-3" />
            <h1 className="text-3xl font-bold text-text-primary">Agenda de Compromissos</h1>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 p-3 bg-slate-50 rounded-lg shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigateDate('prev')} className="p-2 text-slate-600 hover:text-accent rounded-full hover:bg-slate-200 transition-colors" title="Mês Anterior">
            <ChevronLeftIcon size={24} />
          </button>
          <h2 className="text-xl font-semibold text-text-primary mx-4 w-64 text-center capitalize">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => navigateDate('next')} className="p-2 text-slate-600 hover:text-accent rounded-full hover:bg-slate-200 transition-colors" title="Próximo Mês">
            <ChevronRightIcon size={24} />
          </button>
        </div>
        <button onClick={() => handleAddAppointment(new Date())} className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm shadow flex items-center">
            <PlusCircleIcon size={18} className="mr-1.5" /> Novo Compromisso
        </button>
      </div>

      <div className="flex-grow bg-card-bg rounded-lg shadow overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 text-center font-semibold text-text-secondary border-b border-border-color">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="py-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 flex-grow gap-px bg-border-color">
            {daysInMonth.map((day, index) => (
                <div key={index} className="bg-card-bg p-1.5 flex flex-col relative min-h-[120px]">
                    {day && (
                        <>
                            <span className="font-semibold text-sm">{day.getDate()}</span>
                            <div className="mt-1 space-y-1 overflow-y-auto">
                                {appointmentsByDate[day.toDateString()]?.map(app => (
                                    <div key={app.id} onClick={() => handleEditAppointment(app)} className={`p-1 text-xs rounded-sm cursor-pointer border-l-4 ${getAppointmentColor(app.appointmentType)}`}>
                                        <p className="font-semibold truncate">{app.title}</p>
                                        <p className="truncate">{app.appointmentType}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleAddAppointment(day)} className="absolute bottom-1 right-1 text-slate-400 hover:text-accent opacity-0 hover:opacity-100 transition-opacity">
                                <PlusCircleIcon size={20}/>
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
      </div>
      
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title={selectedAppointment ? "Editar Compromisso" : "Novo Compromisso"}>
          <AppointmentForm 
            onSuccess={() => setFormModalOpen(false)}
            appointmentToEdit={selectedAppointment}
            selectedDate={selectedDate}
          />
      </Modal>
    </div>
  );
};

export default AgendaPage;