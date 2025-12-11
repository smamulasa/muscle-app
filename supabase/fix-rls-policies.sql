-- ============================================
-- RLS POLICIES REPARIEREN
-- ============================================
-- 
-- Dieses Skript löscht und erstellt die RLS Policies neu,
-- um sicherzustellen, dass sie korrekt funktionieren.
-- ============================================

-- 1. LÖSCHE ALLE BESTEHENDEN POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own sets" ON sets;
DROP POLICY IF EXISTS "Users can insert their own sets" ON sets;
DROP POLICY IF EXISTS "Users can update their own sets" ON sets;
DROP POLICY IF EXISTS "Users can delete their own sets" ON sets;

DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON sessions;

-- 2. STELLE SICHER, DASS RLS AKTIVIERT IST
-- ============================================

ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 3. ERSTELLE POLICIES NEU (MIT EXPLIZITER USER_ID PRÜFUNG)
-- ============================================

-- Policy: Users können nur ihre eigenen Sets sehen
CREATE POLICY "Users can view their own sets"
  ON sets FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sets einfügen
CREATE POLICY "Users can insert their own sets"
  ON sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sets aktualisieren
CREATE POLICY "Users can update their own sets"
  ON sets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sets löschen
CREATE POLICY "Users can delete their own sets"
  ON sets FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sessions sehen
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sessions einfügen
CREATE POLICY "Users can insert their own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sessions aktualisieren
CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users können nur ihre eigenen Sessions löschen
CREATE POLICY "Users can delete their own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- ✅ FERTIG!
-- ============================================
-- 
-- Die RLS Policies wurden neu erstellt.
-- Jetzt sollten User nur noch ihre eigenen Daten sehen können.
-- 
-- ⚠️ WICHTIG: Prüfe nach dem Ausführen:
-- 1. Logge dich mit test2@test.de ein
-- 2. Prüfe, ob du nur deine eigenen Daten siehst
-- 3. Logge dich mit test3@test.de ein
-- 4. Prüfe, ob du nur deine eigenen Daten siehst
-- 
-- ============================================
