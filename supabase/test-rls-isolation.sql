-- ============================================
-- TEST: RLS ISOLATION FUNKTIONIERT?
-- ============================================
-- 
-- Dieses Skript zeigt dir, welche Daten in der DB sind
-- und ob RLS korrekt funktioniert.
-- ============================================

-- 1. Zeige ALLE Sets (als Admin - umgeht RLS)
-- ============================================
SELECT 
  'Alle Sets (Admin View)' as check_type,
  user_id,
  exercise_id,
  date,
  set_index,
  weight,
  reps
FROM sets
ORDER BY user_id, date DESC, set_index;

-- 2. Zeige User-ID Verteilung
-- ============================================
SELECT 
  'User ID Verteilung' as check_type,
  COALESCE(user_id::text, 'NULL') as user_id,
  COUNT(*) as anzahl_sets
FROM sets
GROUP BY user_id
ORDER BY anzahl_sets DESC;

-- 3. Prüfe ob RLS aktiviert ist
-- ============================================
SELECT 
  'RLS Status' as check_type,
  relname as table_name,
  CASE 
    WHEN relrowsecurity = true THEN '✅ Aktiviert'
    ELSE '❌ Nicht aktiviert'
  END as status
FROM pg_class 
WHERE relname IN ('sets', 'sessions');

-- 4. Zeige alle Policies
-- ============================================
SELECT 
  'Policies' as check_type,
  tablename,
  policyname,
  cmd as operation,
  qual as using_clause
FROM pg_policies 
WHERE tablename IN ('sets', 'sessions')
ORDER BY tablename, cmd;

-- 5. Test: Versuche als eingeloggter User zu lesen
-- ============================================
-- ⚠️ Diese Query wird mit der Session des eingeloggten Users ausgeführt
-- Sie sollte nur die Daten dieses Users zeigen (wenn RLS funktioniert)
SELECT 
  'RLS Test (als eingeloggter User)' as check_type,
  COUNT(*) as anzahl_sets,
  COUNT(DISTINCT user_id) as anzahl_user_ids,
  STRING_AGG(DISTINCT user_id::text, ', ') as user_ids
FROM sets;
