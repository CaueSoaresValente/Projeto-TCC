<template>
  <v-footer class="bg-red-600 text-white mt-6 py-4">
    <v-container class="py-0">
      <v-row dense>
        <v-col cols="12" md="4" class="text-center text-md-left">
          <div
            class="text-3xl font-black italic tracking-tighter mb-2 inline-block"
            style="font-family: 'Archivo Black', sans-serif"
          >
            SENAI
          </div>
          <p class="text-xs opacity-90 max-w-xs mx-auto mx-md-0">
            Pelo futuro do trabalho. O Serviço Nacional de Aprendizagem Industrial (SENAI) é um dos cinco maiores complexos de educação profissional do mundo.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center" v-if="showLinks">
          <h3 class="text-lg font-bold mb-3">Links Rápidos</h3>
          <div class="flex flex-col gap-1">
            <router-link to="/turmas" class="text-white hover:text-gray-200 transition-colors text-sm">Gestão de Turmas</router-link>
            <router-link to="/findprofessor" class="text-white hover:text-gray-200 transition-colors text-sm">Gestão de Professores</router-link>
            <router-link to="/" class="text-white hover:text-gray-200 transition-colors text-sm">Dashboard</router-link>
          </div>
        </v-col>
        <v-spacer v-else></v-spacer>

        <v-col cols="12" md="4" class="text-center text-md-right">
          <h3 class="text-lg font-bold mb-3">Siga-nos</h3>
          <div class="flex justify-center justify-md-end gap-2 mb-3">
            <v-btn icon="mdi-facebook" variant="text" color="white" density="comfortable"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" color="white" density="comfortable"></v-btn>
            <v-btn icon="mdi-linkedin" variant="text" color="white" density="comfortable"></v-btn>
          </div>
          <p class="text-xs font-bold mt-2">
            <v-icon icon="mdi-phone" start size="x-small"></v-icon>
            0800 000 0000
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-4 border-white opacity-20"></v-divider>

      <div class="flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] opacity-70 pb-2">
        <p>&copy; {{ new Date().getFullYear() }} SENAI - Todos os direitos reservados.</p>
        <div class="flex gap-4">
          <a href="#" class="text-white">Privacidade</a>
          <a href="#" class="text-white">Termos de Uso</a>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showLinks = computed(() => {
  const loginRoutes = ['telainput', 'login', 'cadastro'];
  return !loginRoutes.includes(route.name as string);
});
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
