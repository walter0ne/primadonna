const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
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

      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
