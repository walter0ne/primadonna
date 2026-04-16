const express = require('express');
const { body, param } = require('express-validator');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { customerAuthMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  sendWelcomeEmail,
  sendPasswordReset,
  sendBookingModified,
} = require('../services/emailService');
const { timeToMinutes, minutesToTime } = require('../services/slotService');

const router = express.Router();
const prisma = new PrismaClient();

// ── POST /api/customer/register ───────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nome obbligatorio'),
    body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
    body('phone').trim().notEmpty().withMessage('Telefono obbligatorio'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password di almeno 8 caratteri')
      .matches(/[A-Z]/).withMessage('Password deve contenere almeno una maiuscola')
      .matches(/[0-9]/).withMessage('Password deve contenere almeno un numero'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, phone, password } = req.body;

      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Email già registrata' });

      const hashed = await bcrypt.hash(password, 12);
      const customer = await prisma.customer.create({
        data: { name, email, phone, password: hashed },
      });

      const token = jwt.sign(
        { id: customer.id, email: customer.email, name: customer.name, role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      sendWelcomeEmail(customer).catch(console.error);

      res.status(201).json({
        token,
        customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
      });
    } catch (err) { next(err); }
  }
);

// ── POST /api/customer/login ──────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) return res.status(401).json({ error: 'Credenziali non valide' });

      // Utente registrato solo con Google: non ha password
      if (!customer.password) {
        return res.status(401).json({ error: 'Questo account usa "Accedi con Google". Usa il pulsante Google per entrare.' });
      }

      const valid = await bcrypt.compare(password, customer.password);
      if (!valid) return res.status(401).json({ error: 'Credenziali non valide' });

      const token = jwt.sign(
        { id: customer.id, email: customer.email, name: customer.name, role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        token,
        customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
      });
    } catch (err) { next(err); }
  }
);

// ── POST /api/customer/auth/google ────────────────────────────────────────────
router.post(
  '/auth/google',
  [body('credential').notEmpty().withMessage('Credenziale Google mancante')],
  validate,
  async (req, res, next) => {
    try {
      const { credential } = req.body;

      // Verifica il token con Google (tokeninfo endpoint — zero dipendenze)
      const googleRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`
      );
      if (!googleRes.ok) {
        return res.status(401).json({ error: 'Token Google non valido' });
      }
      const payload = await googleRes.json();

      // Verifica audience (client ID)
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (clientId && payload.aud !== clientId) {
        return res.status(401).json({ error: 'Token Google non valido' });
      }
      if (!payload.email_verified) {
        return res.status(401).json({ error: 'Email Google non verificata' });
      }

      const { sub: googleId, email, name } = payload;

      // Cerca per googleId o email
      let customer = await prisma.customer.findFirst({
        where: { OR: [{ googleId }, { email }] },
      });

      if (customer) {
        // Collega googleId se mancante (utente esistente che usa Google per la prima volta)
        if (!customer.googleId) {
          customer = await prisma.customer.update({
            where: { id: customer.id },
            data: { googleId },
          });
        }
      } else {
        // Nuovo utente: crea account
        customer = await prisma.customer.create({
          data: { googleId, email, name, phone: null, password: null },
        });
        // Email benvenuto non-blocking
        sendWelcomeEmail(customer).catch(console.error);
      }

      const token = jwt.sign(
        { id: customer.id, email: customer.email, name: customer.name, role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        token,
        customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
      });
    } catch (err) { next(err); }
  }
);

// ── POST /api/customer/forgot-password ───────────────────────────────────────
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('Email non valida')],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;

      // Risposta sempre uguale per non rivelare se l'email esiste
      const customer = await prisma.customer.findUnique({ where: { email } });
      if (customer) {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const expiry   = new Date(Date.now() + 60 * 60 * 1000); // 1 ora

        await prisma.customer.update({
          where: { id: customer.id },
          data: { resetToken: rawToken, resetTokenExpiry: expiry },
        });

        const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
        const resetUrl  = `${clientUrl}/area-cliente/reset-password?token=${rawToken}`;

        sendPasswordReset(customer, resetUrl).catch(console.error);
      }

      res.json({ message: 'Se l\'email è registrata riceverai le istruzioni.' });
    } catch (err) { next(err); }
  }
);

// ── POST /api/customer/reset-password ────────────────────────────────────────
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token obbligatorio'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password di almeno 8 caratteri')
      .matches(/[A-Z]/).withMessage('Deve contenere almeno una maiuscola')
      .matches(/[0-9]/).withMessage('Deve contenere almeno un numero'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { token, password } = req.body;

      const customer = await prisma.customer.findFirst({
        where: {
          resetToken:       token,
          resetTokenExpiry: { gt: new Date() },
        },
      });

      if (!customer) {
        return res.status(400).json({ error: 'Link non valido o scaduto. Richiedine uno nuovo.' });
      }

      const hashed = await bcrypt.hash(password, 12);
      await prisma.customer.update({
        where: { id: customer.id },
        data: { password: hashed, resetToken: null, resetTokenExpiry: null },
      });

      res.json({ message: 'Password aggiornata con successo.' });
    } catch (err) { next(err); }
  }
);

// ── GET /api/customer/me ──────────────────────────────────────────────────────
router.get('/me', customerAuthMiddleware, async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.id },
      select: { id: true, email: true, name: true, phone: true, createdAt: true },
    });
    if (!customer) return res.status(404).json({ error: 'Cliente non trovato' });
    res.json({ customer });
  } catch (err) { next(err); }
});

// ── GET /api/customer/appointments ───────────────────────────────────────────
router.get('/appointments', customerAuthMiddleware, async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [
          { customerId: req.customer.id },
          { customerEmail: req.customer.email },
        ],
        status: { not: 'CANCELLED' },
      },
      include: {
        service: { select: { name: true, duration: true, price: true } },
      },
      orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
    });

    res.json(appointments);
  } catch (err) { next(err); }
});

// ── PUT /api/customer/appointments/:id ───────────────────────────────────────
// Modifica data/orario/note — solo fino al giorno prima
router.put(
  '/appointments/:id',
  customerAuthMiddleware,
  [
    param('id').notEmpty(),
    body('date').notEmpty().withMessage('Data obbligatoria'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Orario non valido'),
    body('notes').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date, startTime, notes } = req.body;

      // Verifica che l'appuntamento appartenga al cliente
      const appointment = await prisma.appointment.findFirst({
        where: {
          id,
          OR: [
            { customerId: req.customer.id },
            { customerEmail: req.customer.email },
          ],
        },
        include: { service: true },
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      // Solo CONFIRMED è modificabile
      if (appointment.status !== 'CONFIRMED') {
        return res.status(400).json({ error: 'Solo le prenotazioni confermate possono essere modificate' });
      }

      // Controllo: deve essere almeno il giorno prima
      const today     = new Date().toISOString().split('T')[0];
      const apptDate  = new Date(appointment.date).toISOString().split('T')[0];
      if (apptDate <= today) {
        return res.status(400).json({ error: 'Non è più possibile modificare questa prenotazione' });
      }

      // Calcola nuovo endTime
      const startMin = timeToMinutes(startTime);
      const endMin   = startMin + appointment.service.duration;
      const endTime  = minutesToTime(endMin);

      // Controlla conflitti sul nuovo slot (esclude l'appuntamento corrente)
      const newDate = new Date(date);
      const conflict = await prisma.appointment.findFirst({
        where: {
          id:     { not: id },
          date:   newDate,
          status: { not: 'CANCELLED' },
          OR: [
            { startTime: { gte: startTime, lt: endTime } },
            { endTime:   { gt: startTime, lte: endTime } },
            { AND: [{ startTime: { lte: startTime } }, { endTime: { gte: endTime } }] },
          ],
        },
      });

      if (conflict) {
        return res.status(409).json({ error: 'Orario non disponibile. Scegli un altro slot.' });
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          date:      newDate,
          startTime,
          endTime,
          notes:     notes ?? appointment.notes,
        },
        include: { service: true },
      });

      // Email di notifica modifica (non-blocking)
      sendBookingModified(updated, updated.service).catch(console.error);

      res.json(updated);
    } catch (err) { next(err); }
  }
);

module.exports = router;
