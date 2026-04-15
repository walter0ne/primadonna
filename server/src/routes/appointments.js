const express = require('express');
const { body, param, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { getAvailableSlots, timeToMinutes, minutesToTime } = require('../services/slotService');
const { sendBookingConfirmation, sendAdminBookingNotification } = require('../services/emailService');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/appointments — pubblico
router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Nome obbligatorio'),
    body('customerPhone').trim().notEmpty().withMessage('Telefono obbligatorio'),
    body('customerEmail').isEmail().normalizeEmail().withMessage('Email non valida'),
    body('serviceId').notEmpty().withMessage('Servizio obbligatorio'),
    body('date').isDate().withMessage('Data non valida'),
    body('startTime').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Orario non valido'),
    body('notes').optional().trim().isLength({ max: 500 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { customerName, customerPhone, customerEmail, serviceId, date, startTime, notes } = req.body;

      const service = await prisma.service.findUnique({ where: { id: serviceId, isActive: true } });
      if (!service) return res.status(404).json({ error: 'Servizio non trovato' });

      // Verifica che lo slot sia disponibile
      const availableSlots = await getAvailableSlots(date, service.duration);
      if (!availableSlots.includes(startTime)) {
        return res.status(409).json({ error: 'Slot non disponibile. Riprova con un altro orario.' });
      }

      // Calcola endTime
      const endMinutes = timeToMinutes(startTime) + service.duration;
      const endTime = minutesToTime(endMinutes);

      // Se il cliente è loggato, collega la prenotazione al suo account
      let customerId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
          if (decoded.role === 'customer') customerId = decoded.id;
        } catch { /* token non valido o scaduto: prenotazione anonima */ }
      }

      const appointment = await prisma.appointment.create({
        data: {
          customerName,
          customerPhone,
          customerEmail,
          serviceId,
          date: new Date(date + 'T00:00:00.000Z'),
          startTime,
          endTime,
          notes,
          status: 'CONFIRMED',
          ...(customerId ? { customerId } : {}),
        },
        include: { service: true },
      });

      // Invia email di conferma al cliente (non-blocking)
      sendBookingConfirmation(appointment, appointment.service).catch(console.error);

      // Invia notifica nuova prenotazione all'admin (non-blocking)
      sendAdminBookingNotification(appointment, appointment.service).catch(console.error);

      res.status(201).json(appointment);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/appointments — admin
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { date, status, from, to } = req.query;
    const where = {};

    if (date) {
      where.date = { gte: new Date(date + 'T00:00:00.000Z'), lte: new Date(date + 'T23:59:59.999Z') };
    } else if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from + 'T00:00:00.000Z');
      if (to) where.date.lte = new Date(to + 'T23:59:59.999Z');
    }

    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: { service: { select: { name: true, duration: true, price: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments/:id — admin
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { service: true },
    });
    if (!appointment) return res.status(404).json({ error: 'Appuntamento non trovato' });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
});

// PUT /api/appointments/:id/status — admin
router.put(
  '/:id/status',
  authMiddleware,
  [body('status').isIn(['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])],
  validate,
  async (req, res, next) => {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
        include: { service: { select: { name: true } } },
      });
      res.json(appointment);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/appointments/:id — admin
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });
    res.json({ message: 'Appuntamento cancellato' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
