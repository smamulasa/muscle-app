# Supabase Setup Verifizierung

Prüfe, ob Supabase korrekt aufgesetzt ist.

## ✅ Schnell-Checkliste

### 1. Supabase Dashboard prüfen

- [ ] **Projekt aktiv:** Gehe zu Supabase Dashboard → Project Overview
- [ ] **Tabellen vorhanden:** Gehe zu Table Editor → Du solltest `sets` und `sessions` sehen
- [ ] **Authentication aktiv:** Gehe zu Authentication → Providers → Email sollte aktiviert sein

### 2. Schema-Verifizierung

Führe das Verifizierungs-Skript aus:

1. Gehe zu Supabase Dashboard → **SQL Editor**
2. Öffne die Datei `supabase/verify-setup.sql`
3. Kopiere den gesamten Inhalt
4. Führe das Skript aus
5. Prüfe die Ergebnisse - alles sollte ✅ zeigen

### 3. Environment-Variablen prüfen

In der Browser-Console (F12) solltest du sehen:
```
VITE_STORAGE_TYPE: supabase
VITE_SUPABASE_URL vorhanden: true
VITE_SUPABASE_ANON_KEY vorhanden: true
```

### 4. App-Verhalten prüfen

- [ ] **Login-Seite:** App zeigt `/auth` wenn nicht eingeloggt
- [ ] **Registrierung:** Du kannst ein Konto erstellen
- [ ] **Login:** Du kannst dich anmelden
- [ ] **Weiterleitung:** Nach Login wirst du zu `/` weitergeleitet
- [ ] **User-Info:** In HomeView siehst du deine Email
- [ ] **Logout:** Logout-Button funktioniert

### 5. Datenbank-Verbindung testen

1. **Registriere dich** in der App
2. **Starte ein Workout** und speichere einige Sets
3. **Prüfe in Supabase:**
   - Gehe zu Table Editor → `sets`
   - Du solltest deine Sets sehen
   - Die `user_id` Spalte sollte deine User-ID enthalten

### 6. Multi-User-Test

1. **Erstelle ein zweites Test-Konto** (andere Email)
2. **Logge dich mit dem zweiten Konto ein**
3. **Prüfe:** Du solltest nur die Daten des zweiten Kontos sehen
4. **Logge dich mit dem ersten Konto ein**
5. **Prüfe:** Du solltest nur die Daten des ersten Kontos sehen

## 🔍 Detaillierte Prüfung

### In Supabase Dashboard prüfen:

#### Table Editor → sets
- [ ] Tabelle existiert
- [ ] Spalte `user_id` vorhanden
- [ ] Spalte `exercise_id` vorhanden
- [ ] Spalte `date` vorhanden
- [ ] Spalte `set_index` vorhanden
- [ ] Spalte `weight` vorhanden
- [ ] Spalte `reps` vorhanden

#### Table Editor → sessions
- [ ] Tabelle existiert
- [ ] Spalte `user_id` vorhanden
- [ ] Spalte `workout_id` vorhanden
- [ ] Spalte `date` vorhanden
- [ ] Spalte `duration` vorhanden

#### Authentication → Policies
- [ ] Policies für `sets` vorhanden (4 Policies: SELECT, INSERT, UPDATE, DELETE)
- [ ] Policies für `sessions` vorhanden (4 Policies: SELECT, INSERT, UPDATE, DELETE)

#### Database → Tables → sets → RLS
- [ ] Row Level Security aktiviert

#### Database → Tables → sessions → RLS
- [ ] Row Level Security aktiviert

## 🐛 Häufige Probleme

### "Tabellen fehlen"
**Lösung:** Führe `supabase/reset-and-setup-auth.sql` aus

### "user_id Spalten fehlen"
**Lösung:** Führe `supabase/reset-and-setup-auth.sql` aus

### "RLS nicht aktiviert"
**Lösung:** Führe `supabase/reset-and-setup-auth.sql` aus

### "Policies fehlen"
**Lösung:** Führe `supabase/reset-and-setup-auth.sql` aus

### "Daten werden nicht gespeichert"
**Mögliche Ursachen:**
1. User ist nicht eingeloggt → Prüfe Auth-Status
2. RLS blockiert → Prüfe Policies
3. Schema nicht ausgeführt → Führe Schema aus

### "Row Level Security policy violation"
**Lösung:** 
1. Prüfe ob Policies existieren (siehe oben)
2. Prüfe ob User eingeloggt ist
3. Führe `supabase/reset-and-setup-auth.sql` erneut aus

## ✅ Alles korrekt?

Wenn alle Checks ✅ zeigen:
- ✅ Supabase ist korrekt aufgesetzt
- ✅ Du kannst die App für Testing nutzen
- ✅ Multi-User-Support ist aktiv
- ✅ Daten-Isolation funktioniert

## 📝 Nächste Schritte

1. **Email-Bestätigung deaktivieren** (optional für Testing):
   - Supabase Dashboard → Authentication → Settings
   - "Confirm email" deaktivieren

2. **Tester einladen:**
   - Teile die App-URL
   - Jeder Tester kann sich registrieren
   - Jeder sieht nur seine eigenen Daten

3. **Produktions-Vorbereitung:**
   - Email-Bestätigung aktivieren
   - Passwort-Anforderungen verschärfen (optional)
   - Weitere Sicherheits-Features hinzufügen (optional)
