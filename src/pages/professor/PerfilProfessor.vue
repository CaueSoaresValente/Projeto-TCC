<script setup>
import Menu from "@/components/Menu.vue";
import { ref, watch, computed } from "vue";

// Dados do usuário logado
const user = ref({
  name: "User",
  foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

// Itens do menu dropdown do avatar
// Itens do menu dropdown do avatar (Padronizado)
const items = ref([
  { title: "Meu Perfil", icon: "mdi-account-outline" },
  { title: "Sair", icon: "mdi-logout" },
]);

// Abas
const tags = ["Área de Atuação", "Unidades Curriculares", "Certificações"];
const selecionado = ref("Área de Atuação");
const searchQuery = ref("");

// =============================================
// DADOS DA ÁREA DE ATUAÇÃO (mock)
// =============================================
const dadosAreas = ref([
  { nome: "Tecnologia"},
  { nome: "Administração" },
  { nome: "Informática"},
]);

const areasDisponiveis = [
  "Desenvolvimento Web",
  "Banco de Dados",
  "Arquitetura de Software",
  "Ciência de Dados",
  "Segurança da Informação",
  "Redes de Computadores",
  "Engenharia de Software",
  "Sistemas Operacionais",
  "Inteligência Artificial",
  "Mobile",
];

// =============================================
// DADOS DAS UNIDADES CURRICULARES (mock)
// =============================================
const dadosUnidades = ref([
  { nome: "Banco de Dados", progresso: 50 },
  { nome: "Back-end", progresso: 50 },
  { nome: "Front-end", progresso: 50 },
  { nome: "Internet das Coisas", progresso: 50 },
  { nome: "Android/Kotlin", progresso: 50 },
  { nome: "Projetos", progresso: 50 },
  { nome: "Power BI", progresso: 50 },
]);

// Mapeamento de Unidades por Área (pra facilitar a vida do prof)
const unidadesPorArea = {
  "Tecnologia": ["Inteligência Artificial", "Internet das Coisas", "Cibersegurança", "Android/Kotlin"],
  "Informática": ["Banco de Dados", "Back-end", "Front-end", "Redes de Computadores"],
  "Administração": ["Projetos", "Power BI"]
};

// Unidades filtradas baseadas na área escolhida
const unidadesFiltradas = computed(() => {
  if (!areaSelecionadaFiltro.value) return [];
  return unidadesPorArea[areaSelecionadaFiltro.value] || [];
});

// =============================================
// DADOS DAS CERTIFICAÇÕES (mock)
// =============================================
const dadosCertificacoes = ref([
  { nome: "AWS Cloud Practitioner", instituicao: "Amazon", data: "2024-03-15", cargaHoraria: "40h" },
  { nome: "Scrum Foundation", instituicao: "CertiProf", data: "2023-11-20", cargaHoraria: "16h" },
  { nome: "Google Data Analytics", instituicao: "Google", data: "2024-01-10", cargaHoraria: "120h" },
]);

// =============================================
// FILTROS DE PESQUISA
// =============================================
const filteredAreas = computed(() =>
  dadosAreas.value.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const filteredUnidades = computed(() =>
  dadosUnidades.value.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const filteredCertificacoes = computed(() =>
  dadosCertificacoes.value.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.instituicao.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// =============================================
// CONTROLE DOS MODAIS
// =============================================
const dialogAddArea = ref(false);
const dialogEditArea = ref(false);
const dialogDeleteArea = ref(false);

const dialogAddUnidade = ref(false);
const dialogEditUnidade = ref(false);
const dialogDeleteUnidade = ref(false);

const dialogAddCertificacao = ref(false);
const dialogEditCertificacao = ref(false);
const dialogDeleteCertificacao = ref(false);

// =============================================
// ITEM SELECIONADO PARA EDIÇÃO/DELEÇÃO
// =============================================
const areaSelecionada = ref(null);
const unidadeSelecionada = ref(null);
const certificacaoSelecionada = ref(null);
const areaSelecionadaFiltro = ref(null); // Pra guardar a área no modal de add unidade

// =============================================
// CAMPOS DOS FORMULÁRIOS — ÁREA DE ATUAÇÃO
// =============================================
const novaAreaNome = ref("");
const novoNivelArea = ref(0);

// =============================================
// CAMPOS DOS FORMULÁRIOS — UNIDADE
// =============================================
const novaUnidadeNome = ref("");
const novoNivelConhecimento = ref(0);
const novaUnidade = ref({ cargaHorariaTotal: 0 });
const numModulos = ref(0);


const calcularCargaHoraria = () => {
  novaUnidade.value.cargaHorariaTotal = numModulos.value * 40;
};

// =============================================
// CAMPOS DOS FORMULÁRIOS — CERTIFICAÇÃO
// =============================================
const novaCertificacaoNome = ref("");
const novaCertificacaoInstituicao = ref("");
const novaCertificacaoData = ref("");
const novaCertificacaoCarga = ref("");

// =============================================
// FUNÇÕES DE SALVAR
// =============================================
const salvarArea = () => {
  if (novaAreaNome.value.trim()) {
    dadosAreas.value.push({
      nome: novaAreaNome.value.trim(),
      nivel: novoNivelArea.value,
    });
    dialogAddArea.value = false;
  }
};

const salvarUnidade = () => {
  if (novaUnidadeNome.value.trim()) {
    dadosUnidades.value.push({
      nome: novaUnidadeNome.value.trim(),
      progresso: novoNivelConhecimento.value,
      cargaHorariaTotal: novaUnidade.value.cargaHorariaTotal,
    });
    dialogAddUnidade.value = false;
  }
};

const salvarCertificacao = () => {
  if (novaCertificacaoNome.value.trim()) {
    dadosCertificacoes.value.push({
      nome: novaCertificacaoNome.value.trim(),
      instituicao: novaCertificacaoInstituicao.value.trim() || "—",
      data: novaCertificacaoData.value || "—",
      cargaHoraria: novaCertificacaoCarga.value.trim() || "0h",
    });
    dialogAddCertificacao.value = false;
  }
};

// =============================================
// FUNÇÕES DE EDITAR
// =============================================
const abrirEditArea = (item) => {
  areaSelecionada.value = { ...item };
  dialogEditArea.value = true;
};

const salvarEdicaoArea = () => {
  const index = dadosAreas.value.findIndex(
    (a) => a.nome === areaSelecionada.value.nome
  );
  if (index !== -1) {
    dadosAreas.value[index] = { ...areaSelecionada.value };
  }
  dialogEditArea.value = false;
};

const abrirEditUnidade = (item) => {
  unidadeSelecionada.value = { ...item };
  dialogEditUnidade.value = true;
};

const salvarEdicaoUnidade = () => {
  const index = dadosUnidades.value.findIndex(
    (u) => u.nome === unidadeSelecionada.value.nome
  );
  if (index !== -1) {
    dadosUnidades.value[index] = { ...unidadeSelecionada.value };
  }
  dialogEditUnidade.value = false;
};

const abrirEditCertificacao = (item) => {
  certificacaoSelecionada.value = { ...item };
  dialogEditCertificacao.value = true;
};

const salvarEdicaoCertificacao = () => {
  const index = dadosCertificacoes.value.findIndex(
    (c) => c.nome === certificacaoSelecionada.value.nome
  );
  if (index !== -1) {
    dadosCertificacoes.value[index] = { ...certificacaoSelecionada.value };
  }
  dialogEditCertificacao.value = false;
};

// =============================================
// FUNÇÕES DE DELETAR
// =============================================
const abrirDeleteArea = (item) => {
  areaSelecionada.value = item;
  dialogDeleteArea.value = true;
};

const confirmarDeleteArea = () => {
  dadosAreas.value = dadosAreas.value.filter(
    (a) => a.nome !== areaSelecionada.value.nome
  );
  dialogDeleteArea.value = false;
};

const abrirDeleteUnidade = (item) => {
  unidadeSelecionada.value = item;
  dialogDeleteUnidade.value = true;
};

const confirmarDeleteUnidade = () => {
  dadosUnidades.value = dadosUnidades.value.filter(
    (u) => u.nome !== unidadeSelecionada.value.nome
  );
  dialogDeleteUnidade.value = false;
};

const abrirDeleteCertificacao = (item) => {
  certificacaoSelecionada.value = item;
  dialogDeleteCertificacao.value = true;
};

const confirmarDeleteCertificacao = () => {
  dadosCertificacoes.value = dadosCertificacoes.value.filter(
    (c) => c.nome !== certificacaoSelecionada.value.nome
  );
  dialogDeleteCertificacao.value = false;
};

// =============================================
// WATCHERS (limpa campos ao abrir modais de adição)
// =============================================
watch(dialogAddArea, (val) => {
  if (val) {
    novaAreaNome.value = "";
    novoNivelArea.value = 0;
  }
});

watch(dialogAddUnidade, (val) => {
  if (val) {
    novaAreaNome.value = "";
    novoNivelArea.value = 0;
  }
});

watch(dialogAddUnidade, (val) => {
  if (val) {
    areaSelecionadaFiltro.value = null;
    novaUnidadeNome.value = "";
    novoNivelConhecimento.value = 0;
    numModulos.value = 0;
    novaUnidade.value.cargaHorariaTotal = 0;
  }
});

watch(dialogAddCertificacao, (val) => {
  if (val) {
    novaCertificacaoNome.value = "";
    novaCertificacaoInstituicao.value = "";
    novaCertificacaoData.value = "";
    novaCertificacaoCarga.value = "";
  }
});
</script>

<template>
  <!-- Menu do topo -->
  <Menu />

  <!-- Conteúdo principal -->
  <div class="mx-5 md:mx-20! lg:mx-50!">
    <h1 class="text-3xl font-bold my-4 break-words">Meu Perfil</h1>

    <!-- Abas -->
    <v-sheet class="relative top-1 px-1">
      <v-chip-group
        selected-class="text-white bg-red-600!"
        mandatory
        v-model="selecionado"
        class="relative top-1!"
      >
        <v-chip
          v-for="tag in tags"
          :key="tag"
          :value="tag"
          :text="tag"
          class="flex justify-center m-0! w-[200px]! p-5 font-bold"
          rounded="md"
        ></v-chip>
      </v-chip-group>
    </v-sheet>

    <!-- Card principal -->
    <v-card class="border-t-4 border-red-600 px-8 rounded-lg shadow-lg py-8">
      <!-- Barra de pesquisa e botão -->
      <div class="flex flex-col-reverse sm:flex-row justify-between gap-4">
        <v-text-field
          v-model="searchQuery"
          label="Pesquisar..."
          type="text"
          variant="filled"
          hide-details
        ></v-text-field>
        <v-btn
          class="h-14 bg-red-500! text-white"
          @click="
            selecionado === 'Área de Atuação'
              ? (dialogAddArea = true)
              : selecionado === 'Unidades Curriculares'
              ? (dialogAddUnidade = true)
              : (dialogAddCertificacao = true)
          "
        >
          Adicionar
          {{
            selecionado === "Área de Atuação"
              ? "Área"
              : selecionado === "Unidades Curriculares"
              ? "Unidade"
              : "Certificação"
          }}
        </v-btn>
      </div>

      <!-- TABELA DE ÁREA DE ATUAÇÃO -->
      <v-table
        class="mt-8"
        v-if="selecionado === 'Área de Atuação'"
        fixed-header
        height="400px"
      >
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Área de Atuação</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredAreas" :key="item.nome">
            <td class="text-center font-bold dark:text-white">{{ item.nome }}</td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn
                  icon="mdi-pencil"
                  color="primary"
                  size="small"
                  @click="abrirEditArea(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  @click="abrirDeleteArea(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- TABELA DE UNIDADES CURRICULARES -->
      <v-table
        class="mt-8"
        v-else-if="selecionado === 'Unidades Curriculares'"
        fixed-header
        height="400px"
      >
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Nome da Unidade</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Progresso</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredUnidades" :key="item.nome">
            <td class="text-center font-bold dark:text-white">{{ item.nome }}</td>
            <td class="text-center dark:text-white">
              <div class="flex items-center gap-2 justify-center">
                <v-progress-linear
                  :model-value="item.progresso"
                  color="#4CAF50"
                  track-color="#E8F5E9"
                  height="10"
                  rounded
                  class="max-w-[150px]"
                ></v-progress-linear>
                <span class="text-sm font-bold text-gray-500">{{ item.progresso }}%</span>
              </div>
            </td>
            <td>
              <div class="flex gap-2 justify-center">
                <v-btn
                  icon="mdi-pencil"
                  color="primary"
                  size="small"
                  @click="abrirEditUnidade(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  @click="abrirDeleteUnidade(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- TABELA DE CERTIFICAÇÕES -->
      <v-table v-else class="mt-8" fixed-header height="400px">
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Certificação</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Instituição</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Carga Horária</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Data</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredCertificacoes" :key="item.nome">
            <td class="text-center font-bold dark:text-white">{{ item.nome }}</td>
            <td class="text-center font-bold">
              <p class="p-2 bg-gray-200 dark:bg-[#121212] rounded-lg">{{ item.instituicao }}</p>
            </td>
            <td class="text-center font-bold dark:text-white">{{ item.cargaHoraria }}</td>
            <td class="text-center font-bold dark:text-white">{{ item.data }}</td>
            <td>
              <div class="flex gap-2 justify-center">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  @click="abrirEditCertificacao(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  size="small"
                  @click="abrirDeleteCertificacao(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>

  <!-- =============================================
       MODAIS DE ÁREA DE ATUAÇÃO
       ============================================= -->

  <!-- Modal: Adicionar Área -->
  <v-dialog v-model="dialogAddArea" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
      >
        Adicionar Área de Atuação
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogAddArea = false"
          size="small"
        ></v-btn>
      </v-card-title>
      <v-card-text class="px-5 flex flex-col gap-4 mt-4">
        <v-select
          v-model="novaAreaNome"
          :items="areasDisponiveis"
          label="Selecione a Área"
          variant="outlined"
          hide-details
        ></v-select>
      </v-card-text>
      <v-card-actions class="px-5 justify-between mb-2">
        <v-btn color="grey" variant="elevated" @click="dialogAddArea = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="salvarArea" class="bg-red-600 text-white">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Editar Área -->
  <v-dialog v-model="dialogEditArea" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
      >
        Editar Área de Atuação
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogEditArea = false"
          size="small"
        ></v-btn>
      </v-card-title>
      <div class="my-8" v-if="areaSelecionada">
        <v-card-text class="px-5 py-0 flex flex-col gap-4">
          <v-select
            v-model="areaSelecionada.nome"
            label="Nome da Área"
            variant="outlined"
            hide-details
            :items="areasDisponiveis"
          ></v-select>
        </v-card-text>
        <v-card-actions class="p-0 px-5 flex justify-between mt-6">
          <v-btn color="grey" variant="elevated" @click="dialogEditArea = false">Cancelar</v-btn>
          <v-btn
            color="red"
            variant="elevated"
            @click="salvarEdicaoArea"
            class="bg-red-600 text-white font-bold"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <!-- Modal: Deletar Área -->
  <v-dialog v-model="dialogDeleteArea" max-width="400px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Confirmar Exclusão
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Tem certeza de que deseja excluir a área
        <strong>{{ areaSelecionada?.nome }}</strong>? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteArea = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="confirmarDeleteArea">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- =============================================
       MODAIS DE UNIDADES CURRICULARES
       ============================================= -->

  <!-- Modal: Adicionar Unidade Curricular -->
  <v-dialog v-model="dialogAddUnidade" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
      >
        Adicionar Unidade Curricular
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogAddUnidade = false"
          size="small"
        ></v-btn>
      </v-card-title>
      <v-card-text class="px-5 flex flex-col gap-4 mt-4">
        <!-- Primeiro o prof escolhe a área que ele já tem -->
        <v-select
          v-model="areaSelecionadaFiltro"
          :items="dadosAreas.map(a => a.nome)"
          label="Selecione a Área de Atuação"
          variant="outlined"
          hide-details
        ></v-select>

        <!-- Aí aqui só aparece o que for daquela área! -->
        <v-select
          v-model="novaUnidadeNome"
          :items="unidadesFiltradas"
          label="Selecione a Unidade Curricular"
          variant="outlined"
          hide-details
          :disabled="!areaSelecionadaFiltro"
          :placeholder="areaSelecionadaFiltro ? 'Escolha a unidade' : 'Selecione uma área primeiro'"
          class="mt-1"
        ></v-select>

        <div class="">
          <div class="flex justify-between items-center mb-1">
            <label class="text-sm font-bold text-gray-600 dark:text-white">Nível de Conhecimento</label>
            <span class="text-sm font-bold text-red-600">{{ novoNivelConhecimento }}%</span>
          </div>
          <v-slider
            v-model="novoNivelConhecimento"
            color="red"
            track-color="red-lighten-4"
            min="0"
            max="100" 
            step="1"
            thumb-label
            hide-details
          ></v-slider>
        </div>

      </v-card-text>
      <v-card-actions class="px-5 justify-between mb-2">
        <v-btn color="grey" variant="elevated" @click="dialogAddUnidade = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="salvarUnidade" class="bg-red-600 text-white">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Editar Unidade Curricular — SEM v-if -->
  <v-dialog v-model="dialogEditUnidade" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
      >
        Editar Unidade Curricular
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogEditUnidade = false"
          size="small"
        ></v-btn>
      </v-card-title>
      <div class="my-8" v-if="unidadeSelecionada">
        <v-card-text class="px-5 py-0 flex flex-col gap-4">
          <v-text-field
            v-model="unidadeSelecionada.nome"
            label="Nome da Unidade Curricular"
            variant="outlined"
            hide-details
            readonly
          ></v-text-field>
          <div class="mt-2">
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-bold text-gray-600">Progresso (%)</label>
              <span class="text-sm font-bold text-red-600">{{ unidadeSelecionada.progresso }}%</span>
            </div>
            <v-slider
              v-model="unidadeSelecionada.progresso"
              color="red"
              track-color="red-lighten-4"
              min="0"
              max="100"
              step="1"
              thumb-label
              hide-details
            ></v-slider>
          </div>
        </v-card-text>
        <v-card-actions class="p-0 px-5 flex justify-between mt-6">
          <v-btn color="grey" variant="elevated" @click="dialogEditUnidade = false">Cancelar</v-btn>
          <v-btn
            color="red"
            variant="elevated"
            @click="salvarEdicaoUnidade"
            class="bg-red-600 text-white font-bold"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <!-- Modal: Deletar Unidade Curricular -->
  <v-dialog v-model="dialogDeleteUnidade" max-width="400px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Confirmar Exclusão
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Tem certeza de que deseja excluir
        <strong>{{ unidadeSelecionada?.nome }}</strong>? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteUnidade = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="confirmarDeleteUnidade">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- =============================================
       MODAIS DE CERTIFICAÇÕES
       ============================================= -->

  <!-- Modal: Adicionar Certificação -->
  <v-dialog v-model="dialogAddCertificacao" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
      >
        Adicionar Certificação
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogAddCertificacao = false"
          size="small"
        ></v-btn>
      </v-card-title>
      <v-card-text class="px-5 flex flex-col gap-4 mt-4">
        <v-text-field
          v-model="novaCertificacaoNome"
          label="Nome da Certificação"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-text-field
          v-model="novaCertificacaoInstituicao"
          label="Instituição"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-text-field
          v-model="novaCertificacaoCarga"
          label="Carga Horária (ex: 40h)"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-text-field
          v-model="novaCertificacaoData"
          label="Data de Conclusão"
          variant="outlined"
          hide-details
          type="date"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="px-5 justify-between mb-2">
        <v-btn color="grey" variant="elevated" @click="dialogAddCertificacao = false">Cancelar</v-btn>
        <v-btn
          color="red"
          variant="elevated"
          @click="salvarCertificacao"
          class="bg-red-600 text-white"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Editar Certificação — SEM v-if -->
  <v-dialog v-model="dialogEditCertificacao" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
      >
        Editar Certificação
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogEditCertificacao = false"
          size="small"
        ></v-btn>
      </v-card-title>
      <div class="my-8" v-if="certificacaoSelecionada">
        <v-card-text class="px-5 py-0 flex flex-col gap-4">
          <v-text-field
            v-model="certificacaoSelecionada.nome"
            label="Nome da Certificação"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="certificacaoSelecionada.instituicao"
            label="Instituição"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="certificacaoSelecionada.cargaHoraria"
            label="Carga Horária"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="certificacaoSelecionada.data"
            label="Data de Conclusão"
            variant="outlined"
            hide-details
            type="date"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="p-0 px-5 flex justify-between mt-6">
          <v-btn color="grey" variant="elevated" @click="dialogEditCertificacao = false">
            Cancelar
          </v-btn>
          <v-btn
            color="red"
            variant="elevated"
            @click="salvarEdicaoCertificacao"
            class="bg-red-600 text-white font-bold"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <!-- Modal: Deletar Certificação -->
  <v-dialog v-model="dialogDeleteCertificacao" max-width="400px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Excluir Certificação
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Deseja excluir a certificação
        <strong>{{ certificacaoSelecionada?.nome }}</strong>?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteCertificacao = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="confirmarDeleteCertificacao">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>