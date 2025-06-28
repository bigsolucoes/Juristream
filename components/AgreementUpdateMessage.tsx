
import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { AgreementUpdate } from '../types';
import { formatDate } from '../utils/formatters';
import { PencilIcon, SaveIcon, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface AgreementUpdateMessageProps {
  agreementId: string;
  update: AgreementUpdate;
}

const AgreementUpdateMessage: React.FC<AgreementUpdateMessageProps> = ({ agreementId, update }) => {
  const { updateAgreementUpdate } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(update.text);

  const handleSave = () => {
    if (editText.trim() === '') {
      toast.error("A atualização não pode ficar em branco.");
      return;
    }
    updateAgreementUpdate(agreementId, { ...update, text: editText });
    setIsEditing(false);
    toast.success("Atualização salva!");
  };

  const handleCancel = () => {
    setEditText(update.text);
    setIsEditing(false);
  };
  
  return (
    <div className="p-3 rounded-lg bg-white shadow-sm w-full">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
            rows={3}
          />
        ) : (
          <p className="text-sm text-slate-800 whitespace-pre-wrap flex-grow">{update.text}</p>
        )}
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-100 rounded-full" title="Salvar"><SaveIcon size={16} /></button>
              <button onClick={handleCancel} className="p-1 text-red-600 hover:bg-red-100 rounded-full" title="Cancelar"><XIcon size={16} /></button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-full" title="Editar"><PencilIcon size={16} /></button>
          )}
        </div>
      </div>
      <div className="text-right text-xs text-slate-400 mt-1">
        {formatDate(update.timestamp, { dateStyle: 'short', timeStyle: 'short' })}
        {update.updatedAt && <span> (editado)</span>}
      </div>
    </div>
  );
};

export default AgreementUpdateMessage;
