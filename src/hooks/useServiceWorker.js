import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Service Worker wird automatisch von vite-plugin-pwa registriert
      // Hier können wir auf Updates reagieren
      let refreshing = false;
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  }, []);
}

