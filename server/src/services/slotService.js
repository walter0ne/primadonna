const { PrismaClient } = require('@prisma/client');
const {
  ORARI_APERTURA,
  SLOT_INTERVAL,
  PAUSA_PRANZO,
  BUFFER_MINUTI,
  MIN_ADVANCE_HOURS,
} = require('../utils/constants');

const prisma = new PrismaClient();

// Converte "HH:MM" in minuti dalla mezzanotte
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Converte minuti dalla mezzanotte in "HH:MM"
function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

async function getAvailableSlots(dateStr, serviceDuration) {
  // dateStr: "YYYY-MM-DD"
  const date = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = date.getDay(); // 0=domenica

  // Controlla se il salone è aperto quel giorno
  const orari = ORARI_APERTURA[dayOfWeek];
  if (!orari) return []; // chiuso

  const openMinutes = timeToMinutes(orari.open);
  const closeMinutes = timeToMinutes(orari.close);
  const pausaStartMinutes = timeToMinutes(PAUSA_PRANZO.start);
  const pausaEndMinutes = timeToMinutes(PAUSA_PRANZO.end);

  // Calcola il minimo orario prenotabile (adesso + MIN_ADVANCE_HOURS)
  const now = new Date();
  const nowInRome = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const isToday =
    date.getFullYear() === nowInRome.getFullYear() &&
    date.getMonth() === nowInRome.getMonth() &&
    date.getDate() === nowInRome.getDate();

  let minSlotMinutes = openMinutes;
  if (isToday) {
    const currentMinutes = nowInRome.getHours() * 60 + nowInRome.getMinutes();
    minSlotMinutes = Math.max(openMinutes, currentMinutes + MIN_ADVANCE_HOURS * 60);
  }

  // Prendi gli appuntamenti confermati per quella data
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
  const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
      status: 'CONFIRMED',
    },
    select: { startTime: true, endTime: true },
  });

  // Genera tutti gli slot possibili
  const availableSlots = [];
  for (let slotStart = openMinutes; slotStart < closeMinutes; slotStart += SLOT_INTERVAL) {
    const slotEnd = slotStart + serviceDuration + BUFFER_MINUTI;

    // Controlla che lo slot non superi l'orario di chiusura
    if (slotEnd > closeMinutes) continue;

    // Controlla l'anticipo minimo
    if (slotStart < minSlotMinutes) continue;

    // Controlla la pausa pranzo
    const pauseOverlap =
      slotStart < pausaEndMinutes && slotEnd > pausaStartMinutes;
    if (pauseOverlap) continue;

    // Controlla sovrapposizione con appuntamenti esistenti
    const hasConflict = appointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return slotStart < apptEnd && slotEnd > apptStart;
    });
    if (hasConflict) continue;

    availableSlots.push(minutesToTime(slotStart));
  }

  return availableSlots;
}

module.exports = { getAvailableSlots, timeToMinutes, minutesToTime };
