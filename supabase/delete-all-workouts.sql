-- ============================================
-- ALLE WORKOUTS LÖSCHEN (ALLE USER)
-- ============================================
-- 
-- ⚠️ WARNUNG: Dieses Skript löscht ALLE Workouts von ALLEN Usern!
-- Führe dieses Skript nur aus, wenn du wirklich alle Daten löschen möchtest.
--
-- Führe dieses Skript in deinem Supabase Dashboard aus:
-- SQL Editor > New Query > Paste & Run
--
-- ============================================

-- 1. Lösche alle Sets (Einzelne Sätze)
DELETE FROM sets;

-- 2. Lösche alle Sessions (Abgeschlossene Workouts)
DELETE FROM sessions;

-- 3. Zeige Bestätigung
SELECT 
  '✅ Alle Workouts gelöscht!' as status,
  (SELECT COUNT(*) FROM sets) as verbleibende_sets,
  (SELECT COUNT(*) FROM sessions) as verbleibende_sessions;
