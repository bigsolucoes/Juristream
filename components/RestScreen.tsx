import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { APP_NAME } from '../constants';

const RestScreen: React.FC = () => {
  const { settings, toggleRestScreen } = useAppData();
  
  const bgColor = settings.splashScreenBackgroundColor || '#FFFFFF';

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="fixed inset-0 flex flex-col items-center justify-center z-[100] cursor-pointer"
      onClick={toggleRestScreen}
    >
      {settings.customLogo ? (
        <img src={settings.customLogo} alt={`${APP_NAME} Logo`} className="h-24 max-h-48 max-w-xs object-contain" />
      ) : (
        <h1 className="text-7xl font-bold text-accent">{APP_NAME}</h1>
      )}
       <p className="text-text-secondary mt-4 animate-pulse">Clique para voltar</p>
    </div>
  );
};

export default RestScreen;