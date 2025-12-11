import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

/**
 * AUTH STORE
 * 
 * Verwaltet User-Authentifizierung über Supabase Auth.
 * Unterstützt Login, Register, Logout und Session-Management.
 */

// Supabase Client für Auth
const getSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen gesetzt sein');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

const useAuthStore = create((set, get) => ({
  // --- STATE ---
  user: null,
  session: null,
  isLoading: true,
  error: null,

  // --- INITIALISIERUNG ---
  init: async () => {
    try {
      const supabase = getSupabaseClient();
      
      // Prüfe ob bereits eine Session existiert
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      set({ 
        session, 
        user: session?.user || null,
        isLoading: false 
      });
      
      // Listener für Auth-Änderungen
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session, 
          user: session?.user || null 
        });
      });
    } catch (error) {
      console.error('Fehler bei Auth-Initialisierung:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // --- AKTIONEN ---
  
  // Registrierung
  signUp: async (email, password, metadata = {}) => {
    try {
      const supabase = getSupabaseClient();
      set({ error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata // Zusätzliche User-Daten (Name, etc.)
        }
      });
      
      if (error) throw error;
      
      set({ 
        session: data.session, 
        user: data.user 
      });
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Fehler bei Registrierung:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Login
  signIn: async (email, password) => {
    try {
      const supabase = getSupabaseClient();
      set({ error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      set({ 
        session: data.session, 
        user: data.user 
      });
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Fehler bei Login:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Logout
  signOut: async () => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        session: null, 
        user: null 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Fehler bei Logout:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Passwort zurücksetzen
  resetPassword: async (email) => {
    try {
      const supabase = getSupabaseClient();
      set({ error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Fehler bei Passwort-Reset:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Aktueller User
  getCurrentUser: () => {
    return get().user;
  },

  // Ist eingeloggt?
  isAuthenticated: () => {
    return !!get().user;
  }
}));

export default useAuthStore;
