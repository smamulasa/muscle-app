-- ============================================
-- SUPABASE SETUP VERIFIZIERUNG
-- ============================================
-- 
-- Führe dieses Skript aus, um zu prüfen, ob alles korrekt eingerichtet ist.
-- Es zeigt dir den Status deiner Supabase-Konfiguration.
-- ============================================

-- 1. PRÜFE TABELLEN
-- ============================================
SELECT 
  'Tabellen-Status' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sets') 
      AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions')
    THEN '✅ Tabellen existieren'
    ELSE '❌ Tabellen fehlen'
  END as status;

-- 2. PRÜFE USER_ID SPALTEN
-- ============================================
SELECT 
  'user_id Spalten' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'sets' AND column_name = 'user_id'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'sessions' AND column_name = 'user_id'
    )
    THEN '✅ user_id Spalten vorhanden'
    ELSE '❌ user_id Spalten fehlen'
  END as status;

-- 3. PRÜFE ROW LEVEL SECURITY
-- ============================================
SELECT 
  'RLS Status' as check_type,
  CASE 
    WHEN (
      SELECT relrowsecurity FROM pg_class WHERE relname = 'sets'
    ) = true AND (
      SELECT relrowsecurity FROM pg_class WHERE relname = 'sessions'
    ) = true
    THEN '✅ RLS aktiviert'
    ELSE '❌ RLS nicht aktiviert'
  END as status;

-- 4. PRÜFE POLICIES
-- ============================================
SELECT 
  'Policies' as check_type,
  CASE 
    WHEN (
      SELECT COUNT(*) FROM pg_policies 
      WHERE tablename IN ('sets', 'sessions')
    ) >= 8
    THEN '✅ Policies vorhanden (' || (
      SELECT COUNT(*) FROM pg_policies 
      WHERE tablename IN ('sets', 'sessions')
    ) || ' Policies)'
    ELSE '❌ Policies fehlen oder unvollständig'
  END as status;

-- 5. PRÜFE INDEKES
-- ============================================
SELECT 
  'Indizes' as check_type,
  CASE 
    WHEN (
      SELECT COUNT(*) FROM pg_indexes 
      WHERE tablename IN ('sets', 'sessions')
    ) >= 6
    THEN '✅ Indizes vorhanden (' || (
      SELECT COUNT(*) FROM pg_indexes 
      WHERE tablename IN ('sets', 'sessions')
    ) || ' Indizes)'
    ELSE '⚠️ Indizes fehlen oder unvollständig'
  END as status;

-- 6. PRÜFE TRIGGER
-- ============================================
SELECT 
  'Trigger' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'update_sets_updated_at'
    )
    THEN '✅ Trigger vorhanden'
    ELSE '❌ Trigger fehlt'
  END as status;

-- 7. ZUSAMMENFASSUNG
-- ============================================
SELECT 
  '=== ZUSAMMENFASSUNG ===' as check_type,
  CASE 
    WHEN 
      EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sets') AND
      EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions') AND
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sets' AND column_name = 'user_id') AND
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sessions' AND column_name = 'user_id') AND
      (SELECT relrowsecurity FROM pg_class WHERE relname = 'sets') = true AND
      (SELECT relrowsecurity FROM pg_class WHERE relname = 'sessions') = true AND
      (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('sets', 'sessions')) >= 8
    THEN '✅ ALLES KORREKT EINGERICHTET!'
    ELSE '⚠️ EINIGE KOMPONENTEN FEHLEN - Prüfe die Details oben'
  END as status;

-- 8. ZEIGE ALLE POLICIES
-- ============================================
SELECT 
  'Policy Details' as check_type,
  tablename || ': ' || policyname as status
FROM pg_policies 
WHERE tablename IN ('sets', 'sessions')
ORDER BY tablename, policyname;
