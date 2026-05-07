<script setup>
import Menu from "@/components/Menu.vue";
import { ref } from "vue";

const user = ref({
  name: "User",
  foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

const items = ref([
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
]);

const turmas = [
  {
    label: "CPTMTDS04",
    value: "cptmtds04",
    modalidade: "tec",
    siglas: "M01",
    areas: ["Tecnologia", "Software"],
  },
  {
    label: "CPTMTDS03",
    value: "cptmtds03",
    modalidade: "fic",
    siglas: "M02",
    areas: ["Manutenção", "Hardware"],
  },
  {
    label: "CPTMTDS02",
    value: "cptmtds02",
    modalidade: "cai",
    siglas: "T01",
    areas: ["Elétrica", "Automação"],
  },
  {
    label: "CPTMTDS01",
    value: "cptmtds01",
    modalidade: "tec",
    siglas: "T02",
    areas: ["Tecnologia", "Cloud"],
  },
  {
    label: "CPTMTDS04",
    value: "cptmtds04",
    modalidade: "tec",
    siglas: "N01",
    areas: ["Software", "Web"],
  },
  {
    label: "CPTMTDS03",
    value: "cptmtds03",
    modalidade: "fic",
    siglas: "N02",
    areas: ["Redes", "Infra"],
  },
  {
    label: "CPTMTDS02",
    value: "cptmtds02",
    modalidade: "cai",
    siglas: "INT",
    areas: ["Elétrica"],
  },
  {
    label: "CPTMTDS01",
    value: "cptmtds01",
    modalidade: "tec",
    siglas: "INT",
    areas: ["Tecnologia"],
  },
  {
    label: "CPTMTDS04",
    value: "cptmtds04",
    modalidade: "tec",
    siglas: "INT",
    areas: ["Mobile"],
  },
  {
    label: "CPTMTDS03",
    value: "cptmtds03",
    modalidade: "fic",
    siglas: "INT",
    areas: ["Gestão"],
  },
  {
    label: "CPTMTDS02",
    value: "cptmtds02",
    modalidade: "cai",
    siglas: "INT",
    areas: ["Mecânica"],
  },
  {
    label: "CPTMTDS01",
    value: "cptmtds01",
    modalidade: "tec",
    siglas: "INT",
    areas: ["Design"],
  },
];

const selectedAreas = ref([]);
const areasDisponiveis = [...new Set(turmas.flatMap((t) => t.areas))];

const tipoCurso = ref("tec");

const diasDaSemana = ref([
  { label: "Segunda-feira", value: "segunda" },
  { label: "Terça-feira", value: "terca" },
  { label: "Quarta-feira", value: "quarta" },
  { label: "Quinta-feira", value: "quinta" },
  { label: "Sexta-feira", value: "sexta" },
  { label: "Sábado", value: "sabado" },
]);

const selectedPeriodo = ref({
  segunda: null,
  terca: null,
  quarta: null,
  quinta: null,
  sexta: null,
  sabado: null,
});

const periodos = [
  { label: "Manhã", value: "manha", color: "#F59E0B" },
  { label: "Tarde", value: "tarde", color: "#3B82F6" },
  { label: "Noite", value: "noite", color: "#6366F1" },
  { label: "Integral", value: "integral", color: "#10B981" },
];

function togglePeriodo(diaValue, periodoValue) {
  if (selectedPeriodo.value[diaValue] === periodoValue) {
    selectedPeriodo.value[diaValue] = null;
  } else {
    selectedPeriodo.value[diaValue] = periodoValue;
  }
}

function removerPeriodo(diaValue) {
  selectedPeriodo.value[diaValue] = null;
}

// Lista de todas as unidades curriculares disponíveis
const unidadesCurriculares = [
  { nome: "Programação Web", carga: "80h" },
  { nome: "Banco de Dados", carga: "60h" },
  { nome: "Redes de Computadores", carga: "40h" },
  { nome: "Lógica de Programação", carga: "80h" },
  { nome: "Sistemas Operacionais", carga: "40h" },
  { nome: "Segurança da Informação", carga: "40h" },
  { nome: "Desenvolvimento Mobile", carga: "60h" },
  { nome: "Hardware e Manutenção", carga: "40h" },
];

const periodosAulas = [
  "M1",
  "M2",
  "T1",
  "T2",
  "N1",
  "N2",
  "Integral",
  "Manhã",
  "Tarde",
  "Noite",
];

// Controla se o modal está aberto ou fechado
const modalAberto = ref(false);

// Guarda qual dia está sendo editado no momento (ex: "segunda", "terca")
const diaDoModal = ref(null);

// Campo de busca dentro do modal
const buscaUC = ref("");

// Guarda temporariamente as UCs marcadas no modal antes de salvar
const ucsSelecionadasTemp = ref([]);

// Guarda as UCs salvas de cada dia
const ucsSalvas = ref({
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: [],
});

function abrirModal(diaValue) {
  diaDoModal.value = diaValue;
  buscaUC.value = "";
  // Copia as UCs já salvas para a lista temporária
  ucsSelecionadasTemp.value = [...ucsSalvas.value[diaValue]];
  modalAberto.value = true;
}

function salvarUCs() {
  ucsSalvas.value[diaDoModal.value] = [...ucsSelecionadasTemp.value];
  modalAberto.value = false;
}

function fecharModal() {
  modalAberto.value = false;
}

const oppsResponsavel = ref([
  { label: "Opp 1", value: "opp1" },
  { label: "Opp 2", value: "opp2" },
  { label: "Opp 3", value: "opp3" },
  { label: "Opp 4", value: "opp4" },
]);

const selectedOpps = ref([]);
</script>

<template>
  <Menu>
    <div class="flex h-full items-center justify-end gap-4 mt-5">
      <p class="hidden sm:block">Bem vindo, {{ user.name }}!</p>

      <div class="d-flex justify-space-around">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-chevron-down" v-bind="props"></v-icon>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              :value="index"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-avatar :image="user.foto"></v-avatar>
    </div>
  </Menu>

  <div class="flex justify-between mx-50! mt-8">
    <div>
      <p class="text-4xl font-bold">Adicionar Turma</p>
      <p>Preencha as informações necessárias para adicionar uma turma</p>
    </div>
    <div class="hidden lg:flex relative top-4 z-2">
      <img
        src="@/assets/imagemdois.png"
        alt="Desenho de um professor"
        width="200px"
      />
    </div>
  </div>

  <div
    class="border-t-4 border-red-600 mt-3 px-8 rounded-lg shadow-lg py-8 mx-5 md:mx-50! relative z-0 right-5 bottom-0.5"
  >
    <div class="mx-5">
      <div class="lg:flex w-full gap-10">
        <div class="w-full mb-4">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
            Nome da Turma
          </p>
          <v-text-field
            label="Digite o nome..."
            variant="filled"
            hide-details
          ></v-text-field>
        </div>

        <div class="w-full mb-4">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
            Áreas
          </p>
          <v-select
            v-model="selectedAreas"
            chips
            label="Selecione..."
            :items="areasDisponiveis"
            multiple
            variant="filled"
            hide-details
          ></v-select>
        </div>
      </div>

      <div class="lg:flex justify-between items-start gap-10">
        <div class="w-full mb-4">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
            Opp Responsável
          </p>
          <v-select
            v-model="selectedOpps"
            chips
            label="Selecione..."
            :items="oppsResponsavel"
            item-title="label"
            item-value="value"
            multiple
            variant="filled"
            hide-details
          ></v-select>
        </div>

        <div class="">
          <p
            class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            Tipos de Curso
          </p>

          <v-radio-group
            v-model="tipoCurso"
            inline
            hide-details
            density="compact"
          >
            <v-radio
              class="font-bold mr-4"
              label="TÉC"
              value="tec"
              color="red"
            ></v-radio>
            <v-radio
              class="font-bold mr-4"
              label="CAI"
              value="cai"
              color="red"
            ></v-radio>
            <v-radio
              class="font-bold"
              label="FIC"
              value="fic"
              color="red"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>

      <div
        class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 mb-4"
      >
        <div>
          <p
            class="font-bold mt-3.5 lg:mt-0 mb-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Início
          </p>
          <v-text-field
            label="Selecione data"
            type="date"
            variant="filled"
            hide-details
          ></v-text-field>
        </div>

        <div>
          <p class="font-bold mb-2 text-sm text-gray-500 dark:text-gray-400">
            Fim
          </p>
          <v-text-field
            label="Selecione data"
            type="date"
            variant="filled"
            hide-details
          ></v-text-field>
        </div>

        <div>
          <p class="font-bold mb-2 text-sm text-gray-500 dark:text-gray-400">
            Aulas por Semana
          </p>
          <v-text-field
            label="Aulas por semana"
            variant="filled"
            hide-details
            type="number"
          ></v-text-field>
        </div>

        <div>
          <p class="font-bold mb-2 text-sm text-gray-500 dark:text-gray-400">
            Total de Aulas
          </p>
          <v-text-field
            label="Total de aulas"
            variant="filled"
            hide-details
            type="number"
          ></v-text-field>
        </div>
      </div>
    </div>

    <v-divider :thickness="4" class="mx-3 md:flex mt-5"></v-divider>

    <div class="flex mx-5 sm:gap-8">
      <div class="w-full flex flex-col gap-4">
        <p class="mt-3 font-bold text-grey-lighten-1">Dias da Semana</p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div v-for="(dia, index) in diasDaSemana" :key="index">
            <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
              {{ dia.label }}
            </p>
            <v-card
              variant="outlined"
              class="rounded-md pa-4 h-[250px] flex flex-col border-gray-300 dark:border-gray-600"
            >
              <div class="flex-1">
                <div
                  v-if="selectedPeriodo[dia.value]"
                  class="flex flex-col items-center"
                >
                  <!-- Se for Manhã -->
                  <div
                    v-if="selectedPeriodo[dia.value] === 'manha'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-manha"
                  >
                    <v-icon icon="mdi-circle" size="8" color="#F59E0B"></v-icon>
                    <span class="text-sm font-bold" style="color: #333"
                      >Manhã</span
                    >
                    <v-icon
                      icon="mdi-close"
                      size="18"
                      color="#333"
                      class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"
                    ></v-icon>
                  </div>
                  <!-- Se for Tarde -->
                  <div
                    v-else-if="selectedPeriodo[dia.value] === 'tarde'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-tarde"
                  >
                    <v-icon icon="mdi-circle" size="8" color="#3B82F6"></v-icon>
                    <span class="text-sm font-bold" style="color: #333"
                      >Tarde</span
                    >
                    <v-icon
                      icon="mdi-close"
                      size="18"
                      color="#333"
                      class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"
                    ></v-icon>
                  </div>
                  <!-- Se for Noite -->
                  <div
                    v-else-if="selectedPeriodo[dia.value] === 'noite'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-noite"
                  >
                    <v-icon icon="mdi-circle" size="8" color="#6366F1"></v-icon>
                    <span class="text-sm font-bold" style="color: #333"
                      >Noite</span
                    >
                    <v-icon
                      icon="mdi-close"
                      size="18"
                      color="#333"
                      class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"
                    ></v-icon>
                  </div>
                  <!-- Se for Integral -->
                  <div
                    v-else-if="selectedPeriodo[dia.value] === 'integral'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-integral"
                  >
                    <v-icon icon="mdi-circle" size="8" color="#10B981"></v-icon>
                    <span class="text-sm font-bold" style="color: #333"
                      >Integral</span
                    >
                    <v-icon
                      icon="mdi-close"
                      size="18"
                      color="#333"
                      class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"
                    ></v-icon>
                  </div>

                  <div class="w-full px-5">
                    <div
                      class="w-full py-3 px-1 flex flex-col items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                      @click="abrirModal(dia.value)"
                    >
                      <v-icon
                        icon="mdi-plus"
                        size="16"
                        class="text-gray-800 dark:text-white"
                      ></v-icon>
                      <p
                        class="text-[13px] font-bold text-center leading-tight text-gray-800 dark:text-white"
                      >
                        Unidade<br />Curricular
                      </p>
                    </div>
                  </div>

                  <!-- Lista de UCs salvas neste dia com barra de rolagem -->
                  <div
                    v-if="ucsSalvas[dia.value].length > 0"
                    class="w-full mt-3.5 scroll-custom pl-1"
                  >
                    <div
                      v-for="(uc, i) in ucsSalvas[dia.value]"
                      :key="i"
                      class="text-[13px] bg-gray-100 dark:bg-[#414141] rounded px-2 py-1 mb-1 text-gray-700 dark:text-white font-bold"
                    >
                      {{ uc }}
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex flex-col items-center justify-center text-center h-full"
                >
                  <v-avatar
                    color="#F3F3F1"
                    class="dark:bg-[#414141] mb-2"
                    size="40"
                  >
                    <v-icon
                      icon="mdi-clock-outline"
                      size="24"
                      class="text-[#D1D1CB] dark:text-gray-300"
                    ></v-icon>
                  </v-avatar>
                  <p
                    class="text-[13px] font-bold text-gray-500 dark:text-gray-400 leading-tight"
                  >
                    Toque para Selecionar o Periodo
                  </p>
                </div>
              </div>
              <div
                v-if="!selectedPeriodo[dia.value]"
                class="mb-3 space-y-1 text-center pb-4"
              >
                <p
                  v-for="periodo in periodos"
                  :key="periodo.value"
                  class="text-[15px] cursor-pointer font-bold transition-colors text-center"
                  :class="{
                    'text-manha':
                      selectedPeriodo[dia.value] === 'manha' &&
                      periodo.value === 'manha',
                    'text-tarde':
                      selectedPeriodo[dia.value] === 'tarde' &&
                      periodo.value === 'tarde',
                    'text-noite':
                      selectedPeriodo[dia.value] === 'noite' &&
                      periodo.value === 'noite',
                    'text-integral':
                      selectedPeriodo[dia.value] === 'integral' &&
                      periodo.value === 'integral',
                    'text-gray-800 dark:text-white':
                      selectedPeriodo[dia.value] !== periodo.value,
                  }"
                  @click="togglePeriodo(dia.value, periodo.value)"
                >
                  {{ periodo.label }}
                </p>
              </div>
            </v-card>
          </div>
        </div>
      </div>

      <!-- <div class="mb-4 mt-5">
        <div class="hidden lg:block md:row-span-1 lg:row-span-2 min-w-[250px]">
          <v-card class="mt-4 border-t-6 border-red-600 p-5 shadow-lg h-fit">
            <div class="flex items-center gap-3 mb-2">
              <v-icon
                size="36"
                icon="mdi-book-open-outline"
                color="grey-darken-3"
              ></v-icon>
              <h2 class="text-lg font-medium text-grey-darken-3">Legenda</h2>
            </div>

            <div class="space-y-4">
              <div>
                <p class="font-bold mb-1">Manhã</p>
                <ul class="list-none space-y-1 ml-2">
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>M01</b> &rarr; Antes
                    do intervalo
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>M02</b> &rarr;
                    Depois do intervalo
                  </li>
                </ul>
              </div>

              <v-divider class="opacity-100"></v-divider>

              <div>
                <p class="font-bold mb-1">Tarde</p>
                <ul class="list-none space-y-1 ml-2">
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>T01</b> &rarr; Antes
                    do intervalo
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>T02</b> &rarr;
                    Depois do intervalo
                  </li>
                </ul>
              </div>

              <v-divider class="opacity-100"></v-divider>

              <div>
                <p class="font-bold mb-1">Noite</p>
                <ul class="list-none space-y-1 ml-2">
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>N01</b> &rarr; Antes
                    do intervalo
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>N02</b> &rarr;
                    Depois do intervalo
                  </li>
                </ul>
              </div>

              <v-divider class="opacity-100"></v-divider>

              <div>
                <p class="font-bold mb-1">Integral</p>
                <ul class="list-none space-y-1 ml-2">
                  <li class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">•</span> <b>INT</b> &rarr;
                    Integral
                  </li>
                </ul>
              </div>
            </div>
          </v-card>
        </div>
      </div> -->
    </div>
  </div>

  <div class="flex justify-end gap-4 mt-5 mx-5 md:mx-50! mb-10">
    <v-btn variant="outlined" color="red">Cancelar</v-btn>
    <v-btn color="red" class="bg-red-600 text-white">Adicionar Turma</v-btn>
  </div>

  <!-- Modal de Unidade Curricular -->
  <v-dialog v-model="modalAberto" max-width="500">
    <v-card class="pa-5 rounded-xl">
      <v-card-title class="text-lg font-bold"
        >Selecionar Unidades Curriculares</v-card-title
      >

      <!-- Campo de busca -->
      <v-text-field
        v-model="buscaUC"
        label="Buscar unidade curricular..."
        variant="filled"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="mb-4"
      ></v-text-field>

      <!-- Lista de UCs com checkboxes -->
      <div style="max-height: 300px; overflow-y: auto">
        <div v-for="(uc, index) in unidadesCurriculares" :key="index">
          <!-- Só mostra se o nome bate com a busca -->
          <div v-if="uc.nome.toLowerCase().includes(buscaUC.toLowerCase())">
            <v-checkbox
              v-model="ucsSelecionadasTemp"
              :label="uc.nome + ' (' + uc.carga + ')'"
              :value="uc.nome"
              color="red"
              hide-details
              density="compact"
            ></v-checkbox>
          </div>
        </div>
      </div>

      <!-- Botões do modal -->
      <v-card-actions class="justify-end mt-4">
        <v-btn variant="text" @click="fecharModal()">Cancelar</v-btn>
        <v-btn color="red" class="bg-red-600 text-white" @click="salvarUCs()"
          >Salvar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Estilos para o fundo e bordas dos chips selecionados */
.bg-manha {
  background-color: #fef3c7; /* Amarelo clarinho */
  border-color: #f59e0b;
}
.dark .bg-manha {
  background-color: rgba(245, 158, 11, 0.2);
}

.bg-tarde {
  background-color: #dbeafe; /* Azul clarinho */
  border-color: #3b82f6;
}
.dark .bg-tarde {
  background-color: rgba(59, 130, 246, 0.2);
}

.bg-noite {
  background-color: #e0e7ff; /* Roxo/Indigo clarinho */
  border-color: #6366f1;
}
.dark .bg-noite {
  background-color: rgba(99, 102, 241, 0.2);
}

.bg-integral {
  background-color: #d1fae5; /* Verde clarinho */
  border-color: #10b981;
}
.dark .bg-integral {
  background-color: rgba(16, 185, 129, 0.2);
}

.dark .bg-manha span,
.dark .bg-tarde span,
.dark .bg-noite span,
.dark .bg-integral span,
.dark .bg-manha .v-icon,
.dark .bg-tarde .v-icon,
.dark .bg-noite .v-icon,
.dark .bg-integral .v-icon {
  color: white !important;
}

/* Estilos para as cores dos textos dos períodos */
.text-manha {
  color: #f59e0b;
}
.text-tarde {
  color: #3b82f6;
}
.text-noite {
  color: #6366f1;
}
.text-integral {
  color: #10b981;
}

/* Barra de rolagem personalizada para a lista de UCs no card */
.scroll-custom {
  max-height: 100px; /* Ajustado para o card de 250px */
  overflow-y: auto; /* Volta a aparecer só quando necessário */
  padding-right: 4px;
}

/* Deixar a barra de rolagem elegante e discreta */
.scroll-custom::-webkit-scrollbar {
  width: 4px; /* Mais fininha */
}
.scroll-custom::-webkit-scrollbar-thumb {
  background-color: #bdbdbd;
  border-radius: 10px;
}
.scroll-custom::-webkit-scrollbar-track {
  background: transparent; /* Fundo transparente para ficar mais limpo */
}
</style>
