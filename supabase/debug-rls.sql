-- ============================================
-- RLS DEBUG - Prüfe ob RLS korrekt funktioniert
-- ============================================
-- 
-- Führe dieses Skript aus, um zu prüfen, ob RLS korrekt funktioniert.
-- ============================================

-- 1. Prüfe ob RLS aktiviert ist
SELECT 
  'RLS Status' as check_type,
  relname as table_name,
  relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname IN ('sets', 'sessions');

-- 2. Zeige alle Policies
SELECT 
  'Policies' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('sets', 'sessions')
ORDER BY tablename, policyname;

-- 3. Prüfe Daten in sets (ohne RLS - als Admin)
-- ⚠️ Diese Query umgeht RLS, zeigt alle Daten
SELECT 
  'Sets Daten (Admin View)' as check_type,
  COUNT(*) as total_sets,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE user_id IS NULL) as sets_without_user_id
FROM sets;

-- 4. Zeige user_id Verteilung
SELECT 
  'User ID Verteilung' as check_type,
  user_id,
  COUNT(*) as set_count
FROM sets
GROUP BY user_id
ORDER BY set_count DESC;

-- 5. Prüfe ob auth.uid() Funktion verfügbar ist
SELECT 
  'Auth Function' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'uid' 
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')
    )
    THEN '✅ auth.uid() Funktion vorhanden'
    ELSE '❌ auth.uid() Funktion fehlt'
  END as status;
