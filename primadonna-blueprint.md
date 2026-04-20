# Primadonna — Sistema Prenotazioni Parrucchiere

## Blueprint Completo per Claude Code

> **Istruzioni:** Dai questo file a Claude Code con il comando:
> `claude "Leggi il file primadonna-blueprint.md e costruisci l'intero progetto step by step"`

---

## 1. Stack Tecnologico

| Layer | Tecnologia | Note |
|-------|-----------|------|
| **Frontend** | Vue 3 + Vite + Vue Router + Pinia | Composition API, TypeScript opzionale |
| **UI** | Tailwind CSS | Design moderno e responsive |
| **Backend** | Express.js (Node.js) | REST API |
| **Database** | PostgreSQL | Hosting gratuito su Neon.tech |
| **ORM** | Prisma | Type-safe, migrazioni automatiche |
| **Auth** | JWT + bcrypt | Autenticazione admin |
| **Email** | Resend (free tier: 100 email/giorno) | Conferme appuntamenti |
| **Deploy Frontend** | Vercel (gratis) | Build automatica da GitHub |
| **Deploy Backend** | Render.com (gratis) | Free tier con auto-sleep |
| **Deploy DB** | Neon.tech (gratis) | PostgreSQL serverless, free tier generoso |

---

## 2. Struttura Cartelle

```
primadonna/
├── client/                     # Frontend Vue 3
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppHeader.vue
│   │   │   │   ├── AppFooter.vue
│   │   │   │   └── AppSidebar.vue
│   │   │   ├── booking/
│   │   │   │   ├── ServiceSelector.vue
│   │   │   │   ├── DatePicker.vue
│   │   │   │   ├── TimeSlotGrid.vue
│   │   │   │   ├── BookingForm.vue
│   │   │   │   └── BookingConfirmation.vue
│   │   │   └── admin/
│   │   │       ├── AppointmentList.vue
│   │   │       ├── AppointmentCard.vue
│   │   │       ├── ServiceManager.vue
│   │   │       ├── StatsOverview.vue
│   │   │       └── CalendarView.vue
│   │   ├── views/
│   │   │   ├── HomeView.vue           # Landing page pubblica
│   │   │   ├── BookingView.vue        # Flusso prenotazione (3 step)
│   │   │   ├── BookingSuccessView.vue # Conferma prenotazione
│   │   │   ├── AdminLoginView.vue     # Login admin
│   │   │   ├── AdminDashboard.vue     # Dashboard principale
│   │   │   ├── AdminAppointments.vue  # Gestione appuntamenti
│   │   │   └── AdminServices.vue      # Gestione servizi
│   │   ├── stores/
│   │   │   ├── booking.js             # Store prenotazione
│   │   │   └── auth.js                # Store autenticazione
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── composables/
│   │   │   ├── useApi.js              # Fetch wrapper
│   │   │   └── useToast.js            # Notifiche UI
│   │   ├── utils/
│   │   │   └── formatters.js          # Date, orari, prezzi
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                     # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js             # Dati iniziali (servizi, admin)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js         # POST /api/auth/login
│   │   │   ├── services.js     # CRUD /api/services
│   │   │   ├── appointments.js # CRUD /api/appointments
│   │   │   └── availability.js # GET /api/availability/:date
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification
│   │   │   ├── validate.js     # Request validation
│   │   │   └── errorHandler.js # Error handling globale
│   │   ├── services/
│   │   │   ├── emailService.js # Invio email con Resend
│   │   │   └── slotService.js  # Calcolo slot disponibili
│   │   ├── utils/
│   │   │   └── constants.js    # Orari apertura, config
│   │   └── index.js            # Entry point Express
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 3. Schema Database (Prisma)

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  createdAt DateTime @default(now())
}

model Service {
  id           String        @id @default(cuid())
  name         String        // es: "Taglio Donna", "Colore", "Piega"
  description  String?
  duration     Int           // durata in minuti (30, 60, 90...)
  price        Decimal       @db.Decimal(10, 2)
  isActive     Boolean       @default(true)
  sortOrder    Int           @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  appointments Appointment[]
}

model Appointment {
  id            String            @id @default(cuid())
  customerName  String
  customerPhone String
  customerEmail String
  date          DateTime          @db.Date
  startTime     String            // "09:00", "09:30", etc.
  endTime       String            // calcolato da startTime + service.duration
  notes         String?
  status        AppointmentStatus @default(CONFIRMED)
  service       Service           @relation(fields: [serviceId], references: [id])
  serviceId     String
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@index([date, startTime])
  @@index([status])
  @@index([customerEmail])
}

enum AppointmentStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

---

## 4. API Endpoints

### Auth
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login admin (email + password) → JWT | No |
| GET | `/api/auth/me` | Info admin corrente | Sì |

### Servizi
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | `/api/services` | Lista servizi attivi (pubblico) | No |
| GET | `/api/services/all` | Lista tutti i servizi (inclusi inattivi) | Sì |
| POST | `/api/services` | Crea servizio | Sì |
| PUT | `/api/services/:id` | Modifica servizio | Sì |
| DELETE | `/api/services/:id` | Soft-delete (isActive=false) | Sì |

### Disponibilità
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | `/api/availability/:date` | Slot liberi per una data (query: `?serviceId=xxx`) | No |

### Appuntamenti
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | `/api/appointments` | Crea prenotazione (pubblico) | No |
| GET | `/api/appointments` | Lista appuntamenti (query: `?date=`, `?status=`, `?from=`, `?to=`) | Sì |
| GET | `/api/appointments/:id` | Dettaglio appuntamento | Sì |
| PUT | `/api/appointments/:id/status` | Cambia stato (CONFIRMED→COMPLETED, etc.) | Sì |
| DELETE | `/api/appointments/:id` | Cancella appuntamento | Sì |

---

## 5. Logica Slot Disponibilità

```
Configurazione (in server/src/utils/constants.js):
- ORARI_APERTURA: { lun-ven: "09:00-19:00", sab: "09:00-17:00", dom: chiuso }
- SLOT_INTERVAL: 30 minuti (slot ogni 30 min)
- PAUSA_PRANZO: "13:00-14:00" (opzionale)
- BUFFER_MINUTI: 0 (tempo tra appuntamenti, opzionale)
- MIN_ADVANCE_HOURS: 2 (non si può prenotare meno di 2h prima)

Algoritmo GET /api/availability/:date?serviceId=xxx:
1. Prendi la durata del servizio selezionato
2. Genera tutti gli slot possibili per quel giorno (ogni 30 min)
3. Per ogni slot, controlla che:
   a. Lo slot + durata servizio non superi l'orario di chiusura
   b. Non si sovrapponga a un appuntamento esistente (CONFIRMED)
   c. Non cada nella pausa pranzo
   d. Sia almeno MIN_ADVANCE_HOURS nel futuro
4. Ritorna array di slot disponibili: ["09:00", "09:30", "10:00", ...]
```

---

## 6. Flusso Prenotazione (Frontend)

### Step 1: Scegli Servizio
- Griglia card con nome, descrizione, durata, prezzo
- Click su una card → seleziona e vai a Step 2

### Step 2: Scegli Data e Orario
- Calendario (date picker) — solo date future, no domenica
- Griglia orari disponibili (chiama API availability)
- Click su orario → seleziona e vai a Step 3

### Step 3: Dati Personali + Conferma
- Form: nome, telefono, email, note (opzionale)
- Riepilogo: servizio, data, ora, prezzo
- Bottone "Conferma Prenotazione"
- Al submit → POST /api/appointments → redirect a pagina conferma

### Pagina Conferma
- Messaggio di conferma con riepilogo
- "Riceverai una email di conferma"

---

## 7. Dashboard Admin

### Login (/admin/login)
- Form email + password
- JWT salvato in localStorage
- Redirect a dashboard

### Dashboard (/admin)
- **Stats in alto:** appuntamenti oggi, settimana, mese, ricavo stimato
- **Appuntamenti di oggi:** lista con orario, cliente, servizio, stato
- **Azioni rapide:** segna come completato, cancella, no-show

### Gestione Appuntamenti (/admin/appointments)
- Vista calendario (settimana) con appuntamenti come blocchi
- Filtri: per data range, stato, servizio
- Click su appuntamento → dettaglio + azioni

### Gestione Servizi (/admin/services)
- Tabella con nome, durata, prezzo, stato (attivo/inattivo)
- Modali per creare/modificare servizio
- Toggle attivo/inattivo
- Drag & drop per riordinare

---

## 8. Email di Conferma (Resend)

Template email da inviare al cliente dopo la prenotazione:

```
Oggetto: Prenotazione Confermata — Primadonna

Ciao {nome},

La tua prenotazione è confermata!

📋 Riepilogo:
- Servizio: {servizio}
- Data: {data} alle {ora}
- Durata: {durata} minuti
- Prezzo: €{prezzo}

📍 Primadonna
   [Indirizzo del salone]

Per cancellare o modificare, contattaci al [telefono].

A presto!
Il team Primadonna
```

---

## 9. Seed Data (Dati Iniziali)

```javascript
// server/prisma/seed.js — Dati di esempio da inserire al primo avvio

const admin = {
  email: "admin@primadonna.it",
  password: "Primadonna2024!", // verrà hashato con bcrypt
  name: "Admin Primadonna"
};

const services = [
  { name: "Taglio Donna",       duration: 45, price: 30.00, sortOrder: 1 },
  { name: "Taglio Uomo",        duration: 30, price: 20.00, sortOrder: 2 },
  { name: "Piega",              duration: 30, price: 25.00, sortOrder: 3 },
  { name: "Colore",             duration: 90, price: 55.00, sortOrder: 4 },
  { name: "Colpi di Sole",      duration: 120, price: 75.00, sortOrder: 5 },
  { name: "Trattamento Cheratina", duration: 60, price: 45.00, sortOrder: 6 },
  { name: "Taglio + Piega Donna", duration: 60, price: 45.00, sortOrder: 7 },
  { name: "Barba",              duration: 20, price: 12.00, sortOrder: 8 },
];
```

---

## 10. Variabili d'Ambiente

```env
# server/.env.example

# Database (Neon.tech)
DATABASE_URL="postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/primadonna?sslmode=require"

# JWT
JWT_SECRET="genera-una-stringa-random-lunga-almeno-32-caratteri"
JWT_EXPIRES_IN="7d"

# Resend (email)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="prenotazioni@primadonna.it"

# Server
PORT=3000
NODE_ENV=production

# Frontend URL (per CORS)
CLIENT_URL="https://primadonna.vercel.app"
```

```env
# client/.env.example
VITE_API_URL="https://primadonna-api.onrender.com/api"
```

---

## 11. Deploy (Tutto Gratuito)

### 11.1 Database — Neon.tech
1. Crea account su https://neon.tech
2. Crea progetto "primadonna" (region: eu-central-1)
3. Copia la connection string nel `.env` del server
4. Esegui `npx prisma migrate deploy` e `npx prisma db seed`

### 11.2 Backend — Render.com
1. Crea account su https://render.com
2. "New Web Service" → connetti repo GitHub
3. Root Directory: `server`
4. Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
5. Start Command: `node src/index.js`
6. Environment: Node
7. Instance Type: Free
8. Aggiungi tutte le env variables
9. Nota: il free tier va in sleep dopo 15 min di inattività (cold start ~30s)

### 11.3 Frontend — Vercel
1. Crea account su https://vercel.com
2. Import repo GitHub
3. Root Directory: `client`
4. Framework Preset: Vue / Vite
5. Aggiungi `VITE_API_URL` nelle env variables
6. Deploy automatico ad ogni push

---

## 12. Design & UX

### Palette Colori
- **Primario:** #C49B66 (oro caldo — elegante, parrucchiere)
- **Secondario:** #1A1A2E (blu scuro — professionale)
- **Accento:** #E8D5B7 (beige chiaro)
- **Background:** #FAFAF8 (bianco caldo)
- **Testo:** #2D2D2D (quasi nero)
- **Successo:** #4CAF50
- **Errore:** #E53935

### Font
- Titoli: `Playfair Display` (Google Fonts — elegante)
- Corpo: `Inter` (Google Fonts — leggibile)

### Mobile First
- Il sito DEVE funzionare perfettamente su mobile (80%+ del traffico)
- Breakpoints Tailwind: sm:640px, md:768px, lg:1024px
- Touch-friendly: bottoni minimo 44px, slot orari ben spaziati

---

## 13. Sicurezza

- Sanitizzare tutti gli input (express-validator)
- Rate limiting sulle API pubbliche (express-rate-limit)
- Helmet.js per headers di sicurezza
- CORS configurato solo per il dominio del frontend
- Password admin hashata con bcrypt (saltRounds: 12)
- JWT con scadenza e refresh
- Prepared statements (Prisma li usa di default)
- No dati sensibili nei log

---

## 14. Comandi per Claude Code

Segui questo ordine:

```bash
# 1. Crea la struttura del progetto
mkdir primadonna && cd primadonna

# 2. Inizializza il backend
mkdir server && cd server
npm init -y
npm install express prisma @prisma/client cors helmet express-rate-limit
npm install express-validator jsonwebtoken bcryptjs resend dotenv
npm install -D nodemon
npx prisma init

# 3. Copia lo schema Prisma da Sezione 3

# 4. Inizializza il frontend
cd .. && npm create vite@latest client -- --template vue
cd client
npm install vue-router@4 pinia @vueuse/core
npm install -D tailwindcss @tailwindcss/vite

# 5. Implementa in ordine:
#    a. Schema DB + migrazioni + seed
#    b. API routes backend (auth → services → availability → appointments)
#    c. Middleware (auth, validation, error handling)
#    d. Email service
#    e. Frontend: router + stores
#    f. Frontend: landing page + flusso prenotazione
#    g. Frontend: dashboard admin
#    h. Test manuale
#    i. Deploy
```

---

## 15. Note Importanti

1. **Neon.tech free tier:** 0.5 GB storage, 190 ore compute/mese — più che sufficiente
2. **Render.com free tier:** 750 ore/mese, auto-sleep dopo 15 min — il primo caricamento sarà lento
3. **Resend free tier:** 100 email/giorno, 1 dominio — perfetto per iniziare
4. **Vercel free tier:** 100 GB bandwidth, deploy illimitati — ottimo per il frontend
5. Per un dominio personalizzato (es. primadonna.it), puoi comprarlo separatamente (~10€/anno) e collegarlo a Vercel
6. Il calendario admin usa una vista settimanale semplice, non serve un componente pesante
7. Tutte le date/orari vanno gestite nel timezone "Europe/Rome"
