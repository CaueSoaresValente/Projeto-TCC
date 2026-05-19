<script setup>
import Menu from "@/components/Menu.vue";
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { criarTurma, listarUCsPorArea } from "@/services/api";

const user = ref({
  name: "User",
  foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

// Itens do menu dropdown do avatar (Padronizado)
const items = ref([
  { title: "Meu Perfil", icon: "mdi-account-outline" },
  { title: "Sair", icon: "mdi-logout" },
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
  

];

// DIDÁTICA: Mudamos de um array [] para null, pois agora o usuário escolhe APENAS UMA área
const router = useRouter();

// DIDÁTICA: Variável para capturar o nome digitado no input
const nomeTurma = ref("");

// DIDÁTICA: Variáveis para datas
const dataInicio = ref("");
const dataFim = ref("");

// Cálculo para a data mínima permitida (Amanhã)
const dataAmanha = computed(() => {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  return amanha.toISOString().split("T")[0]; // formato YYYY-MM-DD
});

// Aulas por semana (somatória dos dias escolhidos)
const aulasPorSemana = computed(() => {
  return Object.values(selectedPeriodo.value).filter(val => val !== null).length;
});

// Total de aulas no semestre/período (ocorrências dos dias escolhidos entre a data início e fim)
const totalAulas = computed(() => {
  if (!dataInicio.value || !dataFim.value) return 0;
  
  const startDate = new Date(dataInicio.value + "T00:00:00");
  const endDate = new Date(dataFim.value + "T00:00:00");
  
  if (startDate > endDate) return 0;

  // Date.getDay() retorna 1 para Segunda, 2 para Terça...
  const mapaDiasJs = {
    segunda: 1,
    terca: 2,
    quarta: 3,
    quinta: 4,
    sexta: 5,
    sabado: 6
  };

  const diasSelecionadosJs = Object.keys(selectedPeriodo.value)
    .filter(dia => selectedPeriodo.value[dia] !== null)
    .map(dia => mapaDiasJs[dia]);

  let total = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (diasSelecionadosJs.includes(current.getDay())) {
      total++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return total;
});

const selectedAreas = ref(null);
// Inicializamos como uma lista vazia, que será preenchida com dados do banco
const areasDisponiveis = ref([]);

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

// DIDÁTICA: Controla quais dias estão mostrando o sub-menu de Integral
// Quando o usuário clica em "Integral", o card mostra 3 opções:
// Manhã+Tarde, Manhã+Noite, Tarde+Noite
const integralSubMenu = ref({
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
  sabado: false,
});

const periodos = [
  { label: "Manhã", value: "manha", color: "#F59E0B" },
  { label: "Tarde", value: "tarde", color: "#3B82F6" },
  { label: "Noite", value: "noite", color: "#6366F1" },
  { label: "Integral", value: "INT", color: "#10B981" },
];

// DIDÁTICA: Labels bonitos para exibir no badge do card
const integralLabels = {
  'INT_MT': 'Manhã + Tarde',
  'INT_MN': 'Manhã + Noite',
  'INT_TN': 'Tarde + Noite',
};

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
  // DIDÁTICA: Limpa as UCs salvas daquele dia se o usuário mudar o turno (Manhã, Tarde, etc)
  // Isso evita que fiquem UCs da "Noite" salvas num dia que foi alterado para "Manhã"
  ucsSalvas.value[diaValue] = [];
}

// DIDÁTICA: Quando o usuário escolhe uma das 3 combinações de Integral
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

// Lista de todas as unidades curriculares disponíveis, carregadas dinamicamente
const unidadesCurriculares = ref([]);


// Controla se o modal está aberto ou fechado
const modalAberto = ref(false);

// Guarda qual dia está sendo editado no momento (ex: "segunda", "terca")
const diaDoModal = ref(null);

// Campo de busca dentro do modal
const buscaUC = ref("");

// Guarda temporariamente as UCs marcadas no modal antes de salvar
const ucsSelecionadasTemp = ref([]); // Array de objetos { uc, periodo }

// Guarda as UCs salvas de cada dia
const ucsSalvas = ref({
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: [],
});

// DIDÁTICA: Agora a lista de períodos para a UC não é mais fixa.
// Ela é calculada dinamicamente dependendo do período (Manhã, Tarde...) 
// que o usuário escolheu para aquele dia específico!
//
// REGRA INTEGRAL: No modo Integral, o dia tem 6 slots concretos de horário
// (M01, M02, T01, T02, N01, N02) MAIS as opções de período inteiro
// (Manhã, Tarde, Noite) para quando uma UC ocupa o turno todo.
//
// Exemplo real: Lógica de Programação ocupa a "Manhã" inteira (M01+M02),
// enquanto Banco de Dados fica em T01 e Redes em T02.
//
// A opção "Integral" foi REMOVIDA porque ela travava todos os 6 slots
// de uma vez, o que não faz sentido quando queremos distribuir UCs.
//
// REGRA PERÍODO SIMPLES (Manhã/Tarde/Noite): O dia tem 2 sub-slots
// (ex: M01 e M02) ou o período inteiro ("Manhã"). Se alguém escolhe
// "Manhã", bloqueia M01 e M02 (e vice-versa).
const periodosDisponiveisParaOModal = computed(() => {
  const periodoDoDiaSelecionado = selectedPeriodo.value[diaDoModal.value];

  if (periodoDoDiaSelecionado === 'manha') {
    return ['M01', 'M02', 'Manhã'];
  } else if (periodoDoDiaSelecionado === 'tarde') {
    return ['T01', 'T02', 'Tarde'];
  } else if (periodoDoDiaSelecionado === 'noite') {
    return ['N01', 'N02', 'Noite'];
  } else if (periodoDoDiaSelecionado === 'INT_MT') {
    // INTEGRAL Manhã+Tarde: 4 sub-slots + 2 turnos completos
    return ['M01', 'M02', 'Manhã', 'T01', 'T02', 'Tarde'];
  } else if (periodoDoDiaSelecionado === 'INT_MN') {
    // INTEGRAL Manhã+Noite: 4 sub-slots + 2 turnos completos
    return ['M01', 'M02', 'Manhã', 'N01', 'N02', 'Noite'];
  } else if (periodoDoDiaSelecionado === 'INT_TN') {
    // INTEGRAL Tarde+Noite: 4 sub-slots + 2 turnos completos
    return ['T01', 'T02', 'Tarde', 'N01', 'N02', 'Noite'];
  }

  return [];
});

// DIDÁTICA: Função para calcular dinamicamente quais períodos sobram para uma determinada UC.
// Ela bloqueia opções conflitantes (ex: se alguém escolheu 'M01', ninguém pode escolher 'Manhã').
//
// Para INTEGRAL: a lógica é simples — cada slot é exclusivo (1:1).
// Para PERÍODO SIMPLES: "Manhã" conflita com M01 e M02 (e vice-versa).
function periodosDisponiveisPara(ucNome) {
  const basePeriodos = periodosDisponiveisParaOModal.value;
  const outrasUcs = ucsSelecionadasTemp.value.filter(item => item.uc !== ucNome && item.periodo);
  
  // Tabela de conflitos: se alguém escolheu "Manhã", bloqueia M01 e M02.
  // No modo Integral, como só temos os 6 slots granulares, 
  // cada um conflita apenas consigo mesmo (já tratado abaixo).
  const conflitosGlobais = {
    'Manhã': ['M01', 'M02'],
    'M01': ['Manhã'],
    'M02': ['Manhã'],
    'Tarde': ['T01', 'T02'],
    'T01': ['Tarde'],
    'T02': ['Tarde'],
    'Noite': ['N01', 'N02'],
    'N01': ['Noite'],
    'N02': ['Noite'],
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

function abrirModal(diaValue) {
  diaDoModal.value = diaValue;
  buscaUC.value = "";
  ucsSelecionadasTemp.value = ucsSalvas.value[diaValue].map(item => ({ ...item }));
  modalAberto.value = true;
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
  // Validação ESTREITA: Impede que o Vue ou o Vuetify burlem a seleção (caso de lentidão na reatividade)
  if (periodo !== "") {
    const disponiveis = periodosDisponiveisPara(ucNome);
    if (!disponiveis.includes(periodo)) {
      alert(`Erro: O período '${periodo}' não pode ser selecionado devido a um conflito de horário com outra matéria já marcada.`);
      return; // Bloqueia a alteração
    }
  }

  const item = ucsSelecionadasTemp.value.find(item => item.uc === ucNome);
  if (item) {
    item.periodo = periodo;
    // DIDÁTICA: Recria o array para forçar o Vue a re-renderizar a tela inteira do modal instantaneamente
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
  modalAberto.value = false;
}

function fecharModal() {
  modalAberto.value = false;
}

// Guardamos TODOS os OPPs do banco aqui, para podermos filtrar depois
const todosOpps = ref([]);

// Esta lista será alimentada dinamicamente dependendo da Área escolhida
const oppsResponsavel = ref([]);

// Mudamos para `null` ao invés de array, pois agora selecionaremos apenas 1 OPP
const selectedOpps = ref(null);

// --------------------------------------------------------
// DIDÁTICA: 'watch' fica "vigiando" uma variável.
// Se 'selectedAreas' mudar, a função abaixo será executada automaticamente.
// --------------------------------------------------------
watch(selectedAreas, async (novaAreaId) => {
  // Limpamos o OPP que estava selecionado, pois a área mudou
  selectedOpps.value = null;

  // Limpamos as UCs selecionadas/salvas dos dias da semana
  Object.keys(ucsSalvas.value).forEach(dia => {
    ucsSalvas.value[dia] = [];
  });

  if (!novaAreaId) {
    // Se não tiver área selecionada, a lista de OPPs e UCs fica vazia
    oppsResponsavel.value = [];
    unidadesCurriculares.value = [];
    return;
  }

  // Filtramos os OPPs: pegamos apenas aqueles que têm a 'novaAreaId' nas suas áreas
  const oppsFiltrados = todosOpps.value.filter(opp => {
    // opp.oppAreas é a lista de áreas que aquele OPP possui
    return opp.oppAreas && opp.oppAreas.some(oa => oa.idArea === novaAreaId);
  });

  // Traduzimos os OPPs filtrados para o formato do v-select
  oppsResponsavel.value = oppsFiltrados.map(opp => ({
    label: opp.cadastro.nome,
    value: opp.idOPP
  }));

  // Buscar as UCs vinculadas a esta área do banco
  try {
    const data = await listarUCsPorArea(novaAreaId);
    unidadesCurriculares.value = data.map(uc => {
      // Tenta extrair a carga horária da descrição se houver (ex: "80h")
      let carga = "";
      if (uc.descricao) {
        const match = uc.descricao.match(/(\d+h)/i);
        if (match) {
          carga = match[1];
        }
      }
      return {
        idUC: uc.idUC,
        nome: uc.nome,
        carga: carga || undefined
      };
    });
  } catch (error) {
    console.error("Erro ao carregar UCs por área:", error);
    unidadesCurriculares.value = [];
  }
});

// --------------------------------------------------------
// DIDÁTICA: O gancho (hook) onMounted é chamado automaticamente
// pelo Vue.js assim que este componente (página) aparece na tela.
// É o local ideal para fazermos a conexão com o backend (API).
// --------------------------------------------------------
onMounted(() => {
  carregarAreas();
  carregarOpps();
});

// --------------------------------------------------------
// DIDÁTICA: Função para buscar as áreas no banco de dados.
// Usamos async/await pois é uma operação demorada (requisição de rede).
// --------------------------------------------------------
async function carregarAreas() {
  try {
    // Fazemos um pedido (fetch) para a nossa rota do backend
    const response = await fetch("http://localhost:3001/api/areas");
    const data = await response.json();
    
    // Mapeamos a resposta para o formato esperado pelo <v-select>
    // title: o texto que aparece na tela (ex: Tecnologia)
    // value: o identificador único (ex: 1)
    areasDisponiveis.value = data.map(area => ({
      title: area.nome,
      value: area.idArea
    }));
  } catch (error) {
    console.error("Erro ao carregar áreas:", error);
  }
}

// --------------------------------------------------------
// DIDÁTICA: Função para buscar os OPPs no banco de dados.
// --------------------------------------------------------
async function carregarOpps() {
  try {
    const response = await fetch("http://localhost:3001/api/opps");
    const data = await response.json();
    
    // Guardamos os dados completos do banco na nossa variável "escondida"
    // Não mapeamos para 'oppsResponsavel' logo de cara, porque o usuário
    // precisa escolher a Área primeiro!
    todosOpps.value = data;
  } catch (error) {
    console.error("Erro ao carregar OPPs:", error);
  }
}

async function salvarTurmaNoNavegador() {
  if (!nomeTurma.value) {
    alert("Por favor, preencha o nome da turma!");
    return;
  }
  if (!dataInicio.value || !dataFim.value) {
    alert("Por favor, preencha as datas de início e término!");
    return;
  }
  if (!selectedAreas.value) {
    alert("Por favor, selecione uma área!");
    return;
  }
  if (!selectedOpps.value) {
    alert("Por favor, selecione o OPP responsável!");
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

  if (horarios.length === 0) {
    alert("Configure ao menos uma UC com período na grade semanal!");
    return;
  }

  try {
    await criarTurma({
      nome: nomeTurma.value,
      tipoCurso: tipoCurso.value,
      dataInicio: dataInicio.value,
      dataTermino: dataFim.value,
      idOPP: selectedOpps.value,
      idArea: selectedAreas.value,
      aulasSemana: aulasPorSemana.value,
      totalAulas: totalAulas.value,
      horarios,
    });
    router.push('/turmas');
  } catch (error) {
    alert(error.message || "Erro ao criar turma");
  }
}

const periodoDescricoes = {
  'M01': 'Manhã - Antes do intervalo',
  'M02': 'Manhã - Depois do intervalo',
  'T01': 'Tarde - Antes do intervalo',
  'T02': 'Tarde - Depois do intervalo',
  'N01': 'Noite - Antes do intervalo',
  'N02': 'Noite - Depois do intervalo',
  'Manhã': 'Período da Manhã inteira',
  'Tarde': 'Período da Tarde inteira',
  'Noite': 'Período da Noite inteira',
  'INT_MT': 'Integral (Manhã + Tarde)',
  'INT_MN': 'Integral (Manhã + Noite)',
  'INT_TN': 'Integral (Tarde + Noite)',
};

// Helper: verifica se um período é do tipo integral
function isIntegral(periodo) {
  return periodo && periodo.startsWith('INT_');
}
</script>

<template>
  <Menu />

  <div class="flex flex-col md:flex-row justify-between px-4 md:px-10 lg:px-20 xl:px-40 mt-8 gap-4">
    <div>
      <h2 class="text-3xl md:text-4xl font-bold">Adicionar Turma</h2>
      <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">Preencha as informações necessárias para adicionar uma turma</p>
    </div>
    <div class="hidden lg:flex relative top-4">
      <img src="@/assets/imagemdois.png" alt="Desenho de um professor" width="200px" />
    </div>
  </div>

  <div
    class="border-t-4 border-red-600 mt-6 px-4 md:px-8 py-8 rounded-lg shadow-lg mx-4 md:mx-10 lg:mx-20 xl:mx-40 bg-white dark:bg-[#121212]">
    <div class="w-full">
      <div class="lg:flex w-full gap-10">
        <div class="w-full mb-4">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
            Nome da Turma
          </p>
          <!-- DIDÁTICA: Linkamos o campo com a nossa variável usando v-model -->
          <v-text-field v-model="nomeTurma" label="Digite o nome..." variant="filled" hide-details></v-text-field>
        </div>

        <div class="w-full mb-4">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
            Áreas
          </p>
          <!-- DIDÁTICA: Removemos o atributo 'multiple' para virar seleção única -->
          <v-select v-model="selectedAreas" chips label="Selecione..." :items="areasDisponiveis"
            item-title="title" item-value="value" variant="filled" hide-details></v-select>
        </div>
      </div>

      <div class="lg:flex justify-between items-start gap-10">
        <div class="w-full mb-4">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
            Opp Responsável
          </p>
          <!-- DIDÁTICA: A lista ':items' agora será preenchida dinamicamente pelo 'watch' -->
          <v-select v-model="selectedOpps" chips label="Selecione uma Área primeiro..." :items="oppsResponsavel" item-title="label"
            item-value="value" variant="filled" hide-details :disabled="!selectedAreas"></v-select>
        </div>

        <div class="">
          <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tipos de Cursoz
          </p>

          <v-radio-group v-model="tipoCurso" inline hide-details density="compact">
            <v-radio class="font-bold mr-4" label="TÉC" value="tec" color="red"></v-radio>
            <v-radio class="font-bold mr-4" label="CAI" value="cai" color="red"></v-radio>
            <v-radio class="font-bold" label="FIC" value="fic" color="red"></v-radio>
          </v-radio-group>
        </div>
      </div>

      <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 mb-4">
        <div>
          <p class="font-bold mt-3.5 lg:mt-0 mb-2 text-sm text-gray-500 dark:text-gray-400">
            Início
          </p>
          <v-text-field v-model="dataInicio" :min="dataAmanha" label="Selecione data" type="date" variant="filled" hide-details></v-text-field>
        </div>

        <div>
          <p class="font-bold mb-2 text-sm text-gray-500 dark:text-gray-400">
            Fim
          </p>
          <!-- Fim não pode ser menor que o Início, caso o usuário já tenha preenchido. Senão, no mínimo Amanhã -->
          <v-text-field v-model="dataFim" :min="dataInicio || dataAmanha" label="Selecione data" type="date" variant="filled" hide-details></v-text-field>
        </div>

        <div>
          <p class="font-bold mb-2 text-sm text-gray-500 dark:text-gray-400">
            Aulas por Semana
          </p>
          <!-- DIDÁTICA: Campo apenas para visualização (readonly), seu valor é calculado automaticamente pelo 'aulasPorSemana' -->
          <v-text-field :model-value="aulasPorSemana" readonly label="Aulas por semana" variant="filled" hide-details type="number"></v-text-field>
        </div>

        <div>
          <p class="font-bold mb-2 text-sm text-gray-500 dark:text-gray-400">
            Total de Aulas
          </p>
          <!-- DIDÁTICA: Também readonly, calcula as ocorrências -->
          <v-text-field :model-value="totalAulas" readonly label="Total de aulas" variant="filled" hide-details type="number"></v-text-field>
        </div>
      </div>
    </div>

    <v-divider :thickness="4" class="mx-3 md:flex mt-5"></v-divider>

    <div class="flex mx-5 sm:gap-8">
      <div class="w-full flex flex-col gap-4">
        <div class="flex items-center gap-2 mt-3">
          <p class="font-bold text-grey-lighten-1">Dias da Semana</p>
          <v-menu open-on-hover location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="grey-lighten-1" size="small" class="cursor-help">mdi-help-circle-outline</v-icon>
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
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div v-for="(dia, index) in diasDaSemana" :key="index">
            <p class="mb-2 font-bold text-sm text-gray-500 dark:text-gray-400">
              {{ dia.label }}
            </p>
            <v-card variant="outlined"
              class="rounded-md pa-4 h-[250px] flex flex-col border-gray-300 dark:border-gray-600">
              <div class="flex-1">
                <div v-if="selectedPeriodo[dia.value]" class="flex flex-col items-center">
                  <!-- Se for Manhã -->
                  <div v-if="selectedPeriodo[dia.value] === 'manha'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-manha">
                    <v-icon icon="mdi-circle" size="8" color="#F59E0B"></v-icon>
                    <span class="text-sm font-bold" style="color: #333">Manhã</span>
                    <v-icon icon="mdi-close" size="18" color="#333" class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"></v-icon>
                  </div>
                  <!-- Se for Tarde -->
                  <div v-else-if="selectedPeriodo[dia.value] === 'tarde'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-tarde">
                    <v-icon icon="mdi-circle" size="8" color="#3B82F6"></v-icon>
                    <span class="text-sm font-bold" style="color: #333">Tarde</span>
                    <v-icon icon="mdi-close" size="18" color="#333" class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"></v-icon>
                  </div>
                  <!-- Se for Noite -->
                  <div v-else-if="selectedPeriodo[dia.value] === 'noite'"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-noite">
                    <v-icon icon="mdi-circle" size="8" color="#6366F1"></v-icon>
                    <span class="text-sm font-bold" style="color: #333">Noite</span>
                    <v-icon icon="mdi-close" size="18" color="#333" class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"></v-icon>
                  </div>
                  <!-- Se for Integral (qualquer combinação) -->
                  <div v-else-if="isIntegral(selectedPeriodo[dia.value])"
                    class="w-full rounded py-2 px-2 mb-2 flex items-center justify-center gap-1 border bg-integral">
                    <v-icon icon="mdi-circle" size="8" color="#10B981"></v-icon>
                    <span class="text-[11px] font-bold" style="color: #333">{{ integralLabels[selectedPeriodo[dia.value]] }}</span>
                    <v-icon icon="mdi-close" size="18" color="#333" class="cursor-pointer ml-1"
                      @click="removerPeriodo(dia.value)"></v-icon>
                  </div>

                  <div class="w-full px-5">
                    <div
                      class="w-full py-3 px-1 flex flex-col items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                      @click="abrirModal(dia.value)">
                      <v-icon icon="mdi-plus" size="16" class="text-gray-800 dark:text-white"></v-icon>
                      <p class="text-[13px] font-bold text-center leading-tight text-gray-800 dark:text-white">
                        Unidade<br />Curricular
                      </p>
                    </div>
                  </div>

                  <!-- Lista de UCs salvas neste dia com barra de rolagem -->
                  <div v-if="ucsSalvas[dia.value].length > 0" class="w-full mt-3.5 scroll-custom pl-1">
                    <div v-for="(item, i) in ucsSalvas[dia.value]" :key="i"
                      class="text-[12px] bg-gray-100 dark:bg-[#414141] rounded px-2 py-1 mb-1 text-gray-700 dark:text-white font-bold flex justify-between items-center group">
                      <div class="flex-1 flex justify-between items-center pr-1">
                        <span class="leading-tight">{{ item.uc }}</span>
                        <span class="text-red-600 ml-2 whitespace-nowrap">{{ item.periodo }}</span>
                      </div>
                      <v-icon icon="mdi-close" size="12" class="opacity-0 group-hover:opacity-100 cursor-pointer"
                        @click="ucsSalvas[dia.value].splice(i, 1)"></v-icon>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center text-center h-full">
                  <v-avatar color="#F3F3F1" class="dark:bg-[#414141] mb-2" size="40">
                    <v-icon icon="mdi-clock-outline" size="24" class="text-[#D1D1CB] dark:text-gray-300"></v-icon>
                  </v-avatar>
                  <p class="text-[13px] font-bold text-gray-500 dark:text-gray-400 leading-tight">
                    Toque para Selecionar o Periodo
                  </p>
                </div>
              </div>
              <div v-if="!selectedPeriodo[dia.value]" class="mb-3 space-y-1 text-center pb-4">
                <!-- Menu principal: Manhã, Tarde, Noite, Integral -->
                <template v-if="!integralSubMenu[dia.value]">
                  <p v-for="periodo in periodos" :key="periodo.value"
                    class="text-[15px] cursor-pointer font-bold transition-colors text-center" :class="{
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
                        periodo.value === 'INT',
                      'text-gray-800 dark:text-white':
                        selectedPeriodo[dia.value] !== periodo.value && periodo.value !== 'INT',
                    }" @click="togglePeriodo(dia.value, periodo.value)">
                    {{ periodo.label }}
                  </p>
                </template>
                <!-- Sub-menu do Integral: 3 combinações de 2 períodos -->
                <template v-else>
                  <p class="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Qual Integral?</p>
                  <p class="text-[14px] cursor-pointer font-bold text-integral hover:underline" @click="selecionarIntegral(dia.value, 'INT_MT')">
                    Manhã + Tarde
                  </p>
                  <p class="text-[14px] cursor-pointer font-bold text-integral hover:underline" @click="selecionarIntegral(dia.value, 'INT_MN')">
                    Manhã + Noite
                  </p>
                  <p class="text-[14px] cursor-pointer font-bold text-integral hover:underline" @click="selecionarIntegral(dia.value, 'INT_TN')">
                    Tarde + Noite
                  </p>
                  <p class="text-[12px] cursor-pointer font-bold text-gray-400 hover:text-gray-600 mt-1" @click="integralSubMenu[dia.value] = false">
                    ← Voltar
                  </p>
                </template>
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
    <!-- DIDÁTICA: Adicionado evento de clique para rodar a nossa função -->
    <v-btn color="red" class="bg-red-600 text-white" @click="salvarTurmaNoNavegador()">Adicionar Turma</v-btn>
  </div>

  <!-- Modal de Unidade Curricular -->
  <v-dialog v-model="modalAberto" max-width="520">
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
        <v-btn variant="text" @click="fecharModal()">Cancelar</v-btn>
        <v-btn color="red" class="bg-red-600 text-white" @click="salvarUCs()">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Estilos para o fundo e bordas dos chips selecionados */
.bg-manha {
  background-color: #fef3c7;
  /* Amarelo clarinho */
  border-color: #f59e0b;
}

.dark .bg-manha {
  background-color: rgba(245, 158, 11, 0.2);
}

.bg-tarde {
  background-color: #dbeafe;
  /* Azul clarinho */
  border-color: #3b82f6;
}

.dark .bg-tarde {
  background-color: rgba(59, 130, 246, 0.2);
}

.bg-noite {
  background-color: #e0e7ff;
  /* Roxo/Indigo clarinho */
  border-color: #6366f1;
}

.dark .bg-noite {
  background-color: rgba(99, 102, 241, 0.2);
}

.bg-integral {
  background-color: #d1fae5;
  /* Verde clarinho */
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
  max-height: 100px;
  /* Ajustado para o card de 250px */
  overflow-y: auto;
  /* Volta a aparecer só quando necessário */
  padding-right: 4px;
}

/* Deixar a barra de rolagem elegante e discreta */
.scroll-custom::-webkit-scrollbar {
  width: 4px;
  /* Mais fininha */
}

.scroll-custom::-webkit-scrollbar-thumb {
  background-color: #bdbdbd;
  border-radius: 10px;
}

.scroll-custom::-webkit-scrollbar-track {
  background: transparent;
  /* Fundo transparente para ficar mais limpo */
}
</style>
