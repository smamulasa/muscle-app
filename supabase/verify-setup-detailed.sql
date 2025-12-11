-- ============================================
-- DETAILLIERTE SUPABASE SETUP VERIFIZIERUNG
-- ============================================
-- 
-- Dieses Skript zeigt dir GENAU, was fehlt oder falsch ist.
-- ============================================

-- 1. PRÜFE TABELLEN
-- ============================================
SELECT 
  '1. Tabellen' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sets') 
      THEN '✅ sets Tabelle existiert'
    ELSE '❌ sets Tabelle fehlt'
  END as status;

SELECT 
  '1. Tabellen' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions') 
      THEN '✅ sessions Tabelle existiert'
    ELSE '❌ sessions Tabelle fehlt'
  END as status;

-- 2. PRÜFE USER_ID SPALTEN
-- ============================================
SELECT 
  '2. user_id Spalten' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'sets' AND column_name = 'user_id'
    )
    THEN '✅ sets.user_id vorhanden'
    ELSE '❌ sets.user_id fehlt'
  END as status;

SELECT 
  '2. user_id Spalten' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'sessions' AND column_name = 'user_id'
    )
    THEN '✅ sessions.user_id vorhanden'
    ELSE '❌ sessions.user_id fehlt'
  END as status;

-- 3. PRÜFE ROW LEVEL SECURITY
-- ============================================
SELECT 
  '3. Row Level Security' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_class 
      WHERE relname = 'sets' AND relrowsecurity = true
    )
    THEN '✅ RLS für sets aktiviert'
    ELSE '❌ RLS für sets NICHT aktiviert'
  END as status;

SELECT 
  '3. Row Level Security' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_class 
      WHERE relname = 'sessions' AND relrowsecurity = true
    )
    THEN '✅ RLS für sessions aktiviert'
    ELSE '❌ RLS für sessions NICHT aktiviert'
  END as status;

-- 4. PRÜFE POLICIES FÜR SETS
-- ============================================
SELECT 
  '4. Policies für sets' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can view their own sets')
    THEN '✅ SELECT Policy vorhanden'
    ELSE '❌ SELECT Policy fehlt'
  END as status;

SELECT 
  '4. Policies für sets' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can insert their own sets')
    THEN '✅ INSERT Policy vorhanden'
    ELSE '❌ INSERT Policy fehlt'
  END as status;

SELECT 
  '4. Policies für sets' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can update their own sets')
    THEN '✅ UPDATE Policy vorhanden'
    ELSE '❌ UPDATE Policy fehlt'
  END as status;

SELECT 
  '4. Policies für sets' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can delete their own sets')
    THEN '✅ DELETE Policy vorhanden'
    ELSE '❌ DELETE Policy fehlt'
  END as status;

-- 5. PRÜFE POLICIES FÜR SESSIONS
-- ============================================
SELECT 
  '5. Policies für sessions' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can view their own sessions')
    THEN '✅ SELECT Policy vorhanden'
    ELSE '❌ SELECT Policy fehlt'
  END as status;

SELECT 
  '5. Policies für sessions' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can insert their own sessions')
    THEN '✅ INSERT Policy vorhanden'
    ELSE '❌ INSERT Policy fehlt'
  END as status;

SELECT 
  '5. Policies für sessions' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can update their own sessions')
    THEN '✅ UPDATE Policy vorhanden'
    ELSE '❌ UPDATE Policy fehlt'
  END as status;

SELECT 
  '5. Policies für sessions' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can delete their own sessions')
    THEN '✅ DELETE Policy vorhanden'
    ELSE '❌ DELETE Policy fehlt'
  END as status;

-- 6. PRÜFE TRIGGER
-- ============================================
SELECT 
  '6. Trigger' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sets_updated_at')
    THEN '✅ Trigger update_sets_updated_at vorhanden'
    ELSE '❌ Trigger update_sets_updated_at fehlt'
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
      EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sets' AND relrowsecurity = true) AND
      EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sessions' AND relrowsecurity = true) AND
      (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'sets') = 4 AND
      (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'sessions') = 4
    THEN '✅ ALLES KORREKT EINGERICHTET!'
    ELSE '❌ EINIGE KOMPONENTEN FEHLEN - Siehe Details oben'
  END as status;

-- 8. ZEIGE ALLE POLICIES (optional)
-- ============================================
SELECT 
  'Policy Details' as check_type,
  tablename || ': ' || policyname as status
FROM pg_policies 
WHERE tablename IN ('sets', 'sessions')
ORDER BY tablename, policyname;
