import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { APP_NAME } from '../constants';

interface BrandingSplashScreenProps {
  isFadingOut: boolean;
}

const BrandingSplashScreen: React.FC<BrandingSplashScreenProps> = ({ isFadingOut }) => {
  const { settings, loading: settingsLoading } = useAppData();

  // Wait for settings if not available, especially for custom colors/logo
  if (settingsLoading && !settings.splashScreenBackgroundColor && !settings.customLogo) { 
    return null; 
  }
  
  const bgColor = settings.splashScreenBackgroundColor || '#111827'; // Default dark slate if not set

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {settings.customLogo ? (
        <img src={settings.customLogo} alt={`${APP_NAME} Logo`} className="h-24 max-h-48 max-w-xs object-contain animate-pulse" />
      ) : (
        // Use text-accent for the text logo, it will pick up the user's chosen accent color
        <h1 className={`text-7xl font-bold text-accent animate-pulse`}>{APP_NAME}</h1>
      )}
    </div>
  );
};

export default BrandingSplashScreen;