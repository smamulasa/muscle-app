import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/**
 * ProtectedRoute - Schützt Routen vor unauthentifiziertem Zugriff
 * 
 * Leitet nicht eingeloggte User zur Auth-Seite weiter
 */
const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Warte auf Auth-Initialisierung
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#453ACF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Lade...</p>
        </div>
      </div>
    );
  }

  // Wenn nicht eingeloggt, zur Auth-Seite weiterleiten
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Wenn eingeloggt, Children rendern
  return children;
};

export default ProtectedRoute;
