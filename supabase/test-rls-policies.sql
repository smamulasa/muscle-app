-- ============================================
-- TEST RLS POLICIES
-- ============================================
-- 
-- Prüfe, ob die RLS Policies korrekt funktionieren.
-- ============================================

-- 1. Prüfe ob RLS aktiviert ist
SELECT 
  'RLS Status' as check_type,
  relname as table_name,
  CASE 
    WHEN relrowsecurity = true THEN '✅ Aktiviert'
    ELSE '❌ Nicht aktiviert'
  END as status
FROM pg_class 
WHERE relname IN ('sets', 'sessions');

-- 2. Zeige alle Policies mit Details
SELECT 
  'Policy Details' as check_type,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN qual IS NOT NULL THEN '✅ USING clause vorhanden'
    ELSE '❌ USING clause fehlt'
  END as using_status,
  CASE 
    WHEN with_check IS NOT NULL THEN '✅ WITH CHECK clause vorhanden'
    ELSE '❌ WITH CHECK clause fehlt'
  END as with_check_status
FROM pg_policies 
WHERE tablename IN ('sets', 'sessions')
ORDER BY tablename, cmd;

-- 3. Prüfe ob auth.uid() Funktion verfügbar ist
SELECT 
  'Auth Function' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'uid' 
      AND n.nspname = 'auth'
    )
    THEN '✅ auth.uid() Funktion vorhanden'
    ELSE '❌ auth.uid() Funktion fehlt'
  END as status;

-- 4. Zeige aktuelle Daten (als Admin - umgeht RLS)
-- ⚠️ Diese Query zeigt ALLE Daten, unabhängig von RLS
SELECT 
  'Sets Daten (Admin View - umgeht RLS)' as check_type,
  COUNT(*) as total_sets,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE user_id IS NULL) as sets_without_user_id
FROM sets;

-- 5. Zeige user_id Verteilung
SELECT 
  'User ID Verteilung in sets' as check_type,
  COALESCE(user_id::text, 'NULL') as user_id,
  COUNT(*) as set_count
FROM sets
GROUP BY user_id
ORDER BY set_count DESC;

-- 6. Zeige Sessions user_id Verteilung
SELECT 
  'User ID Verteilung in sessions' as check_type,
  COALESCE(user_id::text, 'NULL') as user_id,
  COUNT(*) as session_count
FROM sessions
GROUP BY user_id
ORDER BY session_count DESC;
