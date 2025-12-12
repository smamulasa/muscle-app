import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, Activity, History, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Home', isHome: true },
    { icon: List, path: '/workouts', label: 'Workouts' },
    { icon: Activity, path: '/stats', label: 'Stats' },
    { icon: History, path: '/', label: 'History', onClick: () => navigate('/') },
    { icon: User, path: '/', label: 'Profile', onClick: () => navigate('/') }
  ];

  const isActive = (item) => {
    // Nur Home ist aktiv wenn wir auf '/' sind
    if (item.isHome) {
      return location.pathname === '/';
    }
    // Activity ist aktiv wenn wir auf '/stats' sind
    if (item.path === '/stats') {
      return location.pathname.startsWith('/stats');
    }
    // Workouts ist aktiv wenn wir auf '/workouts' sind
    if (item.path === '/workouts') {
      return location.pathname.startsWith('/workouts');
    }
    // Alle anderen sind nie aktiv
    return false;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[25rem] z-50">
      <nav className="bg-[#1c1c1e] rounded-full shadow-2xl border border-white/10 p-2 flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <button
              key={item.path + item.label}
              onClick={item.onClick || (() => navigate(item.path))}
              className="flex items-center justify-center p-2 transition-all relative"
              aria-label={item.label}
            >
              {/* Weißer Kreis um das Icon */}
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                active 
                  ? 'bg-white ring-2 ring-[#a855f7] scale-105' 
                  : 'bg-white hover:scale-105'
              }`}>
                <Icon 
                  size={active ? 22 : 20} 
                  strokeWidth={active ? 2.5 : 2}
                  fill={active ? 'currentColor' : 'none'}
                  className={active ? 'text-[#a855f7]' : 'text-gray-600'}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;

