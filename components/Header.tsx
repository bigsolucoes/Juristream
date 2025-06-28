import React from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { APP_NAME, SettingsIcon, EyeOpenIcon, EyeClosedIcon } from '../constants';

const Header: React.FC = () => {
  const { settings, updateSettings, toggleRestScreen } = useAppData();

  const handleLogoClick = () => {
    toggleRestScreen();
  };

  const togglePrivacyMode = () => {
    updateSettings({ privacyModeEnabled: !settings.privacyModeEnabled });
  };

  return (
    <header className="bg-card-bg text-text-primary p-4 shadow-md flex justify-between items-center h-16 sticky top-0 z-30">
      <div 
        onClick={handleLogoClick}
        className="cursor-pointer flex items-center"
        title="Ativar tela de descanso"
      >
        {settings.customLogo ? (
          <img src={settings.customLogo} alt={`${APP_NAME} Logo`} className="h-8 max-h-full max-w-xs object-contain" />
        ) : (
          <span className="text-2xl font-bold text-accent">{APP_NAME}</span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={togglePrivacyMode}
          className="p-2 text-text-secondary hover:text-accent transition-colors"
          title={settings.privacyModeEnabled ? "Mostrar Valores" : "Ocultar Valores (Modo Sigilo)"}
        >
          {settings.privacyModeEnabled ? <EyeClosedIcon size={20} /> : <EyeOpenIcon size={20} />}
        </button>
        <Link 
          to="/settings" 
          className="p-2 text-text-secondary hover:text-accent transition-colors"
          title="Configurações"
        >
          <SettingsIcon size={20} />
        </Link>
      </div>
    </header>
  );
};

export default Header;