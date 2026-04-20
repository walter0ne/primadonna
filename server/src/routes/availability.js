const express = require('express');
const { param, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { getAvailableSlots } = require('../services/slotService');
const validate = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/availability/:date?serviceId=xxx[&totalDuration=yyy]
router.get(
  '/:date',
  [
    param('date').isDate().withMessage('Data non valida (YYYY-MM-DD)'),
    query('serviceId').notEmpty().withMessage('serviceId obbligatorio'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { date } = req.params;
      const { serviceId, totalDuration } = req.query;

      const service = await prisma.service.findUnique({
        where: { id: serviceId, isActive: true },
      });
      if (!service) {
        return res.status(404).json({ error: 'Servizio non trovato' });
      }

      // Non permettere date passate
      const requestedDate = new Date(date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (requestedDate < today) {
        return res.json({ slots: [], message: 'Data passata' });
      }

      // Se il cliente ha selezionato più servizi, usa la durata totale passata dal frontend
      const duration = totalDuration ? parseInt(totalDuration, 10) : service.duration;
      const slots = await getAvailableSlots(date, duration);
      res.json({ slots, date, serviceId, serviceDuration: duration });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
