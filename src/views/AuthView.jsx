import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

/**
 * AuthView - Login/Register Seite
 * 
 * Zeigt entweder Login- oder Register-Formular
 */
const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#453ACF]/10 via-gray-50 to-gray-100 flex items-center justify-center p-6">
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthView;
