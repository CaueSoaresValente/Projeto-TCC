<script setup>
import { ref, computed } from "vue";
import { useTheme } from "vuetify";
import Menu from "@/components/Menu.vue";

const theme = useTheme();

// Detecta se o tema atual é dark
const isDark = computed(() => theme.global.current.value.dark);

// Dados do usuário
const user = ref({
  name: "Caue Soares",
  foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

// Itens do menu dropdown do avatar (com ícones de volta para ficar premium!)
const items = ref([
  { title: "Meu Perfil", icon: "mdi-account-outline" },
  { title: "Configurações", icon: "mdi-cog-outline" },
  { title: "Sair", icon: "mdi-logout" },
]);

// Configuração dos dias e períodos
const diasDaSemana = [
  { label: "Segunda", value: "segunda" },
  { label: "Terça", value: "terca" },
  { label: "Quarta", value: "quarta" },
  { label: "Quinta", value: "quinta" },
  { label: "Sexta", value: "sexta" },
  { label: "Sábado", value: "sabado" },
];

const periodos = [
  { label: "Manhã", value: "manha", icon: "mdi-weather-sunny", color: "#F59E0B" },
  { label: "Tarde", value: "tarde", icon: "mdi-weather-sunset", color: "#3B82F6" },
  { label: "Noite", value: "noite", icon: "mdi-weather-night", color: "#6366F1" },
  { label: "Integral", value: "integral", icon: "mdi-calendar-clock", color: "#10B981" },
];

// Estado reativo para os períodos selecionados
const selectedPeriodo = ref({});

// Funções de controle
const togglePeriodo = (dia, periodo) => {
  selectedPeriodo.value[dia] = periodo;
};

const removerPeriodo = (dia) => {
  selectedPeriodo.value[dia] = null;
};

const getPeriodoInfo = (val) => periodos.find(p => p.value === val);
</script>

<template>
  <Menu />

  <div class="mx-5 md:mx-20! lg:mx-32! mt-12 pb-24">
    <!-- Header Page -->
    <div class="mb-10 text-center sm:text-left px-2">
      <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Disponibilidade Semanal</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-3 font-medium">Selecione os períodos em que você estará disponível para lecionar.</p>
    </div>
    
    <!-- Grid de Dias -->
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <div v-for="dia in diasDaSemana" :key="dia.value" class="group">
        <div class="flex items-center justify-between mb-4 px-2">
          <span class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-red-500 transition-colors">
            {{ dia.label }}
          </span>
          <v-icon v-if="selectedPeriodo[dia.value]" icon="mdi-check-decagram" color="green" size="18"></v-icon>
        </div>
        
        <v-card
          variant="flat"
          class="rounded-2xl flex flex-col border-2 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
          :class="selectedPeriodo[dia.value] 
            ? 'border-gray-900 dark:border-white bg-white dark:bg-[#1E1E1E]' 
            : 'border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30'"
          height="340"
        >
          <!-- Estado Selecionado -->
          <div v-if="selectedPeriodo[dia.value]" class="h-full flex flex-col items-center justify-between p-6 animate-fade-in">
            <div 
              class="w-full flex-1 flex flex-col items-center justify-center rounded-2xl transition-colors p-4"
              :class="isDark ? 'bg-' + selectedPeriodo[dia.value] + '-dark' : 'bg-' + selectedPeriodo[dia.value] + '-soft'"
            >
              <div class="p-5 rounded-full bg-white dark:bg-gray-700 shadow-md mb-6">
                <v-icon 
                  :icon="getPeriodoInfo(selectedPeriodo[dia.value]).icon" 
                  size="36" 
                  :color="getPeriodoInfo(selectedPeriodo[dia.value]).color"
                ></v-icon>
              </div>
              <span class="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest">
                {{ getPeriodoInfo(selectedPeriodo[dia.value]).label }}
              </span>
            </div>

            <v-btn
              variant="tonal"
              color="red"
              block
              class="mt-6 rounded-xl font-bold text-xs h-12"
              prepend-icon="mdi-sync"
              @click="removerPeriodo(dia.value)"
            >
              Trocar Período
            </v-btn>
          </div>

          <!-- Estado de Seleção -->
          <div v-else class="h-full flex flex-col p-5 pb-8">
            <div class="flex-1 flex flex-col items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity mb-6">
              <v-icon icon="mdi-calendar-clock" size="44" color="grey-darken-1" class="dark:text-gray-400"></v-icon>
              <p class="text-[10px] font-black text-center mt-3 uppercase tracking-tighter dark:text-gray-400">Escolher Horário</p>
            </div>

            <div class="flex flex-col gap-2 mb-2">
              <button
                v-for="p in periodos"
                :key="p.value"
                @click="togglePeriodo(dia.value, p.value)"
                class="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 group/btn"
              >
                <v-icon :icon="p.icon" size="18" class="group-hover/btn:text-white dark:group-hover/btn:text-black" :style="{ color: p.color }"></v-icon>
                <span class="text-[12px] font-bold uppercase tracking-tight dark:text-gray-300 group-hover/btn:text-white dark:group-hover/btn:text-black">{{ p.label }}</span>
              </button>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modo Claro */
.bg-manha-soft { background-color: #FFFBEB !important; }
.bg-tarde-soft { background-color: #EFF6FF !important; }
.bg-noite-soft { background-color: #EEF2FF !important; }
.bg-integral-soft { background-color: #ECFDF5 !important; }

/* Modo Escuro (Classes específicas controladas pelo script) */
.bg-manha-dark { background-color: rgba(245, 158, 11, 0.2) !important; border: 1px solid rgba(245, 158, 11, 0.4); }
.bg-tarde-dark { background-color: rgba(59, 130, 246, 0.2) !important; border: 1px solid rgba(59, 130, 246, 0.4); }
.bg-noite-dark { background-color: rgba(99, 102, 241, 0.2) !important; border: 1px solid rgba(99, 102, 241, 0.4); }
.bg-integral-dark { background-color: rgba(16, 185, 129, 0.2) !important; border: 1px solid rgba(16, 185, 129, 0.4); }

.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>