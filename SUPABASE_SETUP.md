# Supabase Setup-Anleitung

Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung von Supabase für die Muscle App.

## 📋 Voraussetzungen

- Supabase Account (kostenlos auf [supabase.com](https://supabase.com))
- Node.js und npm installiert

## 🚀 Schritt 1: Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle einen Account
2. Klicke auf "New Project"
3. Wähle einen Namen für dein Projekt (z.B. "muscle-app")
4. Wähle ein Passwort für die Datenbank
5. Wähle eine Region (am besten nahe zu dir)
6. Klicke auf "Create new project"
7. Warte ca. 2 Minuten, bis das Projekt erstellt ist

## 🗄️ Schritt 2: Datenbank-Schema erstellen

1. Öffne dein Supabase-Projekt im Dashboard
2. Gehe zu **SQL Editor** (im linken Menü)
3. Klicke auf **New Query**
4. Öffne die Datei `supabase/schema.sql` aus diesem Projekt
5. Kopiere den gesamten Inhalt
6. Füge ihn in den SQL Editor ein
7. Klicke auf **Run** (oder drücke Cmd/Ctrl + Enter)

✅ Du solltest "Success. No rows returned" sehen.

## 🔑 Schritt 3: API-Keys kopieren

1. Gehe zu **Settings** (Zahnrad-Icon) → **API**
2. Kopiere folgende Werte:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon/public key** (lange Zeichenkette)

## ⚙️ Schritt 4: Environment-Variablen setzen

1. Erstelle eine Datei `.env.local` im Projekt-Root (falls nicht vorhanden)
2. Füge folgende Zeilen ein:

```bash
VITE_STORAGE_TYPE=supabase
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key-hier
```

**Wichtig:** Ersetze die Platzhalter mit deinen echten Werten!

## 🧪 Schritt 5: Testen

1. Starte die App neu:
   ```bash
   npm run dev
   ```

2. Öffne die Browser-Console (F12)
3. Du solltest sehen: `📦 Verwende Supabase Store`

4. Teste die App:
   - Starte ein Workout
   - Speichere einen Satz
   - Prüfe in Supabase Dashboard → **Table Editor** → **sets**, ob der Eintrag erscheint

## 🔒 Schritt 6: Row Level Security (RLS) - Optional

Das Schema enthält bereits RLS-Policies für User-Authentifizierung. 

**Falls du OHNE Auth starten willst** (für schnelles Testen):

1. Gehe zu **Authentication** → **Policies**
2. Für die Tabellen `sets` und `sessions`:
   - Deaktiviere RLS temporär ODER
   - Erstelle eine Policy, die anonyme Zugriffe erlaubt:

```sql
-- Policy für anonyme Zugriffe (NUR FÜR TESTING!)
CREATE POLICY "Allow anonymous access"
  ON sets FOR ALL
  USING (true)
  WITH CHECK (true);
```

**⚠️ WARNUNG:** Dies ist nur für Entwicklung/Testing! Für Produktion immer Auth aktivieren!

## 🐛 Troubleshooting

### Fehler: "VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen gesetzt sein"
- Prüfe, ob `.env.local` existiert und korrekt benannt ist
- Stelle sicher, dass die Variablen mit `VITE_` beginnen
- Starte die App neu nach Änderungen

### Fehler: "relation 'sets' does not exist"
- Das Schema wurde nicht ausgeführt
- Gehe zurück zu Schritt 2 und führe das Schema aus

### Fehler: "new row violates row-level security policy"
- RLS ist aktiviert, aber keine Auth
- Siehe Schritt 6 für Lösung

### Daten werden nicht gespeichert
- Prüfe die Browser-Console auf Fehler
- Prüfe in Supabase Dashboard → **Logs** → **API Logs**
- Stelle sicher, dass die Tabellen existieren

## 📊 Daten prüfen

1. Gehe zu **Table Editor** im Supabase Dashboard
2. Wähle die Tabelle `sets` oder `sessions`
3. Du solltest deine gespeicherten Daten sehen

## 🔄 Zurück zu LocalStorage

Falls du zurück zu LocalStorage wechseln willst:

1. Ändere in `.env.local`:
   ```bash
   VITE_STORAGE_TYPE=local
   ```

2. Oder entferne die Variable komplett (Standard ist `local`)

3. Starte die App neu

## ✅ Checkliste

- [ ] Supabase-Projekt erstellt
- [ ] Schema ausgeführt (`supabase/schema.sql`)
- [ ] API-Keys kopiert
- [ ] `.env.local` erstellt und konfiguriert
- [ ] App getestet
- [ ] Daten werden in Supabase gespeichert

## 🎉 Fertig!

Deine App nutzt jetzt Supabase als Backend. Alle Daten werden in der Cloud gespeichert und können zwischen Geräten synchronisiert werden.

## 📚 Nächste Schritte

- **Auth hinzufügen:** Für Multi-User-Support
- **Real-time Updates:** Für Live-Sync zwischen Geräten
- **Offline-Sync:** Queue für Offline-Änderungen
