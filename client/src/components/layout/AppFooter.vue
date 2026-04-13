<template>
  <footer class="bg-secondary text-beige-light mt-auto">
    <div class="max-w-5xl mx-auto px-4 py-10">

      <!-- Logo + tagline -->
      <div class="text-center mb-8">
        <p class="font-serif text-3xl font-bold tracking-widest text-accent mb-1">PRIMADONNA</p>
        <p class="text-sm text-accent-warm/60 font-light">Il tuo salone di bellezza</p>
      </div>

      <!-- Divider decorativo -->
      <div class="flex items-center gap-3 mb-8">
        <div class="flex-1 h-px bg-accent/15"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-primary-light"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-primary-light"></div>
        <div class="flex-1 h-px bg-accent/15"></div>
      </div>

      <!-- Info -->
      <div class="text-center text-sm text-accent-warm/60 space-y-2">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Corso+Campano+47+Giugliano+in+Campania+NA"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 hover:text-accent transition-colors"
        >
          <span>📍</span>
          <span>Corso Campano, 47 — 80014 Giugliano in Campania (NA)</span>
        </a>
        <p class="flex items-center justify-center gap-2">
          <span>📞</span>
          <a href="tel:+393489135964" class="hover:text-accent transition-colors">+39 348 913 5964</a>
        </p>
        <p class="text-xs mt-4 text-accent/30">© {{ new Date().getFullYear() }} Primadonna. Tutti i diritti riservati.</p>
      </div>
    </div>
  </footer>
</template>
