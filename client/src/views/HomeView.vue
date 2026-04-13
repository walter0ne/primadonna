<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useApi } from '../composables/useApi.js'
import { formatPrice, formatDuration } from '../utils/formatters.js'

const { get } = useApi()
const services = ref([])

onMounted(async () => {
  services.value = await get('/services').catch(() => [])
})
</script>

<template>
  <div class="flex flex-col min-h-screen min-h-dvh bg-background">
    <AppHeader />

    <!-- ── HERO ───────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-secondary text-beige-light">

      <!-- Sfondo decorativo -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl"></div>
        <div class="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-primary-dark/30 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div class="relative max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">

        <!-- Pill badge -->
        <div class="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
          <span class="w-1.5 h-1.5 rounded-full bg-primary-light inline-block"></span>
          Prenotazione online 24/7
        </div>

        <!-- Titolo -->
        <h1 class="hero-title text-beige-light mb-4 animate-fade-in-up" style="animation-delay:0.1s">
          PRIMA<span class="text-primary-light">DONNA</span>
        </h1>

        <!-- Sottotitolo -->
        <p class="text-accent-warm/80 text-lg md:text-xl font-light mb-3 animate-fade-in-up" style="animation-delay:0.2s">
          Il tuo salone di bellezza
        </p>
        <p class="text-accent/50 text-sm max-w-xs md:max-w-sm mx-auto mb-10 animate-fade-in-up" style="animation-delay:0.25s">
          Prenota il tuo appuntamento in pochi tap, senza attese al telefono.
        </p>

        <!-- CTA -->
        <div class="animate-fade-in-up" style="animation-delay:0.35s">
          <RouterLink to="/prenota" class="btn-primary text-base px-10 py-4 min-h-[56px] shadow-strong">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Prenota il tuo appuntamento
          </RouterLink>
        </div>

        <!-- Trust indicators -->
        <div class="flex items-center justify-center gap-5 mt-10 text-accent/40 text-xs animate-fade-in-up" style="animation-delay:0.45s">
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>
            Nessun anticipo
          </span>
          <span class="w-1 h-1 rounded-full bg-accent/30"></span>
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Solo 1 minuto
          </span>
          <span class="w-1 h-1 rounded-full bg-accent/30"></span>
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            Dati al sicuro
          </span>
        </div>
      </div>

      <!-- Onda decorativa bottom -->
      <div class="absolute bottom-0 left-0 right-0 h-12 bg-background" style="clip-path: ellipse(55% 100% at 50% 100%)"></div>
    </section>

    <!-- ── SERVIZI ─────────────────────────────────────────── -->
    <section class="py-16 px-4 max-w-5xl mx-auto w-full">

      <div class="text-center mb-10">
        <h2 class="section-title mb-2">I nostri servizi</h2>
        <div class="divider mt-3 mb-4"></div>
        <p class="text-primary/60 text-sm">Professionalità e cura in ogni trattamento</p>
      </div>

      <!-- Loading shimmer -->
      <div v-if="!services.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <div v-for="i in 4" :key="i" class="shimmer h-36 animate-fade-in-up"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <div
          v-for="service in services"
          :key="service.id"
          class="card p-5 flex flex-col gap-3 animate-fade-in-up group hover:shadow-strong hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Nome + prezzo -->
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-secondary text-base leading-snug group-hover:text-primary transition-colors">
              {{ service.name }}
            </h3>
            <span class="text-primary font-bold text-sm shrink-0">{{ formatPrice(service.price) }}</span>
          </div>

          <!-- Descrizione -->
          <p v-if="service.description" class="text-primary/50 text-xs leading-relaxed flex-1">
            {{ service.description }}
          </p>

          <!-- Durata badge -->
          <div class="flex items-center gap-1.5">
            <span class="badge">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ formatDuration(service.duration) }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <RouterLink to="/prenota" class="btn-primary inline-flex">
          Prenota Ora
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </RouterLink>
      </div>
    </section>

    <!-- ── PERCHÉ SCEGLIERCI ───────────────────────────────── -->
    <section class="section-warm py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">

        <h2 class="font-serif text-3xl font-bold mb-2 text-accent">Perché sceglierci</h2>
        <div class="divider mt-3 mb-10"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">

          <div class="card-hover p-6 text-center bg-white/5 border-accent/10 shadow-none hover:bg-white/8 hover:shadow-none">
            <div class="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-accent mb-2">Professionalità</h3>
            <p class="text-sm text-accent/50 leading-relaxed">Stilisti esperti e appassionati al tuo servizio ogni giorno</p>
          </div>

          <div class="card-hover p-6 text-center bg-white/5 border-accent/10 shadow-none hover:bg-white/8 hover:shadow-none">
            <div class="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
              </svg>
            </div>
            <h3 class="font-semibold text-accent mb-2">Prenotazione Online</h3>
            <p class="text-sm text-accent/50 leading-relaxed">Prenota 24/7 dal tuo smartphone, senza attese al telefono</p>
          </div>

          <div class="card-hover p-6 text-center bg-white/5 border-accent/10 shadow-none hover:bg-white/8 hover:shadow-none">
            <div class="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-accent mb-2">Qualità Garantita</h3>
            <p class="text-sm text-accent/50 leading-relaxed">Prodotti di alta qualità per risultati eccellenti e duraturi</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CALL TO ACTION FINALE ───────────────────────────── -->
    <section class="py-16 px-4 text-center bg-background">
      <div class="max-w-sm mx-auto">
        <p class="text-xs font-semibold text-primary/40 tracking-widest uppercase mb-3">Inizia oggi</p>
        <h2 class="font-serif text-2xl font-bold text-secondary mb-3">Pronta a coccolarti?</h2>
        <p class="text-primary/50 text-sm mb-8">Il tuo prossimo appuntamento è a un tap di distanza.</p>
        <RouterLink to="/prenota" class="btn-primary w-full justify-center">
          Prenota il tuo momento
        </RouterLink>
      </div>
    </section>

    <AppFooter />
  </div>
</template>
