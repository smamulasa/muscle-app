# Storage-Varianten Dokumentation

Diese App unterstützt zwei verschiedene Storage-Varianten, die über eine Environment-Variable gesteuert werden.

## 🏗️ Architektur

```
src/store/
├── useWorkoutStore.js          # Factory - lädt automatisch die richtige Variante
├── useWorkoutStore.local.js    # LocalStorage-Version (aktuell produktiv)
└── useWorkoutStore.supabase.js # Supabase-Version (in Entwicklung)
```

## 💾 Variante 1: LocalStorage (Standard)

**Datei:** `src/store/useWorkoutStore.local.js`

**Eigenschaften:**
- ✅ Vollständig offline-fähig
- ✅ Keine Server-Kommunikation
- ✅ Schnell und einfach
- ❌ Nur lokal auf einem Gerät
- ❌ Keine Multi-User-Unterstützung
- ❌ Daten gehen bei Browser-Cache-Löschung verloren

**Aktivierung:**
```bash
# In .env.local
VITE_STORAGE_TYPE=local
```

**LocalStorage Key:** `muscle-app-storage-local`

---

## ☁️ Variante 2: Supabase (In Entwicklung)

**Datei:** `src/store/useWorkoutStore.supabase.js`

**Eigenschaften:**
- ✅ Cloud-Sync zwischen Geräten
- ✅ Multi-User-Unterstützung
- ✅ Real-time Updates
- ✅ Daten-Persistenz
- ❌ Internet-Verbindung erforderlich
- ❌ Backend-Setup nötig

**Aktivierung:**
```bash
# In .env.local
VITE_STORAGE_TYPE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Status:** ✅ Implementiert - bereit für Testing

**Features:**
- ✅ Vollständige CRUD-Operationen (Create, Read, Update, Delete)
- ✅ Automatische Initialisierung beim App-Start
- ✅ Unterstützt Auth und anonyme Nutzung
- ✅ Upsert-Logik (verhindert Duplikate)
- ✅ Automatische Daten-Synchronisation

---

## 🔄 Umschalten zwischen Varianten

1. **Environment-Variable setzen:**
   ```bash
   # Kopiere .env.example zu .env.local
   cp .env.example .env.local
   
   # Bearbeite .env.local und setze VITE_STORAGE_TYPE
   ```

2. **App neu starten:**
   ```bash
   npm run dev
   ```

3. **Kontrolliere die Console:**
   - `💾 Verwende LocalStorage Store` → LocalStorage aktiv
   - `📦 Verwende Supabase Store` → Supabase aktiv

---

## 📝 Entwicklung

### LocalStorage-Variante erweitern
- Bearbeite `src/store/useWorkoutStore.local.js`
- Änderungen sind sofort aktiv (nach Neustart)

### Supabase-Variante entwickeln
- Bearbeite `src/store/useWorkoutStore.supabase.js`
- Stelle sicher, dass beide Varianten das gleiche Interface haben:
  - `history` (State)
  - `sessions` (State)
  - `logSet(exerciseId, setIndex, weight, reps)`
  - `finishWorkout(workoutId, title, duration, date)`
  - `deleteSet(exerciseId, setIndex)`

### Beide Varianten testen
```bash
# Terminal 1: LocalStorage-Variante
VITE_STORAGE_TYPE=local npm run dev

# Terminal 2: Supabase-Variante (in anderem Port)
VITE_STORAGE_TYPE=supabase npm run dev -- --port 5174
```

---

## ⚠️ Wichtige Hinweise

1. **Daten-Migration:** Beim Wechsel zwischen Varianten werden Daten NICHT automatisch migriert
2. **Gleiches Interface:** Beide Varianten müssen das gleiche Interface implementieren
3. **Environment-Variablen:** `.env.local` ist in `.gitignore` und wird nicht committed
4. **Fallback:** Wenn Supabase gewählt, aber Konfiguration fehlt → automatischer Fallback auf LocalStorage

---

## 🚀 Nächste Schritte für Supabase-Implementierung

1. ✅ Store-Struktur erstellt
2. ⏳ Supabase Client installieren: `npm install @supabase/supabase-js`
3. ⏳ Datenbank-Schema erstellen
4. ⏳ API-Methoden implementieren
5. ⏳ Offline-Sync implementieren
6. ⏳ Migration-Script für LocalStorage → Supabase
