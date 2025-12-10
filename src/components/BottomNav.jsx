import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, Activity, History, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: List, path: '/', label: 'Workouts', onClick: () => navigate('/') }, // Geht zurück zur Home-Seite
    { icon: Activity, path: '/stats', label: 'Stats' },
    { icon: History, path: '/', label: 'History', onClick: () => navigate('/') }, // Geht zurück zur Home-Seite
    { icon: User, path: '/', label: 'Profile', onClick: () => navigate('/') } // Geht zurück zur Home-Seite
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[25rem] bg-white rounded-full shadow-2xl shadow-gray-200 border border-gray-100 p-2 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path + item.label}
            onClick={item.onClick || (() => navigate(item.path))}
            className={`p-3 rounded-full flex flex-col items-center gap-1 transition-all ${
              active 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label={item.label}
          >
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;

