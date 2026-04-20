const express = require('express');
const { body, param } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

const serviceValidators = [
  body('name').trim().notEmpty().withMessage('Nome obbligatorio'),
  body('duration').isInt({ min: 5, max: 480 }).withMessage('Durata in minuti (5-480)'),
  body('price').optional({ values: 'falsy' }).isDecimal({ decimal_digits: '0,2' }).withMessage('Prezzo non valido'),
  body('description').optional().trim(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

// GET /api/services — pubblico, solo attivi
router.get('/', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

// GET /api/services/all — admin, tutti
router.get('/all', authMiddleware, async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

// POST /api/services
router.post('/', authMiddleware, serviceValidators, validate, async (req, res, next) => {
  try {
    const { name, description, duration, price, sortOrder } = req.body;
    const service = await prisma.service.create({
      data: { name, description, duration: Number(duration), price: price !== undefined ? Number(price) : 0, sortOrder: sortOrder ? Number(sortOrder) : 0 },
    });
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
});

// PUT /api/services/:id
router.put('/:id', authMiddleware, serviceValidators, validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, sortOrder, isActive } = req.body;
    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        duration: Number(duration),
        ...(price !== undefined && price !== '' ? { price: Number(price) } : {}),
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });
    res.json(service);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/services/:id — hard delete se nessuna prenotazione associata
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Controlla se ci sono prenotazioni collegate
    const linked = await prisma.appointment.count({ where: { serviceId: id } });
    if (linked > 0) {
      return res.status(409).json({
        error: `Impossibile eliminare: questo servizio è collegato a ${linked} prenotazion${linked === 1 ? 'e' : 'i'}. Puoi disattivarlo invece di eliminarlo.`,
      });
    }

    await prisma.service.delete({ where: { id } });
    res.json({ message: 'Servizio eliminato' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
