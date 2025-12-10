import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import useWorkoutStore from '../store/useWorkoutStore';

/**
 * SyncStatus Komponente
 * 
 * Zeigt den aktuellen Sync-Status an:
 * - Online/Offline Status
 * - Anzahl der ausstehenden Queue-Items
 * - Sync-Status (idle, syncing, synced, error)
 */
const SyncStatus = () => {
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 'local';
  
  // Nur anzeigen wenn Supabase aktiv ist
  if (storageType !== 'supabase') {
    return null;
  }
  
  const isOnline = useWorkoutStore((state) => state.isOnline);
  const syncStatus = useWorkoutStore((state) => state.syncStatus);
  const queueLength = useWorkoutStore((state) => state.queueLength);
  const syncQueue = useWorkoutStore((state) => state.syncQueue);
  
  // Keine Anzeige wenn alles synchronisiert ist und online
  if (isOnline && syncStatus === 'idle' && queueLength === 0) {
    return null;
  }
  
  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    if (syncStatus === 'syncing') return 'bg-yellow-500';
    if (syncStatus === 'synced') return 'bg-green-500';
    if (syncStatus === 'error') return 'bg-red-500';
    return 'bg-gray-500';
  };
  
  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={14} />;
    if (syncStatus === 'syncing') return <RefreshCw size={14} className="animate-spin" />;
    if (syncStatus === 'synced') return <CheckCircle size={14} />;
    if (syncStatus === 'error') return <AlertCircle size={14} />;
    return <Wifi size={14} />;
  };
  
  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Synchronisiere...';
    if (syncStatus === 'synced') return 'Synchronisiert';
    if (syncStatus === 'error') return 'Fehler';
    if (queueLength > 0) return `${queueLength} ausstehend`;
    return 'Online';
  };
  
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
      <button
        onClick={() => {
          if (isOnline && queueLength > 0) {
            syncQueue();
          }
        }}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white
          shadow-lg transition-all
          ${getStatusColor()}
          ${isOnline && queueLength > 0 ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'}
        `}
        title={isOnline && queueLength > 0 ? 'Jetzt synchronisieren' : undefined}
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        {queueLength > 0 && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
            {queueLength}
          </span>
        )}
      </button>
    </div>
  );
};

export default SyncStatus;
