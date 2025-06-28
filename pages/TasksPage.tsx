import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Task } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, CheckCircle, Circle, BriefcaseIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';
import Modal from '../components/Modal';
import TaskForm from './forms/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';

const TasksPage: React.FC = () => {
  const { tasks, cases, updateTask, deleteTask, loading: appLoading } = useAppData();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    if (filter === 'pending') return sorted.filter(t => !t.isCompleted);
    if (filter === 'completed') return sorted.filter(t => t.isCompleted);
    return sorted;
  }, [tasks, filter]);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };
  
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask({ ...task, isCompleted: !task.isCompleted });
    toast.success(`Tarefa "${task.title}" marcada como ${!task.isCompleted ? 'concluída' : 'pendente'}.`);
    if(selectedTask?.id === task.id) {
        setSelectedTask({...task, isCompleted: !task.isCompleted});
    }
  };

  const handleDelete = (taskId: string) => {
    if(window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
        deleteTask(taskId);
        if(selectedTask?.id === taskId) {
            setSelectedTask(null);
        }
        toast.success("Tarefa excluída.");
    }
  };

  if (appLoading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }

  return (
    <div className="flex h-full gap-6">
      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-card-bg shadow-lg rounded-xl p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Tarefas e Prazos</h2>
          <button onClick={handleAddTask} className="p-2 text-accent" title="Nova Tarefa/Prazo">
            <PlusCircleIcon size={24} />
          </button>
        </div>
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-lg mb-4">
            {(['pending', 'completed', 'all'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`w-full px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-accent text-white shadow' : 'hover:bg-slate-200'}`}>
                    {f === 'pending' ? 'Pendentes' : f === 'completed' ? 'Concluídas' : 'Todas'}
                </button>
            ))}
        </div>
        <div className="overflow-y-auto flex-grow space-y-2 pr-1">
          {filteredTasks.map(task => {
              const deadline = new Date(task.dueDate);
              const today = new Date();
              today.setHours(0,0,0,0);
              const isOverdue = deadline < today && !task.isCompleted;

              return (
                <div key={task.id} onClick={() => handleSelectTask(task)}
                    className={`p-3 rounded-lg cursor-pointer border-l-4 ${selectedTask?.id === task.id ? 'bg-accent text-white shadow-md' : 'bg-slate-50 hover:bg-slate-200'} ${isOverdue ? 'border-red-500' : (task.type === 'Prazo' ? 'border-yellow-500' : 'border-blue-500')}`}>
                    <h3 className="font-medium truncate">{task.title}</h3>
                    <p className={`text-xs truncate ${selectedTask?.id === task.id ? 'text-blue-100' : 'text-text-secondary'}`}>
                        Vencimento: {formatDate(task.dueDate)} {isOverdue ? '(Atrasado)' : ''}
                    </p>
                </div>
              )
          })}
        </div>
      </div>

      <div className="flex-grow bg-card-bg shadow-lg rounded-xl p-6 flex flex-col">
        {selectedTask ? (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-border-color">
                    <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedTask.type === 'Prazo' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{selectedTask.type}</span>
                        <h1 className="text-2xl font-semibold text-text-primary mt-2">{selectedTask.title}</h1>
                    </div>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => handleEditTask(selectedTask)} className="p-2 text-slate-600 hover:text-accent rounded-full"><PencilIcon/></button>
                        <button onClick={() => handleDelete(selectedTask.id)} className="p-2 text-red-500 hover:text-red-700 rounded-full"><TrashIcon/></button>
                    </div>
                </div>
                <div className="flex-grow space-y-4 text-sm">
                    <p><strong>Status: </strong>
                        <button onClick={() => handleToggleComplete(selectedTask)} className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${selectedTask.isCompleted ? 'text-green-700 bg-green-100' : 'text-text-secondary'}`}>
                            {selectedTask.isCompleted ? <CheckCircle size={16}/> : <Circle size={16}/>}
                            <span>{selectedTask.isCompleted ? 'Concluída' : 'Pendente'}</span>
                        </button>
                    </p>
                    <p><strong>Vencimento:</strong> {formatDate(selectedTask.dueDate)}</p>
                    <p><strong>Responsável:</strong> {selectedTask.assignedTo}</p>
                    {selectedTask.caseId && (
                        <p className="flex items-center">
                            <BriefcaseIcon size={16} className="mr-2 text-text-secondary"/>
                            <strong>Processo:</strong>
                            <span className="ml-1">{cases.find(c => c.id === selectedTask.caseId)?.name || 'Não encontrado'}</span>
                        </p>
                    )}
                    {selectedTask.description && (
                        <div>
                            <p><strong>Descrição:</strong></p>
                            <p className="whitespace-pre-wrap p-2 bg-slate-50 rounded-md">{selectedTask.description}</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <CheckCircle size={64} className="text-slate-300 mb-4" />
                <p className="text-xl text-text-secondary">Selecione uma tarefa para ver os detalhes.</p>
                <p className="mt-2 text-text-secondary">Ou crie uma nova tarefa ou prazo.</p>
             </div>
        )}
      </div>

       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingTask ? "Editar Tarefa/Prazo" : "Nova Tarefa/Prazo"}>
          <TaskForm 
            onSuccess={() => {setIsFormModalOpen(false); setEditingTask(undefined);}}
            taskToEdit={editingTask}
          />
      </Modal>
    </div>
  );
};

export default TasksPage;
