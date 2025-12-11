-- ============================================
-- MIGRATION: VON NO-AUTH ZU AUTH SCHEMA
-- ============================================
-- 
-- Dieses Skript migriert bestehende Tabellen (ohne Auth) 
-- zu Tabellen mit User-Authentifizierung.
-- 
-- Führe dieses Skript im Supabase SQL Editor aus.
-- 
-- ⚠️ WICHTIG: 
-- - Erstellt ein Backup deiner Daten, falls vorhanden!
-- - Dieses Skript fügt user_id Spalten hinzu
-- - Bestehende Daten bleiben erhalten (user_id wird NULL sein)
-- ============================================

-- 1. USER_ID SPALTEN HINZUFÜGEN
-- ============================================

-- Füge user_id Spalte zu sets hinzu (falls nicht vorhanden)
ALTER TABLE sets 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Füge user_id Spalte zu sessions hinzu (falls nicht vorhanden)
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. UNIQUE CONSTRAINTS ANPASSEN
-- ============================================

-- Entferne alte UNIQUE Constraints (falls vorhanden)
ALTER TABLE sets 
DROP CONSTRAINT IF EXISTS sets_exercise_id_date_set_index_key;

ALTER TABLE sessions 
DROP CONSTRAINT IF EXISTS sessions_workout_id_date_key;

-- Erstelle neue UNIQUE Constraints mit user_id
-- (NULL user_id wird als separater Wert behandelt)
ALTER TABLE sets 
ADD CONSTRAINT sets_user_exercise_date_index_unique 
UNIQUE (user_id, exercise_id, date, set_index);

ALTER TABLE sessions 
ADD CONSTRAINT sessions_user_workout_date_unique 
UNIQUE (user_id, workout_id, date);

-- 3. INDEKES HINZUFÜGEN
-- ============================================

-- Indizes für schnelle Abfragen mit user_id
CREATE INDEX IF NOT EXISTS idx_sets_user_exercise_date ON sets(user_id, exercise_id, date);
CREATE INDEX IF NOT EXISTS idx_sets_user_date ON sets(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_workout ON sessions(user_id, workout_id);

-- 4. ROW LEVEL SECURITY (RLS) AKTIVIEREN
-- ============================================

-- Aktiviere RLS für beide Tabellen
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES ERSTELLEN
-- ============================================

-- Lösche alte Policies (falls vorhanden)
DROP POLICY IF EXISTS "Users can view their own sets" ON sets;
DROP POLICY IF EXISTS "Users can insert their own sets" ON sets;
DROP POLICY IF EXISTS "Users can update their own sets" ON sets;
DROP POLICY IF EXISTS "Users can delete their own sets" ON sets;
DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON sessions;

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

-- 6. TRIGGER FÜR updated_at
-- ============================================

-- Funktion für updated_at Trigger (wird aktualisiert falls vorhanden)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für sets (löschen falls vorhanden, dann neu erstellen)
DO $$ 
BEGIN
  -- Versuche Trigger zu löschen (ignoriere Fehler falls nicht vorhanden)
  BEGIN
    DROP TRIGGER update_sets_updated_at ON sets;
  EXCEPTION WHEN OTHERS THEN
    -- Trigger existiert nicht, das ist okay
    NULL;
  END;
END $$;

-- Erstelle Trigger neu
CREATE TRIGGER update_sets_updated_at 
  BEFORE UPDATE ON sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION ABGESCHLOSSEN
-- ============================================
-- 
-- ✅ user_id Spalten wurden hinzugefügt
-- ✅ RLS wurde aktiviert
-- ✅ Policies wurden erstellt
-- ✅ Indizes wurden erstellt
-- 
-- ⚠️ HINWEIS:
-- Bestehende Daten haben user_id = NULL.
-- Diese sind nur sichtbar, wenn kein User eingeloggt ist.
-- Um bestehende Daten einem User zuzuordnen, führe aus:
-- 
-- UPDATE sets SET user_id = 'deine-user-id-hier' WHERE user_id IS NULL;
-- UPDATE sessions SET user_id = 'deine-user-id-hier' WHERE user_id IS NULL;
-- 
-- ============================================
