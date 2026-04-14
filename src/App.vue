<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-btn
      :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      @click="toggleTheme"
      elevation="4"
      class="btn-tema"
      color="primary"
    ></v-btn>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
  import { useTheme } from 'vuetify'
  import Footer from '@/components/Footer.vue'

  const theme = useTheme()

  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }
</script>

<style scoped>
.btn-tema {
  position: fixed;
  bottom: 16px; 
  right: 16px;   
  z-index: 999; 
}

@media (max-width: 600px) {
  .btn-tema {
    bottom: 12px;
    right: 12px;
    width: 36px !important;
    height: 36px !important;
  }
}
</style>

<style>
html, body {
  overflow-x: hidden;
  max-width: 100vw;

}
</style>

