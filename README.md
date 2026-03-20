# Primadonna — Sistema Prenotazioni Parrucchiere

Sistema di prenotazione online per salone di bellezza. Stack: Vue 3 + Express + PostgreSQL (Prisma).

## Setup Locale

### 1. Backend

```bash
cd server
cp .env.example .env
# Compila il .env con DATABASE_URL, JWT_SECRET, RESEND_API_KEY
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev  # avvia su http://localhost:3000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev  # avvia su http://localhost:5173
```

## Credenziali Admin (seed)

- **Email:** admin@primadonna.it
- **Password:** Primadonna2024!

## API Endpoints

| Metodo | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/login` | No |
| GET | `/api/services` | No |
| GET | `/api/availability/:date?serviceId=` | No |
| POST | `/api/appointments` | No |
| GET | `/api/appointments` | Sì |
| PUT | `/api/appointments/:id/status` | Sì |
| GET | `/api/services/all` | Sì |
| POST | `/api/services` | Sì |
| PUT | `/api/services/:id` | Sì |

## Deploy

1. **Database:** Neon.tech — crea progetto e copia la connection string
2. **Backend:** Render.com — root `server`, build `npm install && npx prisma generate && npx prisma migrate deploy`
3. **Frontend:** Vercel — root `client`, aggiungi `VITE_API_URL`
