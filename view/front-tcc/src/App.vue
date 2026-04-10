<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <div>
    <v-btn
      :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      @click="toggleTheme"
      elevation="4"
      class="btn-tema"
      color="primary"
    ></v-btn>
    </div>
  </v-app>
</template>

<script lang="ts" setup>
  import { useTheme } from 'vuetify'

  const theme = useTheme()

  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }
</script>

<style scoped>
.btn-tema {
  position: fixed;
  bottom: 20px; 
  right: 20px;   
  z-index: 999; 
}

</style>