const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBookingConfirmation(appointment, service) {
  const dateFormatted = new Date(appointment.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Rome',
  });

  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #FAFAF8; color: #2D2D2D; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: #1A1A2E; padding: 32px; text-align: center; }
    .header h1 { color: #C49B66; font-size: 28px; margin: 0; letter-spacing: 2px; }
    .header p { color: #E8D5B7; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; margin-bottom: 24px; }
    .card { background: #FAFAF8; border: 1px solid #E8D5B7; border-radius: 8px; padding: 24px; margin: 24px 0; }
    .card h3 { color: #C49B66; margin: 0 0 16px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0ece4; }
    .detail:last-child { border-bottom: none; }
    .detail .label { color: #666; font-size: 14px; }
    .detail .value { font-weight: 600; font-size: 14px; }
    .footer { background: #1A1A2E; padding: 24px; text-align: center; color: #E8D5B7; font-size: 13px; }
    .footer a { color: #C49B66; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PRIMADONNA</h1>
      <p>Il tuo salone di fiducia</p>
    </div>
    <div class="body">
      <p class="greeting">Ciao <strong>${appointment.customerName}</strong>,</p>
      <p>La tua prenotazione è confermata! Ti aspettiamo.</p>

      <div class="card">
        <h3>📋 Riepilogo Prenotazione</h3>
        <div class="detail">
          <span class="label">Servizio</span>
          <span class="value">${service.name}</span>
        </div>
        <div class="detail">
          <span class="label">Data</span>
          <span class="value">${dateFormatted}</span>
        </div>
        <div class="detail">
          <span class="label">Orario</span>
          <span class="value">${appointment.startTime}</span>
        </div>
        <div class="detail">
          <span class="label">Durata</span>
          <span class="value">${service.duration} minuti</span>
        </div>
        <div class="detail">
          <span class="label">Prezzo</span>
          <span class="value">€${Number(service.price).toFixed(2)}</span>
        </div>
      </div>

      <div class="card">
        <h3>📍 Dove ci trovi</h3>
        <p style="margin:0; font-size:14px;">Primadonna<br>[Indirizzo del salone]</p>
      </div>

      <p style="font-size:14px; color:#666;">
        Per cancellare o modificare la prenotazione, contattaci al <strong>[telefono]</strong>.
      </p>
    </div>
    <div class="footer">
      <p>A presto! — Il team Primadonna</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: appointment.customerEmail,
      subject: 'Prenotazione Confermata — Primadonna',
      html,
    });

    if (error) {
      console.error('Resend error:', error);
    }
    return data;
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

module.exports = { sendBookingConfirmation };
