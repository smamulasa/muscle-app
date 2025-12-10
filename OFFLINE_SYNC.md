# Offline-Sync Dokumentation

Das Offline-Sync Feature ermöglicht es, Änderungen auch ohne Internet-Verbindung zu speichern und automatisch zu synchronisieren, sobald wieder eine Verbindung besteht.

## 🎯 Funktionsweise

### Online-Modus
- Änderungen werden **sofort** in Supabase gespeichert
- Lokaler State wird **optimistisch** aktualisiert (sofort sichtbar)
- Bei Fehlern: Automatischer Fallback zur Queue

### Offline-Modus
- Änderungen werden in eine **Queue** (LocalStorage) gespeichert
- Lokaler State wird **optimistisch** aktualisiert (sofort sichtbar)
- Queue wird automatisch synchronisiert, sobald wieder online

## 📋 Queue-System

### Gespeicherte Aktionen
- `logSet` - Satz speichern
- `deleteSet` - Satz löschen
- `finishWorkout` - Workout abschließen

### Queue-Verwaltung
- **Speicherort:** LocalStorage (`muscle-app-sync-queue`)
- **Duplikat-Vermeidung:** Alte Items mit gleicher Aktion werden entfernt
- **Retry-Logik:** Maximal 3 Versuche pro Item
- **Automatische Bereinigung:** Erfolgreich synchronisierte Items werden entfernt

## 🔄 Synchronisation

### Automatisch
- Beim App-Start (falls online)
- Beim Wechsel von Offline → Online
- Alle 2 Sekunden wird Queue-Länge aktualisiert

### Manuell
- Klick auf Sync-Status Badge (wenn ausstehende Items vorhanden)

## 🎨 UI-Komponente

Die `SyncStatus` Komponente zeigt:
- **Online/Offline Status** (Wifi/WifiOff Icon)
- **Sync-Status** (idle, syncing, synced, error)
- **Anzahl ausstehender Items** (Badge mit Zahl)
- **Klickbar** zum manuellen Sync (wenn Items vorhanden)

### Status-Farben
- 🟢 **Grün** - Synchronisiert
- 🟡 **Gelb** - Synchronisiert gerade...
- 🔴 **Rot** - Fehler
- ⚫ **Grau** - Offline

## 🔧 Technische Details

### Optimistic Updates
Alle Änderungen werden **sofort** im lokalen State aktualisiert, unabhängig vom Online-Status. Das sorgt für eine flüssige User-Experience.

### Queue-Struktur
```javascript
{
  id: "unique-id",
  action: "logSet" | "deleteSet" | "finishWorkout",
  data: { ... },
  timestamp: "2025-12-10T22:00:00.000Z",
  retries: 0
}
```

### Event-Listener
- `window.addEventListener('online', ...)` - Startet Auto-Sync
- `window.addEventListener('offline', ...)` - Aktualisiert Status

## 🧪 Testing

### Offline-Modus testen
1. Öffne Chrome DevTools → Network Tab
2. Wähle "Offline" aus dem Dropdown
3. Führe Aktionen aus (Sets speichern, etc.)
4. Prüfe Queue in LocalStorage: `muscle-app-sync-queue`
5. Wechsle zurück zu "Online"
6. Queue sollte automatisch synchronisiert werden

### Queue prüfen
```javascript
// In Browser Console
JSON.parse(localStorage.getItem('muscle-app-sync-queue'))
```

## ⚠️ Wichtige Hinweise

1. **Queue-Größe:** Die Queue ist unbegrenzt, sollte aber regelmäßig geleert werden
2. **Konflikte:** Duplikate werden automatisch entfernt (neueste Version gewinnt)
3. **Fehlerbehandlung:** Items mit 3+ Fehlern werden aus der Queue entfernt
4. **Performance:** Queue wird sequenziell verarbeitet (ein Item nach dem anderen)

## 🚀 Nächste Schritte (Optional)

- [ ] Queue-Größe begrenzen (z.B. max 100 Items)
- [ ] Priorisierung von Items (wichtige zuerst)
- [ ] Batch-Sync (mehrere Items gleichzeitig)
- [ ] Konflikt-Resolution UI (wenn Server-Version neuer ist)
- [ ] Queue-Export/Import für Backup
