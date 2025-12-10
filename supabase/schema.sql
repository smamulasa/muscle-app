-- ============================================
-- SUPABASE DATENBANK-SCHEMA FÜR MUSCLE APP
-- ============================================
-- 
-- Führe dieses Skript in deinem Supabase Dashboard aus:
-- SQL Editor > New Query > Paste & Run
--
-- ============================================

-- 1. TABELLE: Sets (Einzelne Sätze einer Übung)
-- ============================================
CREATE TABLE IF NOT EXISTS sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL erlaubt für anonyme Nutzung
  exercise_id TEXT NOT NULL,
  date DATE NOT NULL,
  set_index INTEGER NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  reps INTEGER NOT NULL,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Eindeutige Kombination: Pro Übung/Datum/Index nur einen Satz
  -- Für anonyme Nutzung (user_id = NULL) oder pro User
  UNIQUE(user_id, exercise_id, date, set_index)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_sets_user_exercise_date ON sets(user_id, exercise_id, date);
CREATE INDEX IF NOT EXISTS idx_sets_user_date ON sets(user_id, date);

-- 2. TABELLE: Sessions (Abgeschlossene Workouts)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL erlaubt für anonyme Nutzung
  workout_id TEXT NOT NULL,
  title TEXT,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in Sekunden
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Eindeutige Kombination: Pro Workout/Datum nur eine Session
  -- Für anonyme Nutzung (user_id = NULL) oder pro User
  UNIQUE(user_id, workout_id, date)
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_workout ON sessions(user_id, workout_id);

-- 3. ROW LEVEL SECURITY (RLS) - Sicherheit
-- ============================================
-- Aktiviere RLS für beide Tabellen
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users können nur ihre eigenen Sets sehen/bearbeiten
CREATE POLICY "Users can view their own sets"
  ON sets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sets"
  ON sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sets"
  ON sets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sets"
  ON sets FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sessions sehen/bearbeiten
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

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
-- 1. Für anonyme Nutzung (ohne Auth) müssen die Policies angepasst werden
-- 2. Falls du ohne User-Auth starten willst, entferne die user_id Spalten
--    und passe die Policies entsprechend an
-- 3. Die UNIQUE Constraints verhindern doppelte Einträge
-- ============================================
