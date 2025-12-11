-- ============================================
-- KOMPLETTE SUPABASE SETUP VERIFIZIERUNG
-- ============================================
-- 
-- Alle Checks in einer Query - du siehst alles auf einmal!
-- ============================================

SELECT 
  '1. Tabellen' as kategorie,
  'sets Tabelle' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sets') 
      THEN '✅ Existiert'
    ELSE '❌ Fehlt'
  END as status,
  1 as sort_order
UNION ALL
SELECT 
  '1. Tabellen' as kategorie,
  'sessions Tabelle' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions') 
      THEN '✅ Existiert'
    ELSE '❌ Fehlt'
  END as status,
  2 as sort_order
UNION ALL
SELECT 
  '2. user_id Spalten' as kategorie,
  'sets.user_id' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'sets' AND column_name = 'user_id'
    )
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  3 as sort_order
UNION ALL
SELECT 
  '2. user_id Spalten' as kategorie,
  'sessions.user_id' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'sessions' AND column_name = 'user_id'
    )
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  4 as sort_order
UNION ALL
SELECT 
  '3. Row Level Security' as kategorie,
  'RLS für sets' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_class 
      WHERE relname = 'sets' AND relrowsecurity = true
    )
    THEN '✅ Aktiviert'
    ELSE '❌ Nicht aktiviert'
  END as status,
  5 as sort_order
UNION ALL
SELECT 
  '3. Row Level Security' as kategorie,
  'RLS für sessions' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_class 
      WHERE relname = 'sessions' AND relrowsecurity = true
    )
    THEN '✅ Aktiviert'
    ELSE '❌ Nicht aktiviert'
  END as status,
  6 as sort_order
UNION ALL
SELECT 
  '4. Policies für sets' as kategorie,
  'SELECT Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can view their own sets')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  7 as sort_order
UNION ALL
SELECT 
  '4. Policies für sets' as kategorie,
  'INSERT Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can insert their own sets')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  8 as sort_order
UNION ALL
SELECT 
  '4. Policies für sets' as kategorie,
  'UPDATE Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can update their own sets')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  9 as sort_order
UNION ALL
SELECT 
  '4. Policies für sets' as kategorie,
  'DELETE Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sets' AND policyname = 'Users can delete their own sets')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  10 as sort_order
UNION ALL
SELECT 
  '5. Policies für sessions' as kategorie,
  'SELECT Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can view their own sessions')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  11 as sort_order
UNION ALL
SELECT 
  '5. Policies für sessions' as kategorie,
  'INSERT Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can insert their own sessions')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  12 as sort_order
UNION ALL
SELECT 
  '5. Policies für sessions' as kategorie,
  'UPDATE Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can update their own sessions')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  13 as sort_order
UNION ALL
SELECT 
  '5. Policies für sessions' as kategorie,
  'DELETE Policy' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can delete their own sessions')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  14 as sort_order
UNION ALL
SELECT 
  '6. Trigger' as kategorie,
  'update_sets_updated_at' as check_item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sets_updated_at')
    THEN '✅ Vorhanden'
    ELSE '❌ Fehlt'
  END as status,
  15 as sort_order
UNION ALL
SELECT 
  '=== ZUSAMMENFASSUNG ===' as kategorie,
  'Gesamt-Status' as check_item,
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
    ELSE '❌ EINIGE KOMPONENTEN FEHLEN'
  END as status,
  999 as sort_order
ORDER BY 
  sort_order,
  kategorie,
  check_item;
