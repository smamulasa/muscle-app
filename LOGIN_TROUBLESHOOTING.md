# Login-Problem beheben

## Problem: Login funktioniert nicht nach Email-Bestätigung

### Schritt 1: Fehlermeldung prüfen

1. Versuche dich einzuloggen
2. Prüfe, ob eine rote Fehlermeldung angezeigt wird
3. Notiere dir die genaue Fehlermeldung

### Schritt 2: Browser-Console prüfen

1. Öffne die Browser-Console (F12 oder Rechtsklick → Untersuchen)
2. Gehe zum Tab "Console"
3. Versuche dich einzuloggen
4. Prüfe, ob Fehler angezeigt werden
5. Notiere dir die Fehlermeldungen

### Schritt 3: Email-Bestätigung deaktivieren (für Testing)

Falls die Email-Bestätigung Probleme verursacht:

1. Gehe zu Supabase Dashboard → **Authentication** → **Settings**
2. Unter **Email Auth**:
   - **Confirm email:** Deaktivieren
3. Versuche dich erneut einzuloggen

### Schritt 4: User-Status in Supabase prüfen

1. Gehe zu Supabase Dashboard → **Authentication** → **Users**
2. Finde deinen User (Email-Adresse)
3. Prüfe:
   - **Email confirmed:** Sollte `true` sein
   - **Last sign in:** Sollte ein Datum zeigen
   - **Status:** Sollte `ACTIVE` sein

### Schritt 5: Neues Passwort setzen (falls nötig)

Falls du das Passwort vergessen hast:

1. Gehe zu `/auth` in der App
2. Klicke auf "Passwort vergessen?" (falls vorhanden)
3. Oder erstelle ein neues Konto

### Schritt 6: Browser-Cache leeren

Manchmal hilft es, den Browser-Cache zu leeren:

1. Öffne die Browser-Entwicklertools (F12)
2. Rechtsklick auf den Reload-Button
3. Wähle "Leeren und hart neu laden"

### Häufige Fehlermeldungen

#### "Invalid login credentials"
- **Ursache:** Falsche Email oder Passwort
- **Lösung:** Prüfe deine Eingaben, stelle sicher, dass du dich registriert hast

#### "Email not confirmed"
- **Ursache:** Email wurde noch nicht bestätigt
- **Lösung:** Prüfe deine E-Mail und klicke auf den Bestätigungslink, oder deaktiviere Email-Bestätigung für Testing

#### "User not found"
- **Ursache:** User existiert nicht
- **Lösung:** Erstelle ein neues Konto

#### "Too many requests"
- **Ursache:** Zu viele Login-Versuche
- **Lösung:** Warte ein paar Minuten und versuche es erneut

## Was ich bereits behoben habe

✅ Navigation nach erfolgreichem Login hinzugefügt
✅ Fehlerbehandlung ist vorhanden
✅ Fehlermeldungen werden angezeigt

## Nächste Schritte

1. Prüfe die Browser-Console auf Fehler
2. Prüfe, ob eine Fehlermeldung in der App angezeigt wird
3. Teile mir die Fehlermeldung mit, dann kann ich dir gezielt helfen
