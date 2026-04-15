<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/layout/ToastContainer.vue'
import CookieBanner from './components/CookieBanner.vue'
</script>

<template>
  <RouterView />
  <ToastContainer />
  <CookieBanner />
</template>
