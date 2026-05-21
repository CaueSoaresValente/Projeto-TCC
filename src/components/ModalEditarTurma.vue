<script setup>
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  turma: Object,
});

const emit = defineEmits(["update:modelValue", "save"]);

const form = ref({
  label: "",
  idArea: null,
  modalidade: "tec",
  idOPP: null,
  dataInicio: "",
  dataFim: "",
  aulasSemana: 0,
  totalAulas: 0,
});

const todosOpps = ref([]);
const oppsList = ref([]);
const areasDisponiveis = ref([]);
const unidadesCurriculares = ref([]);

async function carregarAreas() {
  try {
    const response = await fetch("http://localhost:3001/api/areas");
    const data = await response.json();
    areasDisponiveis.value = data.map(area => ({
      title: area.nome,
      value: area.idArea
    }));
  } catch (error) {
    console.error("Erro ao carregar áreas:", error);
  }
}

async function carregarOpps() {
  try {
    const response = await fetch("http://localhost:3001/api/opps");
    const data = await response.json();
    todosOpps.value = data;
    filtrarOpps();
  } catch (error) {
    console.error("Erro ao carregar OPPs:", error);
  }
}

function filtrarOpps() {
  const areaId = form.value.idArea;
  if (!areaId) {
    oppsList.value = [];
    return;
  }
  const oppsFiltrados = todosOpps.value.filter(opp => {
    return opp.oppAreas && opp.oppAreas.some(oa => oa.idArea === areaId);
  });
  oppsList.value = oppsFiltrados.map(opp => ({
    label: opp.cadastro.nome,
    value: opp.idOPP
  }));
}

async function carregarUCs() {
  const areaId = form.value.idArea;
  if (!areaId) {
    unidadesCurriculares.value = [];
    return;
  }
  try {
    const response = await fetch(`http://localhost:3001/api/competencias/area/${areaId}`);
    const data = await response.json();
    unidadesCurriculares.value = data.map(uc => {
      let carga = "";
      if (uc.descricao) {
        const match = uc.descricao.match(/(\d+h)/i);
        if (match) {
          carga = match[1];
        }
      }
      return {
        nome: uc.nome,
        carga: carga || undefined
      };
    });
  } catch (error) {
    console.error("Erro ao carregar UCs por área:", error);
    unidadesCurriculares.value = [];
  }
}

// Observa mudanças na área para filtrar OPPs e UCs
watch(() => form.value.idArea, (novaAreaId, antigaAreaId) => {
  filtrarOpps();
  carregarUCs();
  // Limpa a seleção de OPP e UCs apenas se for uma troca intencional (antigaAreaId !== undefined)
  if (antigaAreaId !== undefined && antigaAreaId !== null && novaAreaId !== antigaAreaId) {
    form.value.idOPP = null;
    Object.keys(ucsSalvas.value).forEach(dia => {
      ucsSalvas.value[dia] = [];
    });
  }
});

onMounted(() => {
  carregarAreas();
  carregarOpps();
});

const selectedPeriodo = ref({
  segunda: null,
  terca: null,
  quarta: null,
  quinta: null,
  sexta: null,
  sabado: null,
});

const ucsSalvas = ref({
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: [],
});

// Áreas carregadas dinamicamente
const periodos = [
  { label: "Manhã", value: "manha", color: "#F59E0B" },
  { label: "Tarde", value: "tarde", color: "#3B82F6" },
  { label: "Noite", value: "noite", color: "#6366F1" },
  { label: "Integral", value: "INT", color: "#10B981" },
];

// Controla quais dias estão mostrando o sub-menu de Integral
const integralSubMenu = ref({
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
  sabado: false,
});

// Labels bonitos para exibir no badge do card
const integralLabels = {
  'INT_MT': 'Manhã + Tarde',
  'INT_MN': 'Manhã + Noite',
  'INT_TN': 'Tarde + Noite',
};

// Helper: verifica se um período é do tipo integral
function isIntegral(periodo) {
  return periodo && periodo.startsWith('INT_');
}

const diasDaSemana = [
  { label: "Segunda-feira", value: "segunda" },
  { label: "Terça-feira", value: "terca" },
  { label: "Quarta-feira", value: "quarta" },
  { label: "Quinta-feira", value: "quinta" },
  { label: "Sexta-feira", value: "sexta" },
  { label: "Sábado", value: "sabado" },
];

// Unidades Curriculares carregadas dinamicamente

const modalUC = ref(false);
const diaDoModal = ref(null);

// Observa mudanças na turma para preencher o formulário
watch(() => props.turma, (newTurma) => {
  if (newTurma) {
    form.value = {
      label: newTurma.label,
      idArea: newTurma.idArea || null,
      modalidade: newTurma.modalidade,
      idOPP: newTurma.idOPP || null,
      dataInicio: newTurma.dataInicioISO || newTurma.dataInicio || "",
      dataFim: newTurma.dataTerminoISO || newTurma.dataFim || "",
      aulasSemana: newTurma.aulasSemana || 4,
      totalAulas: newTurma.totalAulas || 16,
    };

    // Mapear a grade existente para o formato do addTurmas
    resetPeriodos();
    if (newTurma.grade) {
      newTurma.grade.forEach(slot => {
        const p = slot.periodo;
        const pLower = p.toLowerCase();
        const diaMap = { 'Seg': 'segunda', 'Ter': 'terca', 'Qua': 'quarta', 'Qui': 'quinta', 'Sex': 'sexta', 'Sáb': 'sabado' };

        Object.keys(slot.aulas || {}).forEach(dia => {
          const diaKey = diaMap[dia];
          if (diaKey) {
            // Mapeia os sub-tipos de integral corretamente
            if (p === 'INT_MT' || p === 'INT_MN' || p === 'INT_TN') {
              selectedPeriodo.value[diaKey] = p;
            } else if (pLower.includes('integral') || p === 'INT') {
              selectedPeriodo.value[diaKey] = 'INT_MT'; // Integral padrão = Manhã+Tarde
            } else if (pLower.startsWith('m')) selectedPeriodo.value[diaKey] = 'manha';
            else if (pLower.startsWith('t')) selectedPeriodo.value[diaKey] = 'tarde';
            else if (pLower.startsWith('n')) selectedPeriodo.value[diaKey] = 'noite';

            if (!ucsSalvas.value[diaKey].some(item => item.uc === slot.aulas[dia].disciplina)) {
              ucsSalvas.value[diaKey].push({ uc: slot.aulas[dia].disciplina, periodo: slot.periodo });
            }
          }
        });
      });
    }
  }
}, { immediate: true });

function resetPeriodos() {
  Object.keys(selectedPeriodo.value).forEach(k => selectedPeriodo.value[k] = null);
  Object.keys(ucsSalvas.value).forEach(k => ucsSalvas.value[k] = []);
}

function togglePeriodo(diaValue, periodoValue) {
  // Se clicou em "Integral", abre o sub-menu ao invés de selecionar direto
  if (periodoValue === 'INT') {
    integralSubMenu.value[diaValue] = !integralSubMenu.value[diaValue];
    return;
  }

  integralSubMenu.value[diaValue] = false;

  if (selectedPeriodo.value[diaValue] === periodoValue) {
    selectedPeriodo.value[diaValue] = null;
  } else {
    selectedPeriodo.value[diaValue] = periodoValue;
  }
  // Limpa as UCs salvas daquele dia se o usuário mudar o turno
  ucsSalvas.value[diaValue] = [];
}

// Quando o usuário escolhe uma das 3 combinações de Integral
function selecionarIntegral(diaValue, tipo) {
  integralSubMenu.value[diaValue] = false;
  selectedPeriodo.value[diaValue] = tipo; // 'INT_MT', 'INT_MN' ou 'INT_TN'
  ucsSalvas.value[diaValue] = [];
}

function removerPeriodo(diaValue) {
  selectedPeriodo.value[diaValue] = null;
  integralSubMenu.value[diaValue] = false;
  ucsSalvas.value[diaValue] = [];
}

const ucsSelecionadasTemp = ref([]); // Array de objetos { uc, periodo }

function abrirModalUC(diaValue) {
  diaDoModal.value = diaValue;
  buscaUC.value = "";
  // Clone da lista atual para edição temporária
  ucsSelecionadasTemp.value = ucsSalvas.value[diaValue].map(item => ({ ...item }));
  modalUC.value = true;
}

// Campo de busca dentro do modal
const buscaUC = ref("");

// Períodos disponíveis calculados dinamicamente com base no período do dia selecionado
const periodosDisponiveisParaOModal = computed(() => {
  const periodoDoDiaSelecionado = selectedPeriodo.value[diaDoModal.value];

  if (periodoDoDiaSelecionado === 'manha') {
    return ['M01', 'M02', 'Manhã'];
  } else if (periodoDoDiaSelecionado === 'tarde') {
    return ['T01', 'T02', 'Tarde'];
  } else if (periodoDoDiaSelecionado === 'noite') {
    return ['N01', 'N02', 'Noite'];
  } else if (periodoDoDiaSelecionado === 'INT_MT') {
    // INTEGRAL Manhã+Tarde: opção integral primeiro, depois sub-slots
    return ['Manhã + Tarde', 'M01', 'M02', 'Manhã', 'T01', 'T02', 'Tarde'];
  } else if (periodoDoDiaSelecionado === 'INT_MN') {
    // INTEGRAL Manhã+Noite
    return ['Manhã + Noite', 'M01', 'M02', 'Manhã', 'N01', 'N02', 'Noite'];
  } else if (periodoDoDiaSelecionado === 'INT_TN') {
    // INTEGRAL Tarde+Noite
    return ['Tarde + Noite', 'T01', 'T02', 'Tarde', 'N01', 'N02', 'Noite'];
  }

  return [];
});

// Calcula quais períodos estão disponíveis para uma UC específica,
// bloqueando opções conflitantes já usadas por outras UCs
function periodosDisponiveisPara(ucNome) {
  const basePeriodos = periodosDisponiveisParaOModal.value;
  const outrasUcs = ucsSelecionadasTemp.value.filter(item => item.uc !== ucNome && item.periodo);

  // Tabela de conflitos BIDIRECIONAL:
  // Se alguém escolheu "Manhã", bloqueia M01, M02 E as combinações integrais.
  // Se alguém escolheu "Manhã + Tarde", bloqueia TODOS os slots individuais.
  const conflitosGlobais = {
    'Manhã': ['M01', 'M02', 'Manhã + Tarde', 'Manhã + Noite'],
    'M01': ['Manhã', 'Manhã + Tarde', 'Manhã + Noite'],
    'M02': ['Manhã', 'Manhã + Tarde', 'Manhã + Noite'],
    'Tarde': ['T01', 'T02', 'Manhã + Tarde', 'Tarde + Noite'],
    'T01': ['Tarde', 'Manhã + Tarde', 'Tarde + Noite'],
    'T02': ['Tarde', 'Manhã + Tarde', 'Tarde + Noite'],
    'Noite': ['N01', 'N02', 'Manhã + Noite', 'Tarde + Noite'],
    'N01': ['Noite', 'Manhã + Noite', 'Tarde + Noite'],
    'N02': ['Noite', 'Manhã + Noite', 'Tarde + Noite'],
    'Manhã + Tarde': ['M01', 'M02', 'Manhã', 'T01', 'T02', 'Tarde'],
    'Manhã + Noite': ['M01', 'M02', 'Manhã', 'N01', 'N02', 'Noite'],
    'Tarde + Noite': ['T01', 'T02', 'Tarde', 'N01', 'N02', 'Noite'],
  };

  const periodosBloqueados = new Set();

  outrasUcs.forEach(item => {
    // Bloqueia o exato mesmo período (ninguém pode repetir)
    periodosBloqueados.add(item.periodo);
    // Bloqueia os períodos conflitantes (genérico vs granular)
    const conflitosDesseItem = conflitosGlobais[item.periodo] || [];
    conflitosDesseItem.forEach(c => periodosBloqueados.add(c));
  });

  return basePeriodos.filter(p => !periodosBloqueados.has(p));
}

function toggleUCSelection(ucNome) {
    const index = ucsSelecionadasTemp.value.findIndex(item => item.uc === ucNome);
    if (index > -1) {
        ucsSelecionadasTemp.value.splice(index, 1);
    } else {
        ucsSelecionadasTemp.value.push({ uc: ucNome, periodo: "" });
    }
    // Força reatividade no Vue
    ucsSelecionadasTemp.value = [...ucsSelecionadasTemp.value];
}

function isUCSelected(ucNome) {
    return ucsSelecionadasTemp.value.some(item => item.uc === ucNome);
}

function getSelectedUCPeriod(ucNome) {
    const item = ucsSelecionadasTemp.value.find(item => item.uc === ucNome);
    return item ? item.periodo : "";
}

function updateUCPeriod(ucNome, periodo) {
    // Validação: Impede seleção de período bloqueado por conflito
    if (periodo !== "") {
      const disponiveis = periodosDisponiveisPara(ucNome);
      if (!disponiveis.includes(periodo)) {
        alert(`Erro: O período '${periodo}' não pode ser selecionado devido a um conflito de horário com outra matéria já marcada.`);
        return;
      }
    }

    const item = ucsSelecionadasTemp.value.find(item => item.uc === ucNome);
    if (item) {
      item.periodo = periodo;
      // Recria o array para forçar o Vue a re-renderizar
      ucsSelecionadasTemp.value = [...ucsSelecionadasTemp.value];
    }
}

function salvarUCs() {
  const ucsSemPeriodo = ucsSelecionadasTemp.value.filter(item => !item.periodo);
  if (ucsSemPeriodo.length > 0) {
    alert("Por favor, selecione o período para todas as unidades curriculares marcadas.");
    return;
  }
  ucsSalvas.value[diaDoModal.value] = [...ucsSelecionadasTemp.value];
  modalUC.value = false;
}

// Extrair professores únicos da turma
const getProfessores = () => {
  if (!props.turma || !props.turma.grade) return [];
  const profs = new Set();
  props.turma.grade.forEach(slot => {
    Object.values(slot.aulas || {}).forEach(aula => {
      if (aula.professor) profs.add(aula.professor);
    });
  });
  return Array.from(profs);
};

function removerProfessor(nome) {
  if (!props.turma || !props.turma.grade) return;
  props.turma.grade.forEach(slot => {
    Object.keys(slot.aulas || {}).forEach(dia => {
      if (slot.aulas[dia].professor === nome) {
        slot.aulas[dia].professor = "";
      }
    });
  });
}

const periodoDescricoes = {
  'M01': 'Manhã - Antes do intervalo',
  'M02': 'Manhã - Depois do intervalo',
  'T01': 'Tarde - Antes do intervalo',
  'T02': 'Tarde - Depois do intervalo',
  'N01': 'Noite - Antes do intervalo',
  'N02': 'Noite - Depois do intervalo',
  'Manhã': 'Período da Manhã',
  'Tarde': 'Período da Tarde',
  'Noite': 'Período da Noite',
  'INT': 'Período Integral',
  'Integral': 'Período Integral'
};

// Valida que todos os turnos de um dia integral estão cobertos pelas UCs
const diasLabels = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
};

function validarCoberturaIntegral() {
  const erros = [];

  const turnosExigidos = {
    'INT_MT': {
      turno1: { nome: 'Manhã', periodos: ['M01', 'M02', 'Manhã', 'Manhã + Tarde'] },
      turno2: { nome: 'Tarde', periodos: ['T01', 'T02', 'Tarde', 'Manhã + Tarde'] },
    },
    'INT_MN': {
      turno1: { nome: 'Manhã', periodos: ['M01', 'M02', 'Manhã', 'Manhã + Noite'] },
      turno2: { nome: 'Noite', periodos: ['N01', 'N02', 'Noite', 'Manhã + Noite'] },
    },
    'INT_TN': {
      turno1: { nome: 'Tarde', periodos: ['T01', 'T02', 'Tarde', 'Tarde + Noite'] },
      turno2: { nome: 'Noite', periodos: ['N01', 'N02', 'Noite', 'Tarde + Noite'] },
    },
  };

  for (const [dia, periodo] of Object.entries(selectedPeriodo.value)) {
    if (!periodo || !turnosExigidos[periodo]) continue;

    const ucsNoDia = ucsSalvas.value[dia] || [];
    const periodosUsados = ucsNoDia.map(uc => uc.periodo);
    const exigencias = turnosExigidos[periodo];

    const temTurno1 = exigencias.turno1.periodos.some(p => periodosUsados.includes(p));
    const temTurno2 = exigencias.turno2.periodos.some(p => periodosUsados.includes(p));

    const faltando = [];
    if (!temTurno1) faltando.push(exigencias.turno1.nome);
    if (!temTurno2) faltando.push(exigencias.turno2.nome);

    if (faltando.length > 0) {
      erros.push(`• ${diasLabels[dia]}: Faltam UCs no período da ${faltando.join(' e ')}. O dia integral exige cobertura de ${exigencias.turno1.nome} e ${exigencias.turno2.nome}.`);
    }
  }

  return erros;
}

function salvar() {
  // Validação de cobertura integral: se o dia é integral, TODOS os turnos precisam ser cobertos
  const errosCobertura = validarCoberturaIntegral();
  if (errosCobertura.length > 0) {
    alert("Erro na grade semanal:\n\n" + errosCobertura.join("\n"));
    return;
  }

  const horarios = [];
  for (const [diaSemana, listaUcs] of Object.entries(ucsSalvas.value)) {
    for (const ucItem of listaUcs) {
      if (!ucItem.periodo) continue;
      horarios.push({
        diaSemana,
        periodo: ucItem.periodo,
        nomeUC: ucItem.uc,
      });
    }
  }

  emit("save", {
    ...form.value,
    horarios,
  });
}

</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="1200"
    scrollable>
    <v-card class="rounded-xl overflow-hidden">
      <v-toolbar color="red-darken-2" dark>
        <v-toolbar-title class="font-bold">Editar Turma: {{ turma?.label }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu open-on-hover location="bottom" offset="10">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mr-2">
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
          </template>

          <v-card class="p-5 shadow-2xl rounded-xl dark:bg-gray-800 border-t-4 border-red-600" width="280">
            <div class="flex items-center gap-3 mb-4">
              <v-icon size="24" icon="mdi-book-open-outline" color="red"></v-icon>
              <h2 class="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tighter">Legenda</h2>
            </div>

            <div class="space-y-4">
              <div>
                <p class="font-black text-xs text-gray-400 uppercase mb-2">Manhã</p>
                <ul class="list-none space-y-1 ml-1">
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>M01</b> &rarr; Antes do intervalo
                  </li>
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>M02</b> &rarr; Depois do intervalo
                  </li>
                </ul>
              </div>

              <v-divider></v-divider>

              <div>
                <p class="font-black text-xs text-gray-400 uppercase mb-2">Tarde</p>
                <ul class="list-none space-y-1 ml-1">
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>T01</b> &rarr; Antes do intervalo
                  </li>
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>T02</b> &rarr; Depois do intervalo
                  </li>
                </ul>
              </div>

              <v-divider></v-divider>

              <div>
                <p class="font-black text-xs text-gray-400 uppercase mb-2">Noite</p>
                <ul class="list-none space-y-1 ml-1">
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>N01</b> &rarr; Antes do intervalo
                  </li>
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>N02</b> &rarr; Depois do intervalo
                  </li>
                </ul>
              </div>

              <v-divider></v-divider>

              <div>
                <p class="font-black text-xs text-gray-400 uppercase mb-2">Integral</p>
                <ul class="list-none space-y-1 ml-1">
                  <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    <span class="text-red-500">•</span> <b>INT</b> &rarr; Integral
                  </li>
                </ul>
              </div>
            </div>
          </v-card>
        </v-menu>

        <v-btn icon @click="emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6 bg-gray-50 dark:bg-gray-900">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Coluna Esquerda: Info Básica -->
          <div
            class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <v-icon color="red">mdi-information-outline</v-icon> Informações Gerais
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Nome da Turma</p>
                <v-text-field v-model="form.label" variant="filled" density="compact" hide-details></v-text-field>
              </div>
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Áreas</p>
                <v-select v-model="form.idArea" :items="areasDisponiveis" item-title="title" item-value="value" variant="filled"
                  density="compact" hide-details placeholder="Selecione..." persistent-placeholder></v-select>
              </div>
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Opp Responsável</p>
                <v-select v-model="form.idOPP" :items="oppsList" item-title="label" item-value="value"
                  variant="filled" density="compact" hide-details :disabled="!form.idArea"
                  placeholder="Selecione uma Área primeiro..." persistent-placeholder></v-select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Tipo de Curso</p>
                <v-radio-group v-model="form.modalidade" inline hide-details density="compact">
                  <v-radio label="TÉC" value="tec" color="red" class="me-3"></v-radio>
                  <v-radio label="CAI" value="cai" color="red" class="me-3"></v-radio>
                  <v-radio label="FIC" value="fic" color="red" class="me-3"></v-radio>
                </v-radio-group>
              </div>

            </div>
          </div>

          <!-- Coluna Direita: Professores e Datas -->
          <div
            class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <v-icon color="red">mdi-account-group-outline</v-icon> Professores e Datas
            </h3>

            <div class="mb-4">
              <p class="mb-2 font-bold text-xs text-gray-500 uppercase">Professores Adicionados</p>
              <div class="flex flex-wrap gap-2">
                <v-chip v-for="prof in getProfessores()" :key="prof" size="small" color="red" variant="tonal"
                  class="font-bold" closable @click:close="removerProfessor(prof)">
                  <v-avatar start icon="mdi-account" color="red-lighten-4"></v-avatar>
                  {{ prof }}
                </v-chip>
                <v-chip v-if="getProfessores().length === 0" size="small" variant="text">Nenhum professor
                  vinculado</v-chip>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Data Início</p>
                <v-text-field v-model="form.dataInicio" type="date" variant="filled" density="compact"
                  hide-details></v-text-field>
              </div>
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Data Fim</p>
                <v-text-field v-model="form.dataFim" type="date" variant="filled" density="compact"
                  hide-details></v-text-field>
              </div>
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Aulas/Semana</p>
                <v-text-field v-model="form.aulasSemana" type="number" variant="filled" density="compact"
                  hide-details readonly></v-text-field>
              </div>
              <div>
                <p class="mb-1 font-bold text-xs text-gray-500 uppercase">Total de Aulas</p>
                <v-text-field v-model="form.totalAulas" type="number" variant="filled" density="compact"
                  hide-details readonly></v-text-field>
              </div>
            </div>
          </div>
        </div>

        <!-- Grade Semanal (Estilo addTurmas) -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold border-b pb-2 mb-6 flex items-center gap-2">
            <v-icon color="red">mdi-calendar-clock</v-icon> Planejamento de Dias e Horários
          </h3>

          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div v-for="dia in diasDaSemana" :key="dia.value">
              <p class="mb-2 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase text-center">
                {{ dia.label }}
              </p>
              <v-card variant="outlined"
                class="rounded-lg pa-3 h-[280px] flex flex-col border-gray-200 dark:border-gray-700">
                <div class="flex-1">
                  <!-- Período Selecionado -->
                  <div v-if="selectedPeriodo[dia.value]" class="w-full mb-3">
                    <!-- Se for Manhã -->
                    <div v-if="selectedPeriodo[dia.value] === 'manha'"
                      class="rounded-lg py-1.5 px-3 flex items-center justify-between border bg-amber-50 border-amber-200 text-amber-700">
                      <div class="flex items-center gap-1">
                        <v-icon icon="mdi-circle" size="8" color="#F59E0B"></v-icon>
                        <span class="text-xs font-bold">Manhã</span>
                      </div>
                      <v-icon icon="mdi-close" size="14" class="cursor-pointer"
                        @click="removerPeriodo(dia.value)"></v-icon>
                    </div>
                    <!-- Se for Tarde -->
                    <div v-else-if="selectedPeriodo[dia.value] === 'tarde'"
                      class="rounded-lg py-1.5 px-3 flex items-center justify-between border bg-blue-50 border-blue-200 text-blue-700">
                      <div class="flex items-center gap-1">
                        <v-icon icon="mdi-circle" size="8" color="#3B82F6"></v-icon>
                        <span class="text-xs font-bold">Tarde</span>
                      </div>
                      <v-icon icon="mdi-close" size="14" class="cursor-pointer"
                        @click="removerPeriodo(dia.value)"></v-icon>
                    </div>
                    <!-- Se for Noite -->
                    <div v-else-if="selectedPeriodo[dia.value] === 'noite'"
                      class="rounded-lg py-1.5 px-3 flex items-center justify-between border bg-indigo-50 border-indigo-200 text-indigo-700">
                      <div class="flex items-center gap-1">
                        <v-icon icon="mdi-circle" size="8" color="#6366F1"></v-icon>
                        <span class="text-xs font-bold">Noite</span>
                      </div>
                      <v-icon icon="mdi-close" size="14" class="cursor-pointer"
                        @click="removerPeriodo(dia.value)"></v-icon>
                    </div>
                    <!-- Se for Integral (qualquer combinação) -->
                    <div v-else-if="isIntegral(selectedPeriodo[dia.value])"
                      class="rounded-lg py-1.5 px-3 flex items-center justify-between border bg-emerald-50 border-emerald-200 text-emerald-700">
                      <div class="flex items-center gap-1">
                        <v-icon icon="mdi-circle" size="8" color="#10B981"></v-icon>
                        <span class="text-[11px] font-bold">{{ integralLabels[selectedPeriodo[dia.value]] }}</span>
                      </div>
                      <v-icon icon="mdi-close" size="14" class="cursor-pointer"
                        @click="removerPeriodo(dia.value)"></v-icon>
                    </div>

                    <div class="px-2">
                      <v-btn block variant="tonal" size="small" class="mt-3" @click="abrirModalUC(dia.value)">
                        <v-icon start size="small">mdi-plus</v-icon> UC
                      </v-btn>
                    </div>

                    <div class="mt-3 space-y-1 scroll-custom max-h-[184px] overflow-y-auto px-2">
                      <div v-for="(item, i) in ucsSalvas[dia.value]" :key="i"
                        class="text-[11px] bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 flex justify-between items-center group">
                        <div class="flex-1 flex justify-between items-center pr-1">
                          <span class="dark:text-white font-bold leading-tight">{{ item.uc }}</span>
                          <span class="font-bold text-red-600 ml-2 whitespace-nowrap">{{ item.periodo }}</span>
                        </div>
                        <v-icon icon="mdi-close" size="12" class="cursor-pointer opacity-0 group-hover:opacity-100" @click="ucsSalvas[dia.value].splice(i, 1)"></v-icon>
                      </div>
                    </div>
                  </div>

                  <!-- Seletor de Período -->
                  <div v-else class="flex flex-col items-center justify-center text-center h-full">
                    <v-avatar color="#F3F3F1" class="dark:bg-gray-700 mb-2" size="40">
                      <v-icon icon="mdi-clock-outline" size="24" class="text-gray-300 dark:text-gray-400"></v-icon>
                    </v-avatar>
                    <p class="text-[13px] font-bold text-gray-500 dark:text-gray-400 leading-tight mb-4">
                      Toque para Selecionar o Periodo
                    </p>
                    <div class="w-full space-y-1">
                      <!-- Menu principal: Manhã, Tarde, Noite, Integral -->
                      <template v-if="!integralSubMenu[dia.value]">
                        <v-btn v-for="p in periodos" :key="p.value" block variant="text" size="small"
                          class="font-bold text-[15px] dark:text-white capitalize transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                          @click="togglePeriodo(dia.value, p.value)">
                          {{ p.label }}
                        </v-btn>
                      </template>
                      <!-- Sub-menu do Integral: 3 combinações -->
                      <template v-else>
                        <p class="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Qual Integral?</p>
                        <p class="text-[14px] cursor-pointer font-bold text-emerald-600 hover:underline" @click="selecionarIntegral(dia.value, 'INT_MT')">
                          Manhã + Tarde
                        </p>
                        <p class="text-[14px] cursor-pointer font-bold text-emerald-600 hover:underline" @click="selecionarIntegral(dia.value, 'INT_MN')">
                          Manhã + Noite
                        </p>
                        <p class="text-[14px] cursor-pointer font-bold text-emerald-600 hover:underline" @click="selecionarIntegral(dia.value, 'INT_TN')">
                          Tarde + Noite
                        </p>
                        <p class="text-[12px] cursor-pointer font-bold text-gray-400 hover:text-gray-600 mt-1" @click="integralSubMenu[dia.value] = false">
                          ← Voltar
                        </p>
                      </template>
                    </div>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-gray-50 dark:bg-gray-800">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="red-darken-1" class="bg-red-600 text-white px-6" @click="salvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="modalUC" max-width="520">
      <v-card class="pa-5 rounded-xl">
        <v-card-title class="text-lg font-bold">Selecionar Unidades Curriculares</v-card-title>

        <!-- Campo de busca -->
        <v-text-field v-model="buscaUC" label="Buscar unidade curricular..." variant="filled" hide-details
          prepend-inner-icon="mdi-magnify" class="mb-4"></v-text-field>

        <!-- Lista de UCs com checkboxes + período -->
        <div style="max-height: 350px; overflow-y: auto" class="pr-1">
          <div v-for="(uc, index) in unidadesCurriculares" :key="index">
            <div v-if="uc.nome.toLowerCase().includes(buscaUC.toLowerCase())"
              class="flex items-center gap-2 mb-2 pb-2 px-4">
              <v-checkbox :model-value="isUCSelected(uc.nome)" @update:model-value="toggleUCSelection(uc.nome)"
                :label="uc.carga ? uc.nome + ' (' + uc.carga + ')' : uc.nome" color="red" hide-details density="compact"
                :disabled="!isUCSelected(uc.nome) && periodosDisponiveisPara(uc.nome).length === 0"
                class="flex-1"></v-checkbox>
              <v-select v-if="isUCSelected(uc.nome)" :model-value="getSelectedUCPeriod(uc.nome)"
                @update:model-value="updateUCPeriod(uc.nome, $event)" :items="periodosDisponiveisPara(uc.nome)" label="Período"
                variant="outlined" density="compact" hide-details class="max-w-[130px] mt-2"></v-select>
            </div>
          </div>
        </div>

        <!-- Botões do modal -->
        <v-card-actions class="justify-end mt-4">
          <v-btn variant="text" @click="modalUC = false">Cancelar</v-btn>
          <v-btn color="red" class="bg-red-600 text-white" @click="salvarUCs">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
