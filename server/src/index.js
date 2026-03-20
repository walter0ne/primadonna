require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const availabilityRoutes = require('./routes/availability');
const appointmentsRoutes = require('./routes/appointments');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Rate limiting sulle API pubbliche
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100,
  message: { error: 'Troppe richieste, riprova tra poco.' },
});
app.use('/api/availability', publicLimiter);

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ora
  max: 10,
  message: { error: 'Troppi tentativi di prenotazione, riprova tra un\'ora.' },
});
app.use('/api/appointments', (req, res, next) => {
  if (req.method === 'POST') return bookingLimiter(req, res, next);
  next();
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentsRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Endpoint non trovato' }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Primadonna API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
