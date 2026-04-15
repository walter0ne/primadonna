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
        <h1 class="text-3xl font-bold text-[#E8D5B7] font-serif tracking-wide">Cookie Policy</h1>
        <p class="text-[#A8703E] mt-2 text-sm">Ultimo aggiornamento: {{ lastUpdate }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-10">
      <div class="card p-8 space-y-8 text-[#2D1A0E]">

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">Cosa sono i cookie</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell'utente durante la navigazione. Permettono al sito di ricordare le preferenze e di funzionare correttamente tra una sessione e l'altra.
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">Cookie utilizzati da questo sito</h2>
          <p class="text-sm text-[#4A2C0E] mb-4">
            Questo sito utilizza <strong>esclusivamente cookie tecnici strettamente necessari</strong> al funzionamento del servizio. Non vengono utilizzati cookie di profilazione, marketing o analisi comportamentale.
          </p>

          <!-- Cookie table -->
          <div class="overflow-x-auto rounded-xl border border-[#E8D5B7]">
            <table class="w-full text-sm">
              <thead class="bg-[#F0E2CE]">
                <tr>
                  <th class="text-left px-4 py-3 font-semibold text-[#2D1A0E]">Nome</th>
                  <th class="text-left px-4 py-3 font-semibold text-[#2D1A0E]">Tipo</th>
                  <th class="text-left px-4 py-3 font-semibold text-[#2D1A0E]">Durata</th>
                  <th class="text-left px-4 py-3 font-semibold text-[#2D1A0E]">Finalità</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E8D5B7]">
                <tr v-for="cookie in cookies" :key="cookie.name" class="bg-[#FBF7F1] hover:bg-[#F5ECD8] transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-[#8B5A2B] font-semibold">{{ cookie.name }}</td>
                  <td class="px-4 py-3 text-[#4A2C0E]">{{ cookie.type }}</td>
                  <td class="px-4 py-3 text-[#4A2C0E]">{{ cookie.duration }}</td>
                  <td class="px-4 py-3 text-[#4A2C0E]">{{ cookie.purpose }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-xs text-[#9E7A5A] mt-3">
            * I dati di sessione (token di autenticazione) vengono salvati nel <strong>localStorage</strong> del browser, non in cookie tradizionali, e non vengono mai trasmessi a terzi.
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">Cookie di terze parti</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            Questo sito <strong>non installa cookie di terze parti</strong>. Non vengono utilizzati strumenti di analisi (es. Google Analytics), pulsanti social o sistemi pubblicitari che potrebbero impostare cookie di profilazione.
          </p>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">Come gestire i cookie</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E] mb-3">
            Poiché vengono utilizzati solo cookie tecnici necessari, il loro blocco potrebbe compromettere il funzionamento del sito. È comunque possibile gestire o eliminare i cookie tramite le impostazioni del proprio browser:
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <a
              v-for="browser in browsers"
              :key="browser.name"
              :href="browser.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 bg-[#F5ECD8] hover:bg-[#F0E2CE] transition-colors rounded-xl px-3 py-2.5 text-sm text-[#8B5A2B] font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              {{ browser.name }}
            </a>
          </div>
        </section>

        <div class="h-px bg-[#E8D5B7]"></div>

        <section>
          <h2 class="text-lg font-bold text-[#8B5A2B] mb-3">Contatti</h2>
          <p class="text-sm leading-relaxed text-[#4A2C0E]">
            Per qualsiasi domanda relativa ai cookie o al trattamento dei dati, contattaci a
            <a href="mailto:ricci.walter.wr@gmail.com" class="text-[#8B5A2B] hover:underline font-semibold">ricci.walter.wr@gmail.com</a>
            oppure consulta la nostra
            <RouterLink to="/privacy-policy" class="text-[#8B5A2B] hover:underline font-semibold">Privacy Policy</RouterLink>.
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

const cookies = [
  {
    name: 'pd_cookie_consent',
    type: 'Tecnico',
    duration: '12 mesi',
    purpose: 'Memorizza il consenso al banner cookie per evitare di mostrarlo ad ogni visita.',
  },
  {
    name: 'pd_admin_token',
    type: 'Tecnico (localStorage)',
    duration: 'Sessione / 7gg',
    purpose: 'Token di autenticazione per l\'area amministrativa. Rimosso al logout.',
  },
  {
    name: 'pd_customer_token',
    type: 'Tecnico (localStorage)',
    duration: '30 giorni',
    purpose: 'Token di autenticazione per l\'area cliente. Rimosso al logout o alla scadenza.',
  },
  {
    name: 'pd_booking',
    type: 'Tecnico (sessionStorage)',
    duration: 'Sessione',
    purpose: 'Mantiene i dati del flusso di prenotazione durante la navigazione tra i passaggi.',
  },
]

const browsers = [
  { name: 'Chrome',  url: 'https://support.google.com/chrome/answer/95647' },
  { name: 'Firefox', url: 'https://support.mozilla.org/it/kb/cancellare-cookie-e-dati-dei-siti-firefox' },
  { name: 'Safari',  url: 'https://support.apple.com/it-it/guide/safari/sfri11471/mac' },
  { name: 'Edge',    url: 'https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
  { name: 'Opera',   url: 'https://help.opera.com/en/latest/web-preferences/#cookies' },
]
</script>
