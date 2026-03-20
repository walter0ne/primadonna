// Orari di apertura per giorno della settimana (0=domenica, 1=lunedì, ...)
const ORARI_APERTURA = {
  1: { open: '09:00', close: '19:00' }, // lunedì
  2: { open: '09:00', close: '19:00' }, // martedì
  3: { open: '09:00', close: '19:00' }, // mercoledì
  4: { open: '09:00', close: '19:00' }, // giovedì
  5: { open: '09:00', close: '19:00' }, // venerdì
  6: { open: '09:00', close: '17:00' }, // sabato
  // 0: domenica — chiuso
};

const SLOT_INTERVAL = 30; // minuti tra uno slot e l'altro
const PAUSA_PRANZO = { start: '13:00', end: '14:00' };
const BUFFER_MINUTI = 0; // minuti di buffer tra appuntamenti
const MIN_ADVANCE_HOURS = 2; // ore minime di anticipo per prenotare
const TIMEZONE = 'Europe/Rome';

module.exports = {
  ORARI_APERTURA,
  SLOT_INTERVAL,
  PAUSA_PRANZO,
  BUFFER_MINUTI,
  MIN_ADVANCE_HOURS,
  TIMEZONE,
};
