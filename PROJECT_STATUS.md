# Muscle App - Projekt Status

**Stand:** Dezember 2024  
**Ziel:** Professioneller, mobil-optimierter Workout Tracker

---

## ✅ Implementierte Features

### Basis-Features
- ✅ Timer für Workouts (funktioniert auch im Standby)
- ✅ Sets speichern (Gewicht + Reps)
- ✅ Workout-Routen und Navigation
- ✅ Sätze hinzufügen/löschen während Workout
- ✅ Numerische Tastatur auf iOS (inputMode)

### PWA & Offline
- ✅ PWA vollständig implementiert (installierbar)
- ✅ Service Worker mit Offline-Caching
- ✅ Offline-Sync mit Queue-System
- ✅ Automatische Synchronisation beim Reconnect

### Daten-Speicherung
- ✅ LocalStorage-Version (Standard)
- ✅ Supabase-Version (Cloud-Sync)
- ✅ Feature-Flag System (VITE_STORAGE_TYPE)
- ✅ Beide Varianten parallel verfügbar

### Supabase-Integration
- ✅ Vollständige CRUD-Operationen
- ✅ Automatische Initialisierung
- ✅ Offline-Queue für Änderungen
- ✅ Sync-Status UI-Komponente
- ✅ Unterstützt Auth und anonyme Nutzung

### User-Authentifizierung
- ✅ Login/Register UI
- ✅ Auth-Store (useAuthStore.js)
- ✅ Protected Routes
- ✅ Session-Management
- ✅ Logout-Funktionalität
- ✅ Daten-Isolation zwischen Usern

### UI & UX
- ✅ Workout-Session Detailansicht
- ✅ Fortschritts-Charts (Recharts)
- ✅ Rekord-Badges
- ✅ Vergleichs-Features (Vergleich zum letzten Mal)
- ✅ Mini-Charts (Sparklines) in StatsView
- ✅ Konsistente Navigation (BottomNav)

---

## 🏗️ Architektur

### Store-System
```
src/store/
├── useWorkoutStore.js          # Factory - lädt richtige Variante
├── useWorkoutStore.local.js    # LocalStorage-Version
├── useWorkoutStore.supabase.js # Supabase-Version (mit Offline-Sync)
└── useAuthStore.js             # Auth-Management
```

### Routing
- `/` - HomeView (Workout-Übersicht)
- `/workout/:id` - WorkoutView (aktives Workout)
- `/stats` - StatsView (Fortschritt)
- `/stats/exercise/:id` - ExerciseDetailView (Übungs-Details)
- `/workout-session/:workoutId/:date` - WorkoutSessionDetailView
- `/auth` - AuthView (Login/Register) - nur bei Supabase

### Datenstruktur
```javascript
history: {
  'exercise_id': {
    '2025-12-10': [
      { weight: 80, reps: 10, completed: true },
      { weight: 85, reps: 8, completed: true }
    ]
  }
}

sessions: [
  { id: 'workout_id', title: '...', duration: 3600, date: '2025-12-10' }
]
```

---

## 🔧 Wichtige Konfiguration

### Environment-Variablen (.env.local)
```bash
VITE_STORAGE_TYPE=supabase  # oder 'local'
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Supabase-Schema
- `supabase/schema.sql` - Mit Auth (RLS aktiviert)
- `supabase/schema-no-auth.sql` - Ohne Auth (für Testing)

---

## 📋 Nächste mögliche Features

### Priorität Hoch
- [ ] Sets nachträglich bearbeiten
- [ ] 1RM-Schätzung anzeigen
- [ ] Notizen zu Workout-Sessions

### Priorität Mittel
- [ ] Teilen-Funktion für Workouts
- [ ] Realtime Subscriptions (Multi-Device-Sync)
- [ ] Push-Benachrichtigungen

### Priorität Niedrig
- [ ] Export/Import Funktion
- [ ] Daten-Migration Script
- [ ] Erweiterte Statistiken

---

## 📚 Dokumentation

- `STORAGE_VERSIONS.md` - Storage-Varianten Dokumentation
- `SUPABASE_SETUP.md` - Supabase Setup-Anleitung
- `OFFLINE_SYNC.md` - Offline-Sync Dokumentation
- `AUTH_SETUP.md` - Auth-Setup Anleitung

---

## 🚀 Deployment

- **Vercel:** Production-Deployment aktiv
- **Environment-Variablen:** In Vercel gesetzt
- **Status:** Funktionsfähig

---

## ⚠️ Wichtige Hinweise

1. **Schema-Auswahl:**
   - Für Auth: `supabase/schema.sql` verwenden
   - Für Testing: `supabase/schema-no-auth.sql` verwenden

2. **Protected Routes:**
   - Nur aktiv bei `VITE_STORAGE_TYPE=supabase`
   - LocalStorage-Modus bleibt öffentlich

3. **Offline-Sync:**
   - Queue wird in LocalStorage gespeichert
   - Automatische Sync beim Reconnect
   - Maximal 3 Retry-Versuche pro Item

4. **User-Authentifizierung:**
   - Email-Bestätigung standardmäßig aktiviert
   - RLS muss aktiviert sein für Daten-Isolation
   - Session bleibt nach Browser-Neustart erhalten

---

## 📝 Wichtige Dateien

### Views
- `src/views/HomeView.jsx` - Startseite
- `src/views/WorkoutView.jsx` - Aktives Workout
- `src/views/StatsView.jsx` - Fortschritts-Übersicht
- `src/views/ExerciseDetailView.jsx` - Übungs-Details
- `src/views/WorkoutSessionDetailView.jsx` - Session-Details
- `src/views/AuthView.jsx` - Login/Register

### Components
- `src/components/ExerciseCard.jsx` - Übungskarte mit Sets
- `src/components/BottomNav.jsx` - Navigation
- `src/components/SyncStatus.jsx` - Sync-Status Badge
- `src/components/LoginForm.jsx` - Login-Formular
- `src/components/RegisterForm.jsx` - Register-Formular
- `src/components/ProtectedRoute.jsx` - Route-Schutz

### Store
- `src/store/useWorkoutStore.js` - Factory
- `src/store/useWorkoutStore.local.js` - LocalStorage
- `src/store/useWorkoutStore.supabase.js` - Supabase + Offline-Sync
- `src/store/useAuthStore.js` - Authentifizierung

---

**Letzte große Updates:**
- Supabase-Integration (Dezember 2024)
- Offline-Sync System (Dezember 2024)
- User-Authentifizierung (Dezember 2024)
