<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="visible"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-safe"
      style="padding-bottom: max(1rem, env(safe-area-inset-bottom))"
    >
      <div class="max-w-3xl mx-auto glass border border-[#E8D5B7]/80 rounded-2xl shadow-strong p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <!-- Icon -->
        <div class="shrink-0 w-10 h-10 rounded-xl bg-[#F0E2CE] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </div>

        <!-- Text -->
        <p class="text-sm text-[#6B4226] flex-1 leading-relaxed">
          Questo sito utilizza esclusivamente <strong class="text-[#2D1A0E]">cookie tecnici necessari</strong>
          al funzionamento del servizio. Nessun dato viene ceduto a terzi né utilizzato per profilazione.
          <RouterLink to="/cookie-policy" class="text-[#8B5A2B] font-semibold hover:underline ml-1">
            Cookie Policy
          </RouterLink>
          <span class="mx-1">·</span>
          <RouterLink to="/privacy-policy" class="text-[#8B5A2B] font-semibold hover:underline">
            Privacy Policy
          </RouterLink>
        </p>

        <!-- Accept button -->
        <button
          @click="accept"
          class="shrink-0 btn-primary text-sm px-5 py-2.5 whitespace-nowrap"
        >
          Ho capito
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const STORAGE_KEY = 'pd_cookie_consent'
const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Piccolo delay per non mostrarlo subito al caricamento
    setTimeout(() => { visible.value = true }, 800)
  }
})

function accept() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    accepted: true,
    date: new Date().toISOString(),
  }))
  visible.value = false
}
</script>
