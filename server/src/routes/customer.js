const express = require('express');
const { body } = require('express-validator');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { customerAuthMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendWelcomeEmail } = require('../services/emailService');

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
      if (existing) {
        return res.status(409).json({ error: 'Email già registrata' });
      }

      const hashed = await bcrypt.hash(password, 12);
      const customer = await prisma.customer.create({
        data: { name, email, phone, password: hashed },
      });

      const token = jwt.sign(
        { id: customer.id, email: customer.email, name: customer.name, role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Email di benvenuto (non-blocking)
      sendWelcomeEmail(customer).catch(console.error);

      res.status(201).json({
        token,
        customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
      });
    } catch (err) {
      next(err);
    }
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
      if (!customer) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      const valid = await bcrypt.compare(password, customer.password);
      if (!valid) {
        return res.status(401).json({ error: 'Credenziali non valide' });
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
    } catch (err) {
      next(err);
    }
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
  } catch (err) {
    next(err);
  }
});

// ── GET /api/customer/appointments ───────────────────────────────────────────
// Restituisce tutte le prenotazioni del cliente autenticato
// Cerca sia per customerId (se loggato al momento della prenotazione)
// sia per customerEmail (per prenotazioni fatte senza account)
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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
