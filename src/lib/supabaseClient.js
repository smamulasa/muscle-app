import { createClient } from '@supabase/supabase-js';

/**
 * GEMEINSAMER SUPABASE CLIENT
 * 
 * Singleton-Pattern: Nur eine Instanz wird erstellt.
 * Verhindert "Multiple GoTrueClient instances" Warnung.
 * 
 * WICHTIG: Der Client verwendet automatisch die Session aus localStorage,
 * die beim Login gespeichert wird. RLS Policies funktionieren automatisch.
 */

let supabaseClient = null;

export const getSupabaseClient = () => {
  // Wenn bereits erstellt, gib die bestehende Instanz zurück
  if (supabaseClient) {
    return supabaseClient;
  }
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen in .env.local gesetzt sein');
  }
  
  // Erstelle Client einmalig
  // persistSession: true sorgt dafür, dass die Session in localStorage gespeichert wird
  // und automatisch bei jeder Query verwendet wird
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  });
  
  return supabaseClient;
};
