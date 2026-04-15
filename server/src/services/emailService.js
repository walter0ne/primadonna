const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const SALON_NAME    = 'Primadonna';
const SALON_ADDRESS = 'Corso Campano, 47 — 80014 Giugliano in Campania (NA)';
const SALON_PHONE   = '+39 348 913 5964';
const SALON_MAPS    = 'https://www.google.com/maps/search/?api=1&query=Corso+Campano+47+Giugliano+in+Campania+NA';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(date) {
  return new Date(date).toLocaleDateString('it-IT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Europe/Rome',
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Template base ─────────────────────────────────────────────────────────────
function baseLayout(content) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${SALON_NAME}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; background-color: #F5ECD8; color: #2D1A0E; }
    .wrapper { max-width: 600px; margin: 32px auto; padding: 0 16px; }
    .card { background: #FBF7F1; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(139,90,43,0.15); }
    .header { background: linear-gradient(160deg, #2D1A0E 0%, #6B3F18 50%, #8B5A2B 100%); padding: 40px 32px; text-align: center; }
    .header-logo { color: #E8D5B7; font-size: 11px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; opacity: 0.7; }
    .header-title { color: #E8D5B7; font-size: 32px; font-weight: 800; letter-spacing: 6px; font-family: Georgia, serif; margin-bottom: 6px; }
    .header-subtitle { color: #A8703E; font-size: 13px; font-weight: 500; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 17px; color: #2D1A0E; margin-bottom: 10px; font-weight: 500; }
    .lead { font-size: 14px; color: #6B4226; line-height: 1.6; margin-bottom: 28px; }
    .summary-card { background: linear-gradient(135deg, #F0E2CE, #F5ECD8); border: 1.5px solid #D4B896; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
    .summary-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #8B5A2B; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #E8D5B7; }
    .row:last-child { border-bottom: none; padding-bottom: 0; }
    .row-label { font-size: 13px; color: #9E7A5A; }
    .row-value { font-size: 13px; font-weight: 600; color: #2D1A0E; }
    .row-total .row-label { font-weight: 700; color: #2D1A0E; font-size: 14px; }
    .row-total .row-value { font-size: 18px; font-weight: 800; color: #8B5A2B; }
    .info-card { background: #FBF7F1; border: 1.5px solid #E8D5B7; border-radius: 14px; padding: 20px 24px; margin-bottom: 20px; }
    .info-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #8B5A2B; text-transform: uppercase; margin-bottom: 14px; }
    .info-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #6B4226; line-height: 1.5; }
    .info-row:last-child { margin-bottom: 0; }
    .info-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #8B5A2B, #A8703E); color: #FBF7F1 !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 14px; letter-spacing: 0.5px; margin: 8px 0; }
    .note { font-size: 12px; color: #9E7A5A; line-height: 1.6; }
    .footer { background: #2D1A0E; padding: 24px 32px; text-align: center; }
    .footer-name { color: #E8D5B7; font-family: Georgia, serif; font-size: 18px; letter-spacing: 4px; font-weight: 700; margin-bottom: 6px; }
    .footer-info { color: #6B4226; font-size: 12px; line-height: 1.8; }
    .footer-info a { color: #A8703E; text-decoration: none; }
    @media (max-width: 480px) {
      .body { padding: 24px 20px; }
      .header { padding: 32px 20px; }
      .header-title { font-size: 26px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-logo">Salone di Bellezza</div>
        <div class="header-title">PRIMADONNA</div>
        <div class="header-subtitle">Il tuo salone di fiducia</div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <div class="footer-name">PRIMADONNA</div>
        <div class="footer-info">
          📍 <a href="${SALON_MAPS}">${SALON_ADDRESS}</a><br>
          📞 <a href="tel:${SALON_PHONE.replace(/\s/g, '')}">${SALON_PHONE}</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── Email prenotazione confermata ─────────────────────────────────────────────
async function sendBookingConfirmation(appointment, service) {
  const dateStr = capitalize(formatDate(appointment.date));

  const content = `
    <p class="greeting">Ciao <strong>${appointment.customerName}</strong>,</p>
    <p class="lead">La tua prenotazione è confermata! Non vediamo l'ora di vederti. 🎉</p>

    <div class="summary-card">
      <div class="summary-title">Riepilogo prenotazione</div>
      <div class="row">
        <span class="row-label">Servizio</span>
        <span class="row-value">${service.name}</span>
      </div>
      <div class="row">
        <span class="row-label">Data</span>
        <span class="row-value">${dateStr}</span>
      </div>
      <div class="row">
        <span class="row-label">Orario</span>
        <span class="row-value">${appointment.startTime}</span>
      </div>
      <div class="row">
        <span class="row-label">Durata</span>
        <span class="row-value">${service.duration} minuti</span>
      </div>
      <div class="row row-total">
        <span class="row-label">Totale</span>
        <span class="row-value">€${Number(service.price).toFixed(2)}</span>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">Dove ci trovi</div>
      <div class="info-row">
        <span class="info-icon">📍</span>
        <span><a href="${SALON_MAPS}" style="color:#8B5A2B">${SALON_ADDRESS}</a></span>
      </div>
      <div class="info-row">
        <span class="info-icon">📞</span>
        <span><a href="tel:${SALON_PHONE.replace(/\s/g, '')}" style="color:#8B5A2B">${SALON_PHONE}</a></span>
      </div>
    </div>

    <p class="note">
      Hai bisogno di modificare o cancellare? Contattaci almeno 24 ore prima al numero indicato sopra.
    </p>
  `;

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to:      appointment.customerEmail,
    subject: `Confermato: ${service.name} — ${dateStr}`,
    html:    baseLayout(content),
  }).catch(err => console.error('Email booking confirmation failed:', err.message));
}

// ── Notifica admin: nuova prenotazione ────────────────────────────────────────
async function sendAdminBookingNotification(appointment, service) {
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL;
  if (!notifyEmail) return; // variabile non impostata → skip silenzioso

  const dateStr = capitalize(formatDate(appointment.date));

  const html = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .card { background: #fff; max-width: 480px; margin: 0 auto; border-radius: 12px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
  h2 { color: #8B5A2B; margin: 0 0 20px; font-size: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 9px 0; border-bottom: 1px solid #f0e8dc; color: #333; }
  td:first-child { color: #9E7A5A; width: 110px; }
  td:last-child { font-weight: 600; }
  .total td:last-child { color: #8B5A2B; font-size: 16px; }
</style></head>
<body>
  <div class="card">
    <h2>🗓 Nuova prenotazione</h2>
    <table>
      <tr><td>Cliente</td><td>${appointment.customerName}</td></tr>
      <tr><td>Email</td><td>${appointment.customerEmail}</td></tr>
      <tr><td>Telefono</td><td>${appointment.customerPhone}</td></tr>
      <tr><td>Servizio</td><td>${service.name}</td></tr>
      <tr><td>Data</td><td>${dateStr}</td></tr>
      <tr><td>Orario</td><td>${appointment.startTime} – ${appointment.endTime}</td></tr>
      ${appointment.notes ? `<tr><td>Note</td><td>${appointment.notes}</td></tr>` : ''}
      <tr class="total"><td>Totale</td><td>€${Number(service.price).toFixed(2)}</td></tr>
    </table>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to:      notifyEmail,
    subject: `📅 Nuova prenotazione: ${appointment.customerName} — ${service.name} ${dateStr}`,
    html,
  }).catch(err => console.error('Admin notification email failed:', err.message));
}

// ── Email di benvenuto alla registrazione ─────────────────────────────────────
async function sendWelcomeEmail(customer) {
  const content = `
    <p class="greeting">Benvenuta, <strong>${customer.name}</strong>!</p>
    <p class="lead">
      Il tuo account Primadonna è stato creato con successo.
      Ora puoi prenotare i tuoi servizi preferiti e tenere traccia di tutti i tuoi appuntamenti.
    </p>

    <div class="info-card" style="text-align:center; padding:28px;">
      <div class="info-title" style="margin-bottom:18px">Cosa puoi fare ora</div>
      <p style="font-size:14px; color:#6B4226; margin-bottom:6px;">✂️ Prenota un servizio in pochi tap</p>
      <p style="font-size:14px; color:#6B4226; margin-bottom:6px;">📋 Visualizza i tuoi appuntamenti</p>
      <p style="font-size:14px; color:#6B4226; margin-bottom:20px;">📱 Ricevi conferme via email</p>
    </div>

    <p class="note" style="text-align:center">
      Ci vediamo presto da ${SALON_NAME}! 💛
    </p>
  `;

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to:      customer.email,
    subject: `Benvenuta in ${SALON_NAME}!`,
    html:    baseLayout(content),
  }).catch(err => console.error('Welcome email failed:', err.message));
}

module.exports = { sendBookingConfirmation, sendWelcomeEmail, sendAdminBookingNotification };
