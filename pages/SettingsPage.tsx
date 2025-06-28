

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAppData } from '../hooks/useAppData';
import toast from 'react-hot-toast';
import { APP_NAME, SettingsIcon as PageIcon } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner'; 

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, loading } = useAppData();
  
  const [customLogoPreview, setCustomLogoPreview] = useState<string | undefined>(settings.customLogo);
  const [customFaviconPreview, setCustomFaviconPreview] = useState<string | undefined>(settings.customFavicon);
  const [userNameInput, setUserNameInput] = useState(settings.userName || '');
  
  useEffect(() => {
    if (!loading) {
      setCustomLogoPreview(settings.customLogo);
      setCustomFaviconPreview(settings.customFavicon);
      setUserNameInput(settings.userName || '');
    }
  }, [settings, loading]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>, setPreview: React.Dispatch<React.SetStateAction<string | undefined>>, type: 'logo' | 'favicon') => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 50 * 1024; // 2MB for logo, 50KB for favicon
      const acceptedTypes = type === 'logo' ? ['image/png', 'image/jpeg', 'image/svg+xml'] : ['image/png', 'image/x-icon', 'image/svg+xml'];
      
      if (file.size > maxSize) { 
        toast.error(`O arquivo de ${type} é muito grande. Máximo ${maxSize / 1024}KB.`);
        return;
      }
       if (!acceptedTypes.includes(file.type)) {
        toast.error(`Formato de arquivo inválido para ${type}.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    updateSettings({
      customLogo: customLogoPreview,
      customFavicon: customFaviconPreview,
      userName: userNameInput || undefined,
    });
    toast.success('Configurações salvas com sucesso!');
  };

  const commonInputClass = "w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-800 outline-none transition-shadow bg-white";
  const sectionCardClass = "bg-white p-6 rounded-xl shadow-lg";

  if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <PageIcon size={32} className="text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
      </div>
      
      <div className={sectionCardClass}>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Dados do Usuário</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="userName" className="block text-sm font-medium text-slate-500 mb-1">Seu Nome (para saudação no painel)</label>
                <input 
                  type="text" 
                  id="userName" 
                  value={userNameInput} 
                  onChange={(e) => setUserNameInput(e.target.value)} 
                  className={commonInputClass}
                  placeholder="Ex: Dr. João Silva"
                />
            </div>
        </div>
      </div>
      
      <div className={sectionCardClass}>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Personalização da Marca</h2>
        
        {/* Logo Section */}
        <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2">Logotipo da Aplicação</h3>
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <p className="text-sm text-slate-500 mb-1">Prévia:</p>
                    {customLogoPreview ? (
                        <img src={customLogoPreview} alt="Custom Logo Preview" className="h-12 w-auto border border-slate-200 rounded p-1 bg-slate-100"/>
                    ) : (
                        <span className={`text-2xl font-bold text-blue-600 border border-slate-200 rounded p-2 bg-slate-100`}>{APP_NAME}</span>
                    )}
                </div>
                <div className="flex-grow">
                    <label htmlFor="logoUpload" className="block text-sm font-medium text-slate-500 mb-1">
                        Substituir Logo (PNG, JPG, SVG - Máx 2MB)
                    </label>
                    <input 
                        type="file" 
                        id="logoUpload" 
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={(e) => handleFileUpload(e, setCustomLogoPreview, 'logo')}
                        className={`${commonInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700`}
                    />
                </div>
                {customLogoPreview && (
                    <button onClick={() => setCustomLogoPreview(undefined)} className="bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-600 transition-colors text-sm self-end">
                        Remover Logo
                    </button>
                )}
            </div>
        </div>

        {/* Favicon Section */}
        <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2">Favicon do Navegador</h3>
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <p className="text-sm text-slate-500 mb-1">Prévia:</p>
                    {customFaviconPreview ? (
                        <img src={customFaviconPreview} alt="Custom Favicon Preview" className="h-8 w-8 border border-slate-200 rounded p-1 bg-slate-100"/>
                    ) : (
                        <div className="h-8 w-8 border border-slate-200 rounded p-1 bg-slate-100 flex items-center justify-center text-blue-600 font-bold">J</div>
                    )}
                </div>
                <div className="flex-grow">
                    <label htmlFor="faviconUpload" className="block text-sm font-medium text-slate-500 mb-1">
                        Substituir Favicon (ICO, PNG, SVG - Máx 50KB)
                    </label>
                    <input 
                        type="file" 
                        id="faviconUpload" 
                        accept="image/png, image/x-icon, image/svg+xml"
                        onChange={(e) => handleFileUpload(e, setCustomFaviconPreview, 'favicon')}
                        className={`${commonInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700`}
                    />
                </div>
                {customFaviconPreview && (
                    <button onClick={() => setCustomFaviconPreview(undefined)} className="bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-600 transition-colors text-sm self-end">
                        Remover Favicon
                    </button>
                )}
            </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all text-lg font-semibold"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;