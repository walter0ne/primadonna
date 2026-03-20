function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Conflitto: dato duplicato' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Risorsa non trovata' });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Errore interno del server' : err.message;
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
