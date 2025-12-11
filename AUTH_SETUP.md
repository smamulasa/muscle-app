# Auth-Setup Anleitung

Diese Anleitung führt dich durch die Einrichtung von User-Authentifizierung für die Muscle App.

## ✅ Was wurde implementiert

- ✅ Auth-Store (`useAuthStore.js`) - Login, Register, Logout
- ✅ Login/Register UI-Komponenten
- ✅ Protected Routes - Nur eingeloggte User können die App nutzen
- ✅ Store-Integration - Alle Queries nutzen jetzt `user_id`
- ✅ Logout-Button in HomeView

## 🗄️ Schritt 1: Schema mit Auth aktivieren

**WICHTIG:** Du musst das Schema mit Auth in Supabase ausführen, damit die App funktioniert!

### Option A: Neues Schema (empfohlen für neue Projekte)

1. Gehe zu Supabase Dashboard → **SQL Editor**
2. Öffne die Datei `supabase/schema.sql`
3. Kopiere den gesamten Inhalt
4. Führe das SQL-Skript aus

**Hinweis:** Dieses Schema hat:
- `user_id` Spalten in `sets` und `sessions`
- Row Level Security (RLS) aktiviert
- Policies für User-Isolation

### Option B: Bestehendes Schema migrieren

Falls du bereits Daten im `schema-no-auth.sql` Schema hast:

1. **Backup erstellen:**
   ```sql
   -- Exportiere deine Daten (optional)
   SELECT * FROM sets;
   SELECT * FROM sessions;
   ```

2. **user_id Spalten hinzufügen:**
   ```sql
   -- Füge user_id Spalte hinzu (falls nicht vorhanden)
   ALTER TABLE sets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
   ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
   ```

3. **RLS aktivieren:**
   ```sql
   ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
   ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
   ```

4. **Policies erstellen:**
   ```sql
   -- Policies aus schema.sql kopieren und ausführen
   ```

## 🔐 Schritt 2: Supabase Auth konfigurieren

1. Gehe zu **Authentication** → **Providers** im Supabase Dashboard
2. **Email** Provider sollte aktiviert sein (Standard)
3. Optional: **Email Templates** anpassen

### Email-Konfiguration (optional)

- **Confirm email:** Aktiviert (empfohlen)
- **Secure email change:** Aktiviert (empfohlen)

## 🧪 Schritt 3: Testen

1. **App starten:**
   ```bash
   npm run dev
   ```

2. **Registrierung testen:**
   - Gehe zu `/auth`
   - Erstelle ein neues Konto
   - Prüfe deine E-Mail (Bestätigungslink)

3. **Login testen:**
   - Melde dich mit deinem Konto an
   - Du solltest zur Home-Seite weitergeleitet werden

4. **Daten-Speicherung testen:**
   - Starte ein Workout
   - Speichere Sets
   - Prüfe in Supabase → Table Editor → `sets`
   - Die `user_id` sollte deine User-ID enthalten

## 🔄 Schritt 4: Bestehende Daten migrieren (optional)

Falls du bereits anonyme Daten hast und sie einem User zuordnen möchtest:

```sql
-- Setze user_id für alle bestehenden Sets (ersetze USER_ID mit deiner tatsächlichen User-ID)
UPDATE sets 
SET user_id = 'deine-user-id-hier' 
WHERE user_id IS NULL;

-- Setze user_id für alle bestehenden Sessions
UPDATE sessions 
SET user_id = 'deine-user-id-hier' 
WHERE user_id IS NULL;
```

**⚠️ WICHTIG:** Dies sollte nur einmalig gemacht werden. Danach werden alle neuen Daten automatisch mit `user_id` gespeichert.

## 🎨 UI-Features

### Login/Register
- Moderne, mobile-optimierte UI
- Passwort-Validierung
- Fehlerbehandlung
- Success-Messages

### Protected Routes
- Automatische Weiterleitung zu `/auth` wenn nicht eingeloggt
- Loading-State während Auth-Initialisierung
- Alle Routen sind geschützt (nur bei Supabase-Modus)

### User-Info
- Zeigt User-Email im Header
- Avatar mit Initialen
- Logout-Button

## 🔧 Technische Details

### Auth-Flow

```
1. App-Start
   ↓
2. Auth-Store initialisiert
   ↓
3. Prüft bestehende Session
   ↓
4. Wenn Session → User eingeloggt
   ↓
5. Wenn keine Session → Weiterleitung zu /auth
   ↓
6. Nach Login → Session gespeichert
   ↓
7. Workout-Store lädt Daten für diesen User
```

### User-ID in Queries

Alle Supabase-Queries filtern jetzt nach `user_id`:
- `loadHistory()` - Nur eigene Sets
- `loadSessions()` - Nur eigene Sessions
- `logSet()` - Speichert mit `user_id`
- `deleteSet()` - Löscht nur eigene Sets
- `finishWorkout()` - Speichert mit `user_id`

## ⚠️ Wichtige Hinweise

1. **RLS muss aktiviert sein:** Ohne RLS können User auf fremde Daten zugreifen
2. **Email-Bestätigung:** Standardmäßig muss Email bestätigt werden
3. **Passwort-Anforderungen:** Mindestens 6 Zeichen (kann in Supabase angepasst werden)
4. **Session-Persistenz:** Sessions bleiben erhalten nach Browser-Neustart

## 🐛 Troubleshooting

### "Row Level Security policy violation"
- **Problem:** RLS ist aktiviert, aber Policies fehlen
- **Lösung:** Führe die Policies aus `schema.sql` aus

### "Email not confirmed"
- **Problem:** Email wurde noch nicht bestätigt
- **Lösung:** Prüfe deine E-Mail und klicke auf Bestätigungslink

### "Invalid login credentials"
- **Problem:** Falsche Email/Passwort
- **Lösung:** Prüfe deine Eingaben oder erstelle neues Konto

### Daten werden nicht gespeichert
- **Problem:** `user_id` fehlt in Queries
- **Lösung:** Stelle sicher, dass User eingeloggt ist und Schema korrekt ist

## ✅ Checkliste

- [ ] Schema mit Auth ausgeführt (`supabase/schema.sql`)
- [ ] RLS aktiviert
- [ ] Policies erstellt
- [ ] Email-Provider aktiviert
- [ ] Test-Registrierung erfolgreich
- [ ] Test-Login erfolgreich
- [ ] Daten werden mit `user_id` gespeichert
- [ ] Logout funktioniert

## 🎉 Fertig!

Deine App unterstützt jetzt Multi-User mit vollständiger Daten-Isolation. Jeder User sieht nur seine eigenen Workouts und Sets.
