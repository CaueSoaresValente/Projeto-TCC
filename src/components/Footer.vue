<template>
  <v-footer class="bg-red-600 text-white mt-12">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="text-center text-md-left">
          <div
            class="text-4xl font-black italic tracking-tighter mb-4 inline-block"
            style="font-family: 'Archivo Black', sans-serif"
          >
            SENAI
          </div>
          <p class="text-sm opacity-90 max-w-xs mx-auto mx-md-0">
            Pelo futuro do trabalho. O Serviço Nacional de Aprendizagem Industrial (SENAI) é um dos cinco maiores complexos de educação profissional do mundo.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center">
          <h3 class="text-xl font-bold mb-6">Links Rápidos</h3>
          <div class="flex flex-col gap-3">
            <router-link to="/turmas" class="text-white hover:text-gray-200 transition-colors">Gestão de Turmas</router-link>
            <router-link to="/findprofessor" class="text-white hover:text-gray-200 transition-colors">Gestão de Professores</router-link>
            <router-link to="/" class="text-white hover:text-gray-200 transition-colors">Dashboard</router-link>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-right">
          <h3 class="text-xl font-bold mb-6">Siga-nos</h3>
          <div class="flex justify-center justify-md-end gap-4 mb-6">
            <v-btn icon="mdi-facebook" variant="text" color="white"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" color="white"></v-btn>
            <v-btn icon="mdi-linkedin" variant="text" color="white"></v-btn>
          </div>
          <p class="text-sm font-bold mt-4">
            <v-icon icon="mdi-phone" start size="small"></v-icon>
            0800 000 0000
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-8 border-white opacity-20"></v-divider>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-70">
        <p>&copy; {{ new Date().getFullYear() }} SENAI - Todos os direitos reservados.</p>
        <div class="flex gap-6">
          <a href="#" class="text-white">Privacidade</a>
          <a href="#" class="text-white">Termos de Uso</a>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
