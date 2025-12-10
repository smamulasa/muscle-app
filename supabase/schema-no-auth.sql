-- ============================================
-- SUPABASE SCHEMA OHNE AUTH (FÜR TESTING)
-- ============================================
-- 
-- Diese Version funktioniert OHNE User-Authentifizierung.
-- Perfekt für schnelles Testen und Entwicklung.
-- 
-- Führe dieses Skript in deinem Supabase Dashboard aus:
-- SQL Editor > New Query > Paste & Run
--
-- ============================================

-- 1. TABELLE: Sets (Einzelne Sätze einer Übung)
-- ============================================
CREATE TABLE IF NOT EXISTS sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  date DATE NOT NULL,
  set_index INTEGER NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  reps INTEGER NOT NULL,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Eindeutige Kombination: Pro Übung/Datum/Index nur einen Satz
  UNIQUE(exercise_id, date, set_index)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_sets_exercise_date ON sets(exercise_id, date);
CREATE INDEX IF NOT EXISTS idx_sets_date ON sets(date);

-- 2. TABELLE: Sessions (Abgeschlossene Workouts)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id TEXT NOT NULL,
  title TEXT,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in Sekunden
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Eindeutige Kombination: Pro Workout/Datum nur eine Session
  UNIQUE(workout_id, date)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_workout ON sessions(workout_id);

-- 3. ROW LEVEL SECURITY (RLS) - DEAKTIVIERT
-- ============================================
-- Für Testing ohne Auth deaktivieren wir RLS
ALTER TABLE sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;

-- 4. TRIGGER: updated_at automatisch aktualisieren
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sets_updated_at 
  BEFORE UPDATE ON sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HINWEISE:
-- ============================================
-- 1. Diese Version funktioniert OHNE Auth
-- 2. Alle Daten sind öffentlich zugänglich (nur für Testing!)
-- 3. Für Produktion: Nutze schema.sql mit Auth
-- ============================================
