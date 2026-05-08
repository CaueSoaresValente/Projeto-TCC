<script setup>
import Menu from "@/components/Menu.vue";
import { ref, watch, computed } from "vue";

// Dados do usuário logado
const user = ref({
  name: "User",
  foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

// Itens do menu dropdown do avatar
const items = ref([
  { title: "Perfil" },
  { title: "Configurações" },
  { title: "Sair" },
]);

// Abas: igual ao GerAreasComp, mas com "Unidades Curriculares" e "Certificações"
const tags = ["Unidades Curriculares", "Certificações"];
const selecionado = ref("Unidades Curriculares");
const searchQuery = ref("");

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

// Lista de unidades curriculares cadastradas pelo OPP
const unidadesDisponiveis = [
  "Banco de Dados",
  "Back-end",
  "Front-end",
  "Internet das Coisas",
  "Android/Kotlin",
  "Projetos",
  "Power BI",
  "Inteligência Artificial",
  "Cibersegurança",
  "Redes de Computadores",
];

// =============================================
// DADOS DAS CERTIFICAÇÕES (mock)
// =============================================
const dadosCertificacoes = ref([
  { nome: "AWS Cloud Practitioner", instituicao: "Amazon", data: "2024-03-15", cargaHoraria: "40h" },
  { nome: "Scrum Foundation", instituicao: "CertiProf", data: "2023-11-20", cargaHoraria: "16h" },
  { nome: "Google Data Analytics", instituicao: "Google", data: "2024-01-10", cargaHoraria: "120h" },
]);

// =============================================
// PROPRIEDADES COMPUTADAS PARA PESQUISA
// =============================================
const filteredUnidades = computed(() => {
  return dadosUnidades.value.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredCertificacoes = computed(() => {
  return dadosCertificacoes.value.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.instituicao.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// =============================================
// CONTROLE DOS MODAIS (dialogs)
// =============================================
// Modais de Unidades Curriculares
const dialogAddUnidade = ref(false);
const dialogEditUnidade = ref(false);
const dialogDeleteUnidade = ref(false);

// Modais de Certificações
const dialogAddCertificacao = ref(false);
const dialogEditCertificacao = ref(false);
const dialogDeleteCertificacao = ref(false);

// =============================================
// CAMPOS DOS FORMULÁRIOS
// =============================================
// Campos para Unidade Curricular
const novaUnidadeNome = ref("");

// Campos para Certificação
const novaCertificacaoNome = ref("");
const novaCertificacaoInstituicao = ref("");
const novaCertificacaoData = ref("");
const novaCertificacaoCarga = ref("");

// =============================================
// FUNÇÕES DE SALVAR
// =============================================

// Função para salvar uma nova Unidade Curricular
const salvarUnidade = () => {
  if (novaUnidadeNome.value.trim()) {
    dadosUnidades.value.push({
      nome: novaUnidadeNome.value.trim(),
      progresso: 0,
    });
    novaUnidadeNome.value = "";
    dialogAddUnidade.value = false;
  }
};

// Função para salvar uma nova Certificação
const salvarCertificacao = () => {
  if (novaCertificacaoNome.value.trim()) {
    dadosCertificacoes.value.push({
      nome: novaCertificacaoNome.value.trim(),
      instituicao: novaCertificacaoInstituicao.value.trim() || "—",
      data: novaCertificacaoData.value || "—",
      cargaHoraria: novaCertificacaoCarga.value.trim() || "0h",
    });
    novaCertificacaoNome.value = "";
    novaCertificacaoInstituicao.value = "";
    novaCertificacaoData.value = "";
    novaCertificacaoCarga.value = "";
    dialogAddCertificacao.value = false;
  }
};

// =============================================
// WATCHERS (limpa os campos quando abre o modal)
// =============================================
watch(dialogAddUnidade, (val) => {
  if (val) {
    novaUnidadeNome.value = "";
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
  <!-- Menu do topo (igual nas outras telas) -->
  <Menu>
    <div class="flex h-full items-center justify-end gap-4 mt-5">
      <p class="hidden sm:block">Bem vindo, {{ user.name }}!</p>

      <div class="d-flex justify-space-around">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-chevron-down" v-bind="props"></v-icon>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" :value="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-avatar :image="user.foto"></v-avatar>
    </div>
  </Menu>

  <!-- Conteúdo principal (mesmo modelo do GerAreasComp) -->
  <div class="mx-5 md:mx-20! lg:mx-50!">
    <h1 class="text-3xl font-bold my-4 break-words">
      Meu Perfil
    </h1>

    <!-- Abas: Unidades Curriculares / Certificações -->
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

    <!-- Card principal com a borda vermelha no topo -->
    <v-card class="border-t-4 border-red-600 px-8 rounded-lg shadow-lg py-8">
      <!-- Barra de pesquisa e botão de adicionar -->
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
          @click="selecionado == 'Unidades Curriculares' ? dialogAddUnidade = true : dialogAddCertificacao = true"
        >
          Adicionar {{ selecionado == 'Unidades Curriculares' ? 'Unidade' : 'Certificação' }}
        </v-btn>
      </div>

      <!-- =============================================
           TABELA DE UNIDADES CURRICULARES
           ============================================= -->
      <v-table
        class="mt-8"
        v-if="selecionado == 'Unidades Curriculares'"
        fixed-header
        height="400px"
      >
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Nome da Unidade
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Progresso
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredUnidades" :key="item.nome">
            <td class="text-center font-bold dark:text-white">
              {{ item.nome }}
            </td>
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
                  @click="dialogEditUnidade = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  @click="dialogDeleteUnidade = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- =============================================
           TABELA DE CERTIFICAÇÕES
           ============================================= -->
      <v-table v-else class="mt-8" fixed-header height="400px">
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Certificação
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Instituição
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Carga Horária
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Data
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredCertificacoes" :key="item.nome">
            <td class="text-center font-bold dark:text-white">
              {{ item.nome }}
            </td>
            <td class="text-center font-bold">
              <p class="p-2 bg-gray-200 dark:bg-[#121212] rounded-lg">
                {{ item.instituicao }}
              </p>
            </td>
            <td class="text-center font-bold dark:text-white">
              {{ item.cargaHoraria }}
            </td>
            <td class="text-center font-bold dark:text-white">
              {{ item.data }}
            </td>
            <td>
              <div class="flex gap-2 justify-center">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  @click="dialogEditCertificacao = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  size="small"
                  @click="dialogDeleteCertificacao = true"
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
       MODAIS DE UNIDADES CURRICULARES
       ============================================= -->

  <!-- Modal: Adicionar Unidade Curricular -->
  <v-dialog v-model="dialogAddUnidade" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between">
        Adicionar Unidade Curricular
        <v-btn icon="mdi-close" color="white" variant="text" @click="dialogAddUnidade = false" size="small"></v-btn>
      </v-card-title>
      <v-card-text class="px-5 flex flex-col gap-4 mt-4">
        <v-select
          v-model="novaUnidadeNome"
          :items="unidadesDisponiveis"
          label="Selecione a Unidade Curricular"
          variant="outlined"
          hide-details
        ></v-select>
      </v-card-text>
      <v-card-actions class="px-5 justify-between mb-2">
        <v-btn color="grey" variant="elevated" @click="dialogAddUnidade = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="salvarUnidade" class="bg-red-600 text-white">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Editar Unidade Curricular -->
  <v-dialog v-model="dialogEditUnidade" max-width="600px" persistent v-if="dialogEditUnidade">
    <v-card class="rounded-lg">
      <v-card-title class="text-lg font-bold bg-red-600 text-white w-full flex items-center justify-between">
        Editar Unidade Curricular
        <v-btn icon="mdi-close" color="white" variant="text" @click="dialogEditUnidade = false" size="small"></v-btn>
      </v-card-title>
      <div class="my-8">
        <v-card-text class="px-5 py-0 flex flex-col gap-4">
          <v-text-field
            label="Nome da Unidade Curricular"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            label="Progresso (%)"
            variant="outlined"
            hide-details
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="p-0 px-5 flex justify-between mt-6">
          <v-btn color="red" variant="elevated" @click="dialogEditUnidade = false" class="dark:bg-red-600 dark:text-white text-black">Cancelar</v-btn>
          <v-btn color="red" variant="elevated" @click="dialogEditUnidade = false" class="dark:bg-red-600 dark:text-white bg-red-600 text-white font-bold">Salvar</v-btn>
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
        Tem certeza de que deseja excluir esta unidade curricular? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteUnidade = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="dialogDeleteUnidade = false">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- =============================================
       MODAIS DE CERTIFICAÇÕES
       ============================================= -->

  <!-- Modal: Adicionar Certificação -->
  <v-dialog v-model="dialogAddCertificacao" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between">
        Adicionar Certificação
        <v-btn icon="mdi-close" color="white" variant="text" @click="dialogAddCertificacao = false" size="small"></v-btn>
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
        <v-btn color="red" variant="elevated" @click="salvarCertificacao" class="bg-red-600 text-white">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Editar Certificação -->
  <v-dialog v-model="dialogEditCertificacao" max-width="600px" persistent v-if="dialogEditCertificacao">
    <v-card class="rounded-lg">
      <v-card-title class="text-lg font-bold bg-red-600 text-white w-full flex items-center justify-between">
        Editar Certificação
        <v-btn icon="mdi-close" color="white" variant="text" @click="dialogEditCertificacao = false" size="small"></v-btn>
      </v-card-title>
      <div class="my-8">
        <v-card-text class="px-5 py-0 flex flex-col gap-4">
          <v-text-field
            label="Nome da Certificação"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            label="Instituição"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            label="Carga Horária"
            variant="outlined"
            hide-details
          ></v-text-field>
          <v-text-field
            label="Data de Conclusão"
            variant="outlined"
            hide-details
            type="date"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="p-0 px-5 flex justify-between mt-6">
          <v-btn color="red" variant="elevated" @click="dialogEditCertificacao = false" class="dark:bg-red-600 dark:text-white text-black">Cancelar</v-btn>
          <v-btn color="red" variant="elevated" @click="dialogEditCertificacao = false" class="dark:bg-red-600 dark:text-white bg-red-600 text-white font-bold">Salvar</v-btn>
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
        Deseja excluir a certificação selecionada?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteCertificacao = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="dialogDeleteCertificacao = false">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
