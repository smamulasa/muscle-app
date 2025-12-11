# Test-Setup Anleitung für Muscle App

Diese Anleitung führt dich durch die Einrichtung der Muscle App für den Testbetrieb mit mehreren Usern.

## 🎯 Ziel

Die App soll in einem kleinen Kreis getestet werden. Jeder Tester kann:
- Ein eigenes Konto erstellen
- Workouts userbasiert speichern
- Nur seine eigenen Daten sehen

## ✅ Was bereits implementiert ist

- ✅ Login/Register UI
- ✅ Auth-Store mit Supabase
- ✅ Protected Routes
- ✅ Userbasierte Datenspeicherung
- ✅ Row Level Security (RLS) für Daten-Isolation

## 📋 Schritt-für-Schritt Setup

### 1. Supabase Projekt einrichten

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein neues Projekt (oder nutze ein bestehendes)
2. Notiere dir:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **Anon Key** (findest du unter Settings → API)

### 2. Datenbank-Schema ausführen

1. Gehe zu Supabase Dashboard → **SQL Editor**
2. Öffne die Datei `supabase/schema.sql` in deinem Projekt
3. Kopiere den gesamten Inhalt
4. Führe das SQL-Skript im SQL Editor aus

**Wichtig:** Dieses Schema erstellt:
- Tabellen `sets` und `sessions` mit `user_id` Spalten
- Row Level Security (RLS) Policies
- Indizes für Performance

### 3. Email-Bestätigung für Testing deaktivieren (optional)

Für einfacheres Testing kannst du die Email-Bestätigung deaktivieren:

1. Gehe zu Supabase Dashboard → **Authentication** → **Settings**
2. Unter **Email Auth**:
   - **Confirm email:** Deaktivieren (für Testing)
   - **Secure email change:** Kann aktiv bleiben

**Hinweis:** In Produktion sollte Email-Bestätigung aktiviert sein!

### 4. Environment-Variablen konfigurieren

Erstelle oder bearbeite `.env.local` im Projekt-Root:

```bash
# Storage-Typ: 'supabase' für Cloud-Sync mit Auth
VITE_STORAGE_TYPE=supabase

# Supabase Credentials
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Wichtig:** 
- `.env.local` ist in `.gitignore` und wird nicht committed
- Ersetze `xxxxx` mit deiner tatsächlichen Supabase Project URL
- Ersetze `eyJhbGc...` mit deinem tatsächlichen Anon Key

### 5. App starten

```bash
npm install  # Falls noch nicht gemacht
npm run dev
```

Die App sollte jetzt auf `http://localhost:5173` laufen.

### 6. Testen

1. **Registrierung testen:**
   - Öffne die App im Browser
   - Du wirst automatisch zu `/auth` weitergeleitet
   - Klicke auf "Jetzt registrieren"
   - Gib Email und Passwort ein (mindestens 6 Zeichen)
   - Nach erfolgreicher Registrierung wirst du zur Home-Seite weitergeleitet

2. **Login testen:**
   - Logge dich aus (Logout-Button in HomeView)
   - Melde dich wieder mit deinen Credentials an

3. **Daten-Speicherung testen:**
   - Starte ein Workout
   - Speichere einige Sets
   - Prüfe in Supabase Dashboard → **Table Editor** → `sets`
   - Die `user_id` Spalte sollte deine User-ID enthalten

4. **Multi-User testen:**
   - Erstelle ein zweites Test-Konto (andere Email)
   - Logge dich mit dem zweiten Konto ein
   - Du solltest nur die Daten dieses Kontos sehen
   - Logge dich wieder mit dem ersten Konto ein
   - Die Daten sollten getrennt sein

## 🔍 Verifizierung

### In Supabase prüfen

1. **Authentication → Users:**
   - Du solltest alle registrierten Tester sehen
   - Jeder User hat eine eindeutige UUID

2. **Table Editor → sets:**
   - Jeder Eintrag hat eine `user_id`
   - Verschiedene User haben verschiedene `user_id` Werte

3. **Table Editor → sessions:**
   - Jede Session hat eine `user_id`
   - Sessions sind nach User getrennt

### In der App prüfen

1. **Protected Routes:**
   - Nicht eingeloggte User werden zu `/auth` weitergeleitet
   - Eingeloggte User können alle Routen nutzen

2. **Daten-Isolation:**
   - User A sieht nur seine eigenen Workouts
   - User B sieht nur seine eigenen Workouts
   - Keine Überschneidungen

## 🐛 Troubleshooting

### "Row Level Security policy violation"

**Problem:** RLS ist aktiviert, aber Policies fehlen oder sind falsch.

**Lösung:**
1. Prüfe ob `schema.sql` vollständig ausgeführt wurde
2. Prüfe in Supabase → **Authentication** → **Policies** ob Policies existieren
3. Falls nicht, führe die Policies aus `schema.sql` erneut aus

### "Email not confirmed"

**Problem:** Email-Bestätigung ist aktiviert, aber Email wurde nicht bestätigt.

**Lösung:**
1. Prüfe deine E-Mail (auch Spam-Ordner)
2. Klicke auf den Bestätigungslink
3. Oder: Deaktiviere Email-Bestätigung für Testing (siehe Schritt 3)

### "Invalid login credentials"

**Problem:** Falsche Email/Passwort oder User existiert nicht.

**Lösung:**
1. Prüfe deine Eingaben
2. Stelle sicher, dass du dich registriert hast
3. Falls Email-Bestätigung aktiv ist, stelle sicher, dass Email bestätigt wurde

### Daten werden nicht gespeichert

**Problem:** `user_id` fehlt oder User ist nicht eingeloggt.

**Lösung:**
1. Prüfe ob User eingeloggt ist (sollte in HomeView angezeigt werden)
2. Prüfe Browser-Console auf Fehler
3. Prüfe ob `VITE_STORAGE_TYPE=supabase` gesetzt ist
4. Prüfe ob Schema korrekt ausgeführt wurde

### App zeigt "Lade..." und bleibt hängen

**Problem:** Auth-Initialisierung schlägt fehl.

**Lösung:**
1. Prüfe ob `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` korrekt gesetzt sind
2. Prüfe Browser-Console auf Fehler
3. Prüfe ob Supabase-Projekt aktiv ist

## 📝 Checkliste für Testbetrieb

- [ ] Supabase-Projekt erstellt
- [ ] Schema ausgeführt (`supabase/schema.sql`)
- [ ] RLS aktiviert und Policies erstellt
- [ ] Email-Bestätigung deaktiviert (optional für Testing)
- [ ] `.env.local` mit Supabase-Credentials erstellt
- [ ] `VITE_STORAGE_TYPE=supabase` gesetzt
- [ ] App startet ohne Fehler
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Workouts werden gespeichert
- [ ] Daten sind userbasiert (in Supabase prüfbar)
- [ ] Multi-User-Test erfolgreich (Daten-Isolation)

## 🎉 Fertig!

Die App ist jetzt bereit für den Testbetrieb. Jeder Tester kann:
- Ein eigenes Konto erstellen
- Workouts speichern
- Nur seine eigenen Daten sehen

## 📧 Tester einladen

Teile den Testern mit:
1. URL der App (z.B. Vercel-Deployment oder localhost mit ngrok)
2. Dass sie sich registrieren müssen
3. Dass Email-Bestätigung deaktiviert ist (falls so konfiguriert)
4. Dass sie ihre Credentials sicher aufbewahren sollen

## 🔒 Sicherheitshinweise für Testing

- **Email-Bestätigung:** Für Testing deaktiviert, für Produktion aktivieren!
- **Passwort-Anforderungen:** Mindestens 6 Zeichen (kann in Supabase angepasst werden)
- **RLS:** Muss aktiviert sein für Daten-Isolation
- **Anon Key:** Ist öffentlich, aber RLS schützt die Daten

## 🚀 Nächste Schritte

Nach erfolgreichem Testing:
1. Email-Bestätigung aktivieren
2. Passwort-Anforderungen verschärfen (optional)
3. Weitere Sicherheits-Features hinzufügen (optional)
4. Produktions-Deployment vorbereiten
