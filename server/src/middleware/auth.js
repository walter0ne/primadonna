const jwt = require('jsonwebtoken');

// ── Verifica token e ruolo ────────────────────────────────────────────────────
function createAuthMiddleware(requiredRole) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token mancante' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verifica che il ruolo nel token corrisponda a quello richiesto
      if (decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Accesso non autorizzato' });
      }

      // Attacca il payload alla request
      if (requiredRole === 'admin')    req.admin    = decoded;
      if (requiredRole === 'customer') req.customer = decoded;

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Sessione scaduta, effettua di nuovo il login' });
      }
      return res.status(401).json({ error: 'Token non valido' });
    }
  };
}

const authMiddleware         = createAuthMiddleware('admin');
const customerAuthMiddleware = createAuthMiddleware('customer');

module.exports = { authMiddleware, customerAuthMiddleware };
