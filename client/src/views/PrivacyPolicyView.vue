<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F5ECD8] via-[#FBF7F1] to-[#F0E2CE]">
    <!-- Header -->
    <div class="bg-gradient-to-r from-[#2D1A0E] to-[#6B3F18] py-12 px-4">
      <div class="max-w-3xl mx-auto">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-[#C8A882] hover:text-[#E8D5B7] transition-colors text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Torna alla home
        </RouterLink>
        <h1 class="text-3xl font-bold text-[#E8D5B7] font-serif tracking-wide">Privacy Policy</h1>
        <p class="text-[#A8703E] mt-2 text-sm">Ultimo aggiornamento: {{ lastUpdate }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-10">
      <div class="card p-8 space-y-8 text-[#2D1A0E]">

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">1. Titolare del trattamento</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            Il Titolare del trattamento dei dati personali è:<br><br>
            <strong>Salone Primadonna</strong><br>
            Corso Campano, 47 — 80014 Giugliano in Campania (NA)<br>
            Telefono: <a href="tel:+393489135964" class="text-[#8B5A2B] hover:underline">+39 348 913 5964</a><br>
            Email: <a href="mailto:ricci.walter.wr@gmail.com" class="text-[#8B5A2B] hover:underline">ricci.walter.wr@gmail.com</a>
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">2. Dati raccolti e finalità</h2>
          <div class="space-y-4 text-sm leading-relaxed text-[#4A2C0E]">
            <div class="bg-[#F5ECD8] rounded-xl p-4">
              <p class="font-semibold text-[#2D1A0E] mb-1">Prenotazione servizi</p>
              <p>Nome, cognome, numero di telefono, indirizzo email, data e orario dell'appuntamento. Finalità: gestione delle prenotazioni e comunicazioni operative.</p>
            </div>
            <div class="bg-[#F5ECD8] rounded-xl p-4">
              <p class="font-semibold text-[#2D1A0E] mb-1">Creazione account cliente</p>
              <p>Nome, cognome, indirizzo email, numero di telefono, password (conservata in forma criptata e non reversibile). Finalità: accesso all'area personale e visualizzazione dello storico appuntamenti.</p>
            </div>
            <div class="bg-[#F5ECD8] rounded-xl p-4">
              <p class="font-semibold text-[#2D1A0E] mb-1">Comunicazioni email</p>
              <p>L'indirizzo email viene utilizzato per inviare la conferma della prenotazione. Il servizio di invio email è gestito da Resend (Resend Inc., fornitore esterno). Nessun dato viene ceduto per finalità di marketing senza consenso esplicito.</p>
            </div>
          </div>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">3. Base giuridica del trattamento</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            Il trattamento dei dati personali si basa su:
          </p>
          <ul class="mt-3 space-y-2 text-sm text-[#4A2C0E]">
            <li class="flex items-start gap-2">
              <span class="text-[#8B5A2B] font-bold mt-0.5">·</span>
              <span><strong>Esecuzione di un contratto</strong> (art. 6, lett. b GDPR): il trattamento è necessario per eseguire il servizio di prenotazione richiesto dall'interessato.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#8B5A2B] font-bold mt-0.5">·</span>
              <span><strong>Consenso dell'interessato</strong> (art. 6, lett. a GDPR): per la creazione dell'account cliente e le comunicazioni non strettamente operative.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#8B5A2B] font-bold mt-0.5">·</span>
              <span><strong>Legittimo interesse</strong> (art. 6, lett. f GDPR): per la gestione amministrativa delle prenotazioni e la prevenzione di frodi.</span>
            </li>
          </ul>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">4. Conservazione dei dati</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            I dati relativi alle prenotazioni vengono conservati per un periodo di <strong>24 mesi</strong> dalla data dell'appuntamento, salvo diversi obblighi di legge. I dati dell'account cliente vengono conservati fino alla richiesta di cancellazione da parte dell'interessato.
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">5. Diritti dell'interessato</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E] mb-3">
            Ai sensi degli artt. 15-22 del GDPR, l'interessato ha diritto di:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="right in rights" :key="right.title" class="bg-[#F5ECD8] rounded-xl p-3">
              <p class="font-semibold text-[#2D1A0E] text-sm">{{ right.title }}</p>
              <p class="text-xs text-[#6B4226] mt-0.5">{{ right.desc }}</p>
            </div>
          </div>
          <p class="text-sm text-[#4A2C0E] mt-4">
            Per esercitare i propri diritti, inviare una richiesta a
            <a href="mailto:ricci.walter.wr@gmail.com" class="text-[#8B5A2B] hover:underline font-semibold">ricci.walter.wr@gmail.com</a>.
            Il Titolare risponderà entro 30 giorni.
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">6. Trasferimento dati</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            I dati sono conservati su server sicuri forniti da <strong>Neon</strong> (database) e <strong>Render</strong> (server applicativo), entrambi conformi al GDPR. L'invio delle email è gestito da <strong>Resend Inc.</strong>, con sede negli USA, che garantisce adeguate tutele mediante clausole contrattuali standard (SCC).
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">7. Reclami</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            L'interessato ha il diritto di proporre reclamo al <strong>Garante per la protezione dei dati personali</strong>
            (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener" class="text-[#8B5A2B] hover:underline">www.garanteprivacy.it</a>)
            qualora ritenga che il trattamento dei propri dati violi il GDPR.
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">8. Cookie</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            Per informazioni dettagliate sull'utilizzo dei cookie, consulta la nostra
            <RouterLink to="/cookie-policy" class="text-[#8B5A2B] font-semibold hover:underline">Cookie Policy</RouterLink>.
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const lastUpdate = new Date().toLocaleDateString('it-IT', {
  day: 'numeric', month: 'long', year: 'numeric'
})

const rights = [
  { title: 'Accesso',        desc: 'Ottenere conferma del trattamento e copia dei dati.' },
  { title: 'Rettifica',      desc: 'Correggere dati inesatti o incompleti.' },
  { title: 'Cancellazione',  desc: 'Richiedere la cancellazione dei propri dati ("diritto all\'oblio").' },
  { title: 'Limitazione',    desc: 'Limitare il trattamento in determinati casi.' },
  { title: 'Portabilità',    desc: 'Ricevere i dati in formato strutturato e leggibile.' },
  { title: 'Opposizione',    desc: 'Opporsi al trattamento basato sul legittimo interesse.' },
]
</script>
