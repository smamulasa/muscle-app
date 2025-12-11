/**
 * STORE FACTORY
 * 
 * Diese Datei lädt automatisch die richtige Store-Variante basierend auf
 * der Environment-Variable VITE_STORAGE_TYPE.
 * 
 * Mögliche Werte:
 * - 'local' → LocalStorage-Version (useWorkoutStore.local.js)
 * - 'supabase' → Supabase-Version (useWorkoutStore.supabase.js)
 * 
 * Standard: 'local' (falls nicht gesetzt)
 */

import useWorkoutStoreLocal from './useWorkoutStore.local.js';
import useWorkoutStoreSupabase from './useWorkoutStore.supabase.js';

// Lade Storage-Typ aus Environment
const storageType = import.meta.env.VITE_STORAGE_TYPE || 'local';

// DEBUG: Zeige alle Environment-Variablen (ohne sensible Daten)
console.log('🔍 Environment-Variablen Debug:');
console.log('  VITE_STORAGE_TYPE:', storageType);
console.log('  VITE_SUPABASE_URL vorhanden:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('  VITE_SUPABASE_ANON_KEY vorhanden:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('  VITE_SUPABASE_URL Wert:', import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.substring(0, 30) + '...' : 'undefined');

// Wähle den richtigen Store basierend auf dem Storage-Typ
let useWorkoutStore;

if (storageType === 'supabase') {
  console.log('📦 Verwende Supabase Store');
  useWorkoutStore = useWorkoutStoreSupabase;
} else {
  console.log('💾 Verwende LocalStorage Store');
  console.log('   Grund: VITE_STORAGE_TYPE ist nicht "supabase" (aktuell:', storageType, ')');
  useWorkoutStore = useWorkoutStoreLocal;
}

// Warnung wenn Supabase gewählt, aber Konfiguration fehlt
if (storageType === 'supabase') {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase Store gewählt, aber VITE_SUPABASE_URL oder VITE_SUPABASE_ANON_KEY fehlen');
    console.warn('   VITE_SUPABASE_URL:', supabaseUrl ? 'vorhanden' : 'FEHLT');
    console.warn('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'vorhanden' : 'FEHLT');
    console.warn('⚠️ Fallback auf LocalStorage Store');
    useWorkoutStore = useWorkoutStoreLocal;
  }
}

export default useWorkoutStore;
