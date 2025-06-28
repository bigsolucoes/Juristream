import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS, APP_NAME, ACCENT_COLOR, ExternalLinkIcon } from '../constants';
import { LucideProps } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<LucideProps>;
}

const Sidebar: React.FC = () => {
  const { settings } = useAppData();
  
  return (
    <div className={`w-64 p-5 hidden md:flex md:flex-col space-y-2 h-full shadow-lg 
                    bg-slate-800 bg-opacity-75 backdrop-filter backdrop-blur-lg 
                    text-slate-100 border-r border-slate-700`}>
      <nav className="flex-grow mt-4"> 
        <ul>
          {(NAVIGATION_ITEMS as NavigationItem[]).map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.name} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ease-in-out filter hover:brightness-100 ${
                      isActive ? `bg-accent text-white shadow-md` : 'hover:text-slate-50'
                    }`
                  }
                >
                  {IconComponent && <IconComponent size={20} />}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* External Links Section */}
      <div className="mt-4 pt-4 border-t border-slate-600 space-y-2">
         <p className="px-3 text-xs font-semibold text-slate-400 uppercase">Links Úteis</p>
        <a
          href="https://www.tjsp.jus.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition-colors duration-200 ease-in-out"
        >
          <ExternalLinkIcon size={20} />
          <span>TJSP</span>
        </a>
        <a
          href="https://www.stj.jus.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition-colors duration-200 ease-in-out"
        >
          <ExternalLinkIcon size={20} />
          <span>STJ</span>
        </a>
      </div>

      <div className="text-center text-xs text-slate-400 mt-auto pt-4 pb-2">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}</p>
        <p>Powered by BIG Soluções</p>
      </div>
    </div>
  );
};

export default Sidebar;