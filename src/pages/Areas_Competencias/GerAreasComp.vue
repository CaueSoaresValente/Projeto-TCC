<script setup>
// ============================================================
// GerAreasComp.vue — Gerenciamento de Áreas e Competências
// ============================================================
// ANTES: Os dados eram "hardcoded" (escritos direto no código).
// AGORA: Os dados vêm do banco de dados via API.
//
// FLUXO:
// 1. Quando a tela abre, chamamos listarAreas() e listarCompetencias()
// 2. Os dados são carregados do banco e aparecem na tabela
// 3. Quando o usuário clica "Adicionar", chamamos criarArea() ou criarCompetencia()
// 4. Quando edita, chamamos editarArea() ou editarCompetencia()
// 5. Quando exclui, chamamos excluirArea() ou excluirCompetencia()
// ============================================================

import Menu from "@/components/Menu.vue";
import { ref, onMounted, watch } from "vue";

// Importa as funções que falam com o backend
import {
  listarAreas,
  criarArea,
  editarArea,
  excluirArea,
  listarCompetencias,
  criarCompetencia,
  editarCompetencia,
  excluirCompetencia,
} from "@/services/api";

// ====================== ESTADO DA TELA ======================

// Controla qual aba está selecionada: "Áreas" ou "Competências"
const tags = ["Áreas", "Unidades Curriculares"];
const selecionado = ref("Áreas");

// Arrays que guardam os dados vindos do banco
const dadosAreas = ref([]);
const dadosCompetencias = ref([]);

// Controla o loading (carregando...)
const loading = ref(false);

// ====================== DIALOGS (MODAIS) ======================

// Modais de Área
const dialogAddArea = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);

// Modais de Competência
const dialogAdd = ref(false);
const dialogEditCompetencia = ref(false);
const dialogDeleteCompetencia = ref(false);

// ====================== CAMPOS DOS FORMULÁRIOS ======================

// Campos para criar/editar Área
const novaAreaNome = ref("");
const areaEditando = ref(null); // Guarda a área que está sendo editada
const areaEditNome = ref("");
const areaDeletando = ref(null); // Guarda a área que será excluída

// Campos para criar/editar Competência
const areaSelecionada = ref(null);
const novaCompetenciaNome = ref("");
const novaCompetenciaDescricao = ref("");
const competenciaEditando = ref(null);
const competenciaEditNome = ref("");
const competenciaEditDescricao = ref("");
const competenciaEditArea = ref(null);
const competenciaDeletando = ref(null);

// ====================== CARREGAR DADOS DO BANCO ======================

// Função que busca todas as áreas do banco
async function carregarAreas() {
  try {
    loading.value = true;
    const areas = await listarAreas();
    // Para cada área, calcula a quantidade de competências
    dadosAreas.value = areas.map((area) => ({
      ...area,
      quantidade: area.unidadesCurriculares ? area.unidadesCurriculares.length : 0,
    }));
  } catch (error) {
    console.error("Erro ao carregar áreas:", error);
  } finally {
    loading.value = false;
  }
}

// Função que busca todas as competências do banco
async function carregarCompetencias() {
  try {
    loading.value = true;
    const competencias = await listarCompetencias();
    dadosCompetencias.value = competencias;
  } catch (error) {
    console.error("Erro ao carregar competências:", error);
  } finally {
    loading.value = false;
  }
}

// ====================== AÇÕES DE ÁREA ======================

// Salvar nova área no banco
async function salvarNovaArea() {
  if (!novaAreaNome.value.trim()) return;
  try {
    await criarArea({ nome: novaAreaNome.value.trim() });
    novaAreaNome.value = "";
    dialogAddArea.value = false;
    // Recarrega a lista para mostrar a nova área
    await carregarAreas();
  } catch (error) {
    console.error("Erro ao criar área:", error);
    alert("Erro ao criar área: " + error.message);
  }
}

// Abre o modal de edição com os dados da área
function abrirEditarArea(area) {
  areaEditando.value = area;
  areaEditNome.value = area.nome;
  dialogEdit.value = true;
}

// Salva a edição da área no banco
async function salvarEditArea() {
  if (!areaEditNome.value.trim() || !areaEditando.value) return;
  try {
    await editarArea(areaEditando.value.idArea, { nome: areaEditNome.value.trim() });
    dialogEdit.value = false;
    await carregarAreas();
    await carregarCompetencias();
  } catch (error) {
    console.error("Erro ao editar área:", error);
    alert("Erro ao editar área: " + error.message);
  }
}

// Abre o modal de confirmação de exclusão
function abrirDeletarArea(area) {
  areaDeletando.value = area;
  dialogDelete.value = true;
}

// Exclui a área do banco
async function confirmarDeleteArea() {
  if (!areaDeletando.value) return;
  try {
    await excluirArea(areaDeletando.value.idArea);
    dialogDelete.value = false;
    await carregarAreas();
    await carregarCompetencias();
  } catch (error) {
    console.error("Erro ao excluir área:", error);
    alert("Erro ao excluir área: " + error.message);
  }
}

// ====================== AÇÕES DE COMPETÊNCIA ======================

// Salvar nova competência no banco
async function salvarNovaCompetencia() {
  if (!novaCompetenciaNome.value.trim() || !areaSelecionada.value) return;
  try {
    await criarCompetencia({
      nome: novaCompetenciaNome.value.trim(),
      descricao: novaCompetenciaDescricao.value.trim(),
      idArea: areaSelecionada.value,
    });
    novaCompetenciaNome.value = "";
    novaCompetenciaDescricao.value = "";
    areaSelecionada.value = null;
    dialogAdd.value = false;
    await carregarCompetencias();
    await carregarAreas(); // Atualiza a contagem de competências por área
  } catch (error) {
    console.error("Erro ao criar competência:", error);
    alert("Erro ao criar competência: " + error.message);
  }
}

// Abre o modal de edição de competência
function abrirEditarCompetencia(comp) {
  competenciaEditando.value = comp;
  competenciaEditNome.value = comp.nome;
  competenciaEditDescricao.value = comp.descricao || "";
  competenciaEditArea.value = comp.idArea;
  dialogEditCompetencia.value = true;
}

// Salva a edição da competência
async function salvarEditCompetencia() {
  if (!competenciaEditNome.value.trim() || !competenciaEditando.value) return;
  try {
    await editarCompetencia(competenciaEditando.value.idUC, {
      nome: competenciaEditNome.value.trim(),
      descricao: competenciaEditDescricao.value.trim(),
      idArea: competenciaEditArea.value,
    });
    dialogEditCompetencia.value = false;
    await carregarCompetencias();
  } catch (error) {
    console.error("Erro ao editar competência:", error);
    alert("Erro ao editar competência: " + error.message);
  }
}

// Abre o modal de confirmação de exclusão
function abrirDeletarCompetencia(comp) {
  competenciaDeletando.value = comp;
  dialogDeleteCompetencia.value = true;
}

// Exclui a competência do banco
async function confirmarDeleteCompetencia() {
  if (!competenciaDeletando.value) return;
  try {
    await excluirCompetencia(competenciaDeletando.value.idUC);
    dialogDeleteCompetencia.value = false;
    await carregarCompetencias();
    await carregarAreas(); // Atualiza a contagem
  } catch (error) {
    console.error("Erro ao excluir competência:", error);
    alert("Erro ao excluir competência: " + error.message);
  }
}

// ====================== LIFECYCLE ======================
// onMounted = "quando a tela abrir, faça isso"
onMounted(async () => {
  await carregarAreas();
  await carregarCompetencias();
});

// Limpa os campos quando o modal de adicionar competência abre
watch(dialogAdd, (val) => {
  if (val) {
    areaSelecionada.value = null;
    novaCompetenciaNome.value = "";
    novaCompetenciaDescricao.value = "";
  }
});

// Limpa o campo quando o modal de adicionar área abre
watch(dialogAddArea, (val) => {
  if (val) {
    novaAreaNome.value = "";
  }
});
</script>

<template>
  <Menu />
  <div class="px-4 md:px-10 lg:px-20 xl:px-40 pb-10">
    <h1 class="text-3xl font-bold my-4 break-words">
      Gerenciamento de Áreas e Unidades Curriculares
    </h1>

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
          class="flex justify-center m-0! w-[150px]! p-5 font-bold"
          rounded="md"
        ></v-chip>
      </v-chip-group>
    </v-sheet>
    <v-card class="border-t-4 border-red-600 px-8 rounded-lg shadow-lg py-8">
      <div class="flex flex-col-reverse sm:flex-row justify-between gap-4">
        <v-text-field
          label="Pesquisar..."
          type="text"
          variant="filled"
          hide-details
        ></v-text-field>
        <v-btn class="h-14 bg-red-500! text-white" @click="selecionado == 'Áreas' ? dialogAddArea = true : dialogAdd = true"
          >Adicionar {{ selecionado == 'Áreas' ? 'Área' : 'UC' }}</v-btn
        >
      </div>

      <!-- ====================== TABELA DE ÁREAS ====================== -->
      <v-table
        class="mt-8"
        v-if="selecionado == 'Áreas'"
        fixed-header
        height="400px"
      >
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Nome da Área
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Quantidade de UCs
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Se não tem áreas, mostra mensagem -->
          <tr v-if="dadosAreas.length === 0">
            <td colspan="3" class="text-center text-gray-500 py-8">
              Nenhuma área cadastrada. Clique em "Adicionar Área" para começar.
            </td>
          </tr>
          <tr v-for="item in dadosAreas" :key="item.idArea">
            <td class="text-center font-bold dark:text-white">
              {{ item.nome }}
            </td>
            <td class="text-center font-bold dark:text-white">
              {{ item.quantidade }}
            </td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn
                  icon="mdi-pencil"
                  color="primary"
                  size="small"
                  @click="abrirEditarArea(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  @click="abrirDeletarArea(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- ====================== TABELA DE UNIDADES CURRICULARES ====================== -->
      <v-table v-else class="mt-8" fixed-header height="400px">
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Unidade Curricular
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Áreas
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Descrição
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="dadosCompetencias.length === 0">
            <td colspan="4" class="text-center text-gray-500 py-8">
              Nenhuma UC cadastrada. Clique em "Adicionar UC" para começar.
            </td>
          </tr>
          <tr v-for="item in dadosCompetencias" :key="item.idUC">
            <td class="text-center font-bold dark:text-white">
              {{ item.nome }}
            </td>
            <td class="text-center font-bold">
              <p class="p-2 bg-gray-200 dark:bg-[#121212] rounded-lg">
                {{ item.area ? item.area.nome : '—' }}
              </p>
            </td>
            <td class="text-center font-bold dark:text-white">
              {{ item.descricao }}
            </td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  @click="abrirEditarCompetencia(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  size="small"
                  @click="abrirDeletarCompetencia(item)"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>

  <!-- ====================== MODAL: ADICIONAR UNIDADE CURRICULAR ====================== -->
  <v-dialog v-model="dialogAdd" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <div class="flex justify-between items-center w-full">
        <v-card-title
          class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
        >
          Adicionar Unidade Curricular
          <v-btn
            icon="mdi-close"
            color="white"
            variant="text"
            @click="dialogAdd = false"
            size="small"
          ></v-btn>
        </v-card-title>
      </div>
      <v-card-text class="flex flex-col gap-5 mt-1">
        <div class="flex flex-col gap-4">
          <v-select
            v-model="areaSelecionada"
            label="Área"
            :items="dadosAreas"
            item-title="nome"
            item-value="idArea"
            variant="outlined"
            hide-details
          ></v-select>
        </div>

        <v-text-field
          v-model="novaCompetenciaNome"
          label="Nome da UC"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-textarea
          v-model="novaCompetenciaDescricao"
          label="Descrição da UC"
          variant="outlined"
          hide-details
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="pa-4 justify-between mb-2">
        <v-btn
          color="grey"
          variant="elevated"
          @click="dialogAdd = false"
          class="dark:bg-[#414141] dark:text-white"
          >Cancelar</v-btn
        >
        <v-btn
          color="red"
          variant="elevated"
          @click="salvarNovaCompetencia"
          class="dark:bg-red-600 dark:text-white bg-red-600 text-white"
          >Salvar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ====================== MODAL: EDITAR ÁREA ====================== -->
  <v-dialog v-model="dialogEdit" max-width="600px" persistent v-if="dialogEdit">
    <v-card class="">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white w-full flex items-center justify-between"
      >
        Editar Área
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogEdit = false"
          size="small"
        ></v-btn>
      </v-card-title>

      <div>
        <v-card-text class="mt-5 px-5 py-0">
          <v-text-field
            v-model="areaEditNome"
            label="Nome"
            variant="outlined"
            class="mb-4"
            hide-details
          ></v-text-field>
          <v-text-field
            :model-value="areaEditando?.quantidade || 0"
            label="Quantidade de UCs"
            variant="outlined"
            class="mb-4"
            hide-details
            type="number"
            disabled
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="mb-3 p-0 px-5 flex justify-between">
          <v-btn
            color="red"
            variant="elevated"
            @click="dialogEdit = false"
            class="dark:bg-red-600 dark:text-white text-black"
            >Cancelar</v-btn
          >
          <v-btn
            color="red"
            variant="elevated"
            @click="salvarEditArea"
            class="dark:bg-red-600 dark:text-white bg-red-600 text-white font-bold"
            >Salvar</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <!-- ====================== MODAL: EDITAR UNIDADE CURRICULAR ====================== -->
  <v-dialog v-model="dialogEditCompetencia" max-width="600px" persistent v-if="dialogEditCompetencia">
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white w-full flex items-center justify-between"
      >
        Editar Unidade Curricular
        <v-btn
          icon="mdi-close"
          color="white"
          variant="text"
          @click="dialogEditCompetencia = false"
          size="small"
        ></v-btn>
      </v-card-title>

      <div class="my-8">
        <v-card-text class="px-5 py-0 flex flex-col gap-4">
          <v-text-field
            v-model="competenciaEditNome"
            label="Nome da UC"
            variant="outlined"
            hide-details
          ></v-text-field>
          
          <v-select
            v-model="competenciaEditArea"
            label="Área"
            :items="dadosAreas"
            item-title="nome"
            item-value="idArea"
            variant="outlined"
            hide-details
          ></v-select>

          <v-textarea
            v-model="competenciaEditDescricao"
            label="Descrição"
            variant="outlined"
            hide-details
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="p-0 px-5 flex justify-between mt-6">
          <v-btn
            color="red"
            variant="elevated"
            @click="dialogEditCompetencia = false"
            class="dark:bg-red-600 dark:text-white text-black"
            >Cancelar</v-btn
          >
          <v-btn
            color="red"
            variant="elevated"
            @click="salvarEditCompetencia"
            class="dark:bg-red-600 dark:text-white bg-red-600 text-white font-bold"
            >Salvar</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <!-- ====================== MODAL: EXCLUIR ÁREA ====================== -->
  <v-dialog v-model="dialogDelete" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Confirmar Exclusão
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Tem certeza de que deseja excluir a área <b>{{ areaDeletando?.nome }}</b>? Esta ação não pode ser
        desfeita.
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDelete = false"
          >Cancelar</v-btn
        >
        <v-btn color="red" variant="elevated" @click="confirmarDeleteArea"
          >Excluir</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ====================== MODAL: ADICIONAR ÁREA ====================== -->
  <v-dialog v-model="dialogAddArea" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between">
        Adicionar Nova Área
        <v-btn icon="mdi-close" color="white" variant="text" @click="dialogAddArea = false" size="small"></v-btn>
      </v-card-title>
      <v-card-text class="px-5">
        <v-text-field
          v-model="novaAreaNome"
          label="Nome da Área"
          variant="outlined"
          hide-details
          @keyup.enter="salvarNovaArea"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="px-5 justify-between mb-2">
        <v-btn color="grey" variant="elevated" @click="dialogAddArea = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="salvarNovaArea" class="bg-red-600 text-white">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ====================== MODAL: EXCLUIR UNIDADE CURRICULAR ====================== -->
  <v-dialog v-model="dialogDeleteCompetencia" max-width="400px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Excluir Unidade Curricular
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Deseja excluir a unidade curricular <b>{{ competenciaDeletando?.nome }}</b>?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteCompetencia = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="confirmarDeleteCompetencia">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
