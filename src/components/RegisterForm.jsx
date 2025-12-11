import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const signUp = useAuthStore((state) => state.signUp);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }
    
    setIsLoading(true);
    setSuccess(false);
    
    const result = await signUp(email, password);
    
    setIsLoading(false);
    
    if (result.success) {
      setSuccess(true);
      // Nach 2 Sekunden zur App weiterleiten
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  const passwordMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid = password.length >= 6;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Konto erstellen</h2>
        <p className="text-gray-500 text-sm mb-6">Erstelle ein Konto, um deine Workouts zu speichern</p>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Registrierung erfolgreich!</h3>
            <p className="text-gray-600 text-sm mb-4">
              Bitte prüfe deine E-Mail und bestätige dein Konto.
            </p>
            <p className="text-gray-500 text-xs">
              Du wirst gleich weitergeleitet...
            </p>
          </div>
        ) : (
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
                  placeholder="Mindestens 6 Zeichen"
                />
              </div>
              {password && !passwordValid && (
                <p className="mt-1 text-xs text-red-600">Passwort muss mindestens 6 Zeichen lang sein</p>
              )}
            </div>

            {/* Passwort bestätigen */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Passwort bestätigen
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#453ACF] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                    confirmPassword && !passwordMatch ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Passwort wiederholen"
                />
              </div>
              {confirmPassword && !passwordMatch && (
                <p className="mt-1 text-xs text-red-600">Passwörter stimmen nicht überein</p>
              )}
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
              disabled={isLoading || !passwordMatch || !passwordValid}
              className="w-full bg-[#453ACF] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Wird erstellt...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Konto erstellen</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Switch zu Login */}
        {!success && (
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-sm text-gray-600 hover:text-[#453ACF] transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft size={14} />
              <span>Bereits ein Konto? <span className="font-semibold">Anmelden</span></span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
