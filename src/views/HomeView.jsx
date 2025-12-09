import React from 'react';
import { Play, Home, List, Activity, History, User, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useWorkoutStore from '../store/useWorkoutStore';

const HomeView = () => {
  const navigate = useNavigate();
  const sessions = useWorkoutStore((state) => state.sessions);

  // --- HELPER FUNKTIONEN ---

  // 1. Datum formatieren (z.B. "Heute" oder "09.12.")
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Heute";
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  // 2. Prüfen, ob das Datum in der aktuellen Woche liegt (seit Montag)
  const isThisWeek = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    
    // Tag der Woche (0=So, 1=Mo, ..., 6=Sa). Wir machen Mo=0 für die Rechnung.
    const dayOfWeek = (now.getDay() + 6) % 7; 
    
    // Datum des letzten Montags ermitteln
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0); // Tagesbeginn

    return date >= monday;
  };

  // Wir filtern: Nur Sessions seit letztem Montag
  const weeklySessions = sessions.filter(s => isThisWeek(s.date));

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* --- HEADER --- */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today</h1>
          <p className="text-gray-500">Welcome back, Alex</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
          A
        </div>
      </header>

      {/* --- HERO CARD (PLANNED WORKOUT) --- */}
      <section className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Planned workout</h2>
        
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          
          {/* Bild / Video Overlay */}
          <div 
            onClick={() => navigate('/workout/push')}
            className="relative w-full h-48 bg-gray-800 rounded-2xl overflow-hidden mb-4 group cursor-pointer"
          >
             <img 
               src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2670&auto=format&fit=crop" 
               alt="Workout Cover" 
               className="w-full h-full object-cover opacity-90 transition-transform group-hover:scale-105 duration-700"
             />
             <div className="absolute inset-0 bg-black/20"></div>

             <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
               <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full mb-1 border border-white/20">
                 <Play fill="white" size={20} className="ml-0.5" />
               </div>
               <span className="text-xs font-medium tracking-wide shadow-sm">Start now</span>
             </div>
          </div>

          {/* Infos & Start Button */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Push Hypertrophy</h3>
                <p className="text-sm text-gray-500 mt-1">45–60 min • Focus: Chest</p>
              </div>
              <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                Goal: Build
              </span>
            </div>
            
            <div className="flex justify-between items-end gap-2 mt-3">
               <p className="text-sm text-gray-400 leading-relaxed max-w-[60%]">
                 Bench, rows, overhead press, pull-ups...
               </p>

               <button 
                 onClick={() => navigate('/workout/push')} 
                 className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-indigo-200 text-sm"
               >
                 <Play fill="currentColor" size={16} />
                 Start
               </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- BROWSE SPLITS (Horizontal Scroll) --- */}
      <section className="mb-8">
        <div className="px-6 flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-gray-900">Browse Splits</h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x hide-scrollbar">
          <SplitCard 
            title="Push" subtitle="Chest • Shoulders" color="indigo" icon="💪" count="4" 
            onClick={() => navigate('/workout/push')} 
          />
          <SplitCard 
            title="Pull" subtitle="Back • Biceps" color="purple" icon="🦍" count="4" 
            onClick={() => navigate('/workout/pull')} 
          />
          <SplitCard 
            title="Core" subtitle="Abs • Stability" color="blue" icon="🔥" count="3" 
            onClick={() => navigate('/workout/core')} 
          />
        </div>
      </section>

      {/* --- WEEKLY HISTORY (This Week) --- */}
      <section className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-900">This Week</h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            {weeklySessions.length} / 3 Done
          </span>
        </div>
        
        {weeklySessions.length > 0 ? (
          <div className="space-y-4">
            {weeklySessions.map((session, index) => (
              <div key={index} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{session.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(session.date)} • {session.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State (Montags)
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm border-dashed">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <History size={24} />
            </div>
            <h4 className="font-bold text-gray-900">Neue Woche, neuer Start!</h4>
            <p className="text-sm text-gray-400 mt-1 mb-4">Du hast diese Woche noch nicht trainiert.</p>
            <button onClick={() => navigate('/workout/push')} className="text-indigo-600 font-bold text-sm hover:underline">
              Erstes Workout starten
            </button>
          </div>
        )}
      </section>

      {/* --- BOTTOM NAV (Zentriert) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[25rem] bg-white rounded-full shadow-2xl shadow-gray-200 border border-gray-100 p-2 flex justify-between items-center z-50">
        <NavButton icon={Home} active />
        <NavButton icon={List} />
        <NavButton icon={Activity} />
        <NavButton icon={History} />
        <NavButton icon={User} />
      </div>

    </div>
  );
};

// --- HELFER KOMPONENTEN ---

const NavButton = ({ icon: Icon, active }) => (
  <button className={`p-3 rounded-full flex flex-col items-center gap-1 transition-all ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
  </button>
);

const SplitCard = ({ title, subtitle, color, icon, count, onClick }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-900 border-indigo-100",
    purple: "bg-purple-50 text-purple-900 border-purple-100",
    blue: "bg-blue-50 text-blue-900 border-blue-100"
  };
  // Fallback falls Farbe nicht matcht
  const theme = colors[color] || colors.indigo;

  return (
    <div 
      onClick={onClick} 
      className={`min-w-[150px] snap-center p-4 rounded-2xl flex flex-col justify-between h-40 border active:scale-95 transition-transform cursor-pointer ${theme}`}
    >
      <div>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-sm">{icon}</div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-[10px] opacity-70 mt-1 font-medium leading-tight">{subtitle}</p>
      </div>
      <p className="text-[10px] opacity-60 font-bold">{count} exercises</p>
    </div>
  );
};

export default HomeView;