import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const signIn = useAuthStore((state) => state.signIn);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await signIn(email, password);
    
    setIsLoading(false);
    
    if (result.success) {
      // Weiterleitung zur Home-Seite nach erfolgreichem Login
      navigate('/');
    }
    // Error wird im Store gesetzt und angezeigt
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Willkommen zurück</h2>
        <p className="text-gray-500 text-sm mb-6">Melde dich an, um fortzufahren</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              E-Mail
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#453ACF] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="deine@email.de"
              />
            </div>
          </div>

          {/* Passwort */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Passwort
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#453ACF] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Fehler-Anzeige */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#453ACF] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Wird angemeldet...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Anmelden</span>
              </>
            )}
          </button>
        </form>

        {/* Switch zu Register */}
        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToRegister}
            className="text-sm text-gray-600 hover:text-[#453ACF] transition-colors"
          >
            Noch kein Konto? <span className="font-semibold">Jetzt registrieren</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
