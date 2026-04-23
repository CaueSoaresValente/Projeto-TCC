<script setup>
import Menu from "@/components/Menu.vue";
import { ref, watch } from "vue";

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

const tags = ["Áreas", "Competências"];

const selecionado = ref("Áreas");

const dialogAdd = ref(false); 
const dialogAddArea = ref(false); 
const dialogEdit = ref(false); 
const dialogEditCompetencia = ref(false); 
const dialogDelete = ref(false); 
const dialogDeleteCompetencia = ref(false); 

const mostrarCampoNovaArea = ref(false);
const novaAreaNome = ref("");
const areaSelecionada = ref(null);

const novaCompetenciaNome = ref("");
const novaCompetenciaDescricao = ref("");

const dadosAreas = ref([
  { nome: "Tecnologia", quantidade: "10" },
  { nome: "Manutenção", quantidade: "5" },
  { nome: "Logística", quantidade: "8" },
]);

const salvarNovaArea = () => {
  if (novaAreaNome.value.trim()) {
    const novaArea = {
      nome: novaAreaNome.value.trim(),
      quantidade: "0",
    };
    dadosAreas.value.push(novaArea);
    novaAreaNome.value = "";
    mostrarCampoNovaArea.value = false;
  }
};

watch(dialogAddArea, (val) => {
  if (val) {
    novaAreaNome.value = "";
  }
});


watch(dialogAdd, (val) => {
  if (val) {
    areaSelecionada.value = null;
    novaAreaNome.value = "";
    novaCompetenciaNome.value = "";
    novaCompetenciaDescricao.value = "";
    mostrarCampoNovaArea.value = false;
  }
});

const dadosCompetencias = [
  {
    nome: "Power BI",
    area: "Tecnologia",
    descricao:
      "Desenvolver relatórios e painéis interativos para análise de dados.",
  },
  {
    nome: "Front-End",
    area: "Tecnologia",
    descricao: "Desenvolver in  terfaces de usuário para aplicações web.",
  },
  {
    nome: "Power BI",
    area: "Tecnologia",
    descricao:
      "Desenvolver relatórios e painéis interativos para análise de dados.",
  },
  {
    nome: "Front-End",
    area: "Tecnologia",
    descricao: "Desenvolver in  terfaces de usuário para aplicações web.",
  },
  {
    nome: "Power BI",
    area: "Tecnologia",
    descricao:
      "Desenvolver relatórios e painéis interativos para análise de dados.",
  },
  {
    nome: "Front-End",
    area: "Tecnologia",
    descricao: "Desenvolver in  terfaces de usuário para aplicações web.",
  },
  {
    nome: "Back-End",
    area: "Tecnologia",
    descricao:
      "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
  {
    nome: "Banco de Dados",
    area: "Tecnologia",
    descricao:
      "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
  {
    nome: "Python",
    area: "Tecnologia",
    descricao:
      "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
  {
    nome: "Java",
    area: "Tecnologia",
    descricao:
      "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
];

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
  <div class="mx-5 md:mx-20! lg:mx-50!">
    <h1 class="text-3xl font-bold my-4 break-words">
      Gerenciamento de Áreas e Competências
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
          >Adicionar {{ selecionado == 'Áreas' ? 'Área' : 'Competência' }}</v-btn
        >
      </div>

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
              Quantidade de Competências
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dadosAreas" :key="item.nome">
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
                  @click="dialogEdit = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  @click="dialogDelete = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-table v-else class="mt-8" fixed-header height="400px">
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212] font-bold">
              Competências
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
          <tr v-for="item in dadosCompetencias" :key="item.nome">
            <td class="text-center font-bold dark:text-white">
              {{ item.nome }}
            </td>
            <td class="text-center font-bold">
              <p class="p-2 bg-gray-200 dark:bg-[#121212] rounded-lg">
                {{ item.area }}
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
                  @click="dialogEditCompetencia = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  size="small"
                  @click="dialogDeleteCompetencia = true"
                  class="dark:bg-[#121212]"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>

  <v-dialog v-model="dialogAdd" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <div class="flex justify-between items-center w-full">
        <v-card-title
          class="text-lg font-bold bg-red-600 text-white pa-4 w-full flex items-center justify-between"
        >
          Adicionar Área / Competência
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
            item-value="nome"
            variant="outlined"
            hide-details
          ></v-select>
        </div>

        <v-text-field
          v-model="novaCompetenciaNome"
          label="Nome da Competência"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-textarea
          v-model="novaCompetenciaDescricao"
          label="Descrição da Competência"
          variant="outlined"
          hide-details
        ></v-textarea>

        <v-btn class="bg-red-600 text-white" variant="elevated"
          >Adicionar Competência</v-btn
        >

        <v-divider :thickness="4" class="rounded-lg"></v-divider>

        <div
          class="h-auto p-5 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2"
        >
          <div
            v-for="item in dadosCompetencias"
            :key="item.nome"
            class="flex flex-col h-60 gap-2 bg-gray-100 dark:bg-[#414141] p-5 rounded-lg border-b-4! border-red-600!"
          >
            <p class="text-md font-bold dark:text-white uppercase shrink-0">
              {{ item.nome }}
            </p>
            <p
              class="text-sm font-bold dark:text-white text-gray-700 uppercase shrink-0"
            >
              {{ item.area }}
            </p>

            <div class="flex-1 overflow-y-auto pr-1">
              <p class="text-sm font-bold dark:text-white text-gray-500">
                {{ item.descricao }}
              </p>
            </div>

            <div
              class="flex gap-2 justify-end align-center mt-auto shrink-0 pt-2"
            >
              <v-btn
                icon="mdi-pencil"
                color="primary"
                size="x-small"
                class="dark:bg-[#121212]"
                @click="dialogEditCompetencia = true"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                color="error"
                size="x-small"
                class="dark:bg-[#121212]"
                @click="dialogDeleteCompetencia = true"
              ></v-btn>
            </div>
          </div>
        </div>
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
          @click="dialogAdd = false"
          class="dark:bg-red-600 dark:text-white bg-red-600 text-white"
          >Salvar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogEdit" max-width="600px" persistent v-if="dialogEdit">
    <v-card class="">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white w-full flex items-center justify-between"
      >
        Editar Registro
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
            label="Nome"
            variant="outlined"
            class="mb-4"
            hide-details
          ></v-text-field>
          <v-text-field
            label="Quantidade de Competências"
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
            @click="dialogEdit = false"
            class="dark:bg-red-600 dark:text-white bg-red-600 text-white font-bold"
            >Salvar</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>


<v-dialog v-model="dialogEditCompetencia" max-width="600px" persistent v-if="dialogEditCompetencia">
    <v-card class="rounded-lg">
      <v-card-title
        class="text-lg font-bold bg-red-600 text-white w-full flex items-center justify-between"
      >
        Editar Competência
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
            label="Nome da Competência"
            variant="outlined"
            hide-details
          ></v-text-field>
          
          <v-select
            label="Área"
            :items="dadosAreas"
            item-title="nome"
            item-value="nome"
            variant="outlined"
            hide-details
          ></v-select>

          <v-textarea
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
            @click="dialogEditCompetencia = false"
            class="dark:bg-red-600 dark:text-white bg-red-600 text-white font-bold"
            >Salvar</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>



  <v-dialog v-model="dialogDelete" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Confirmar Exclusão
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Tem certeza de que deseja excluir este registro? Esta ação não pode ser
        desfeita.
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDelete = false"
          >Cancelar</v-btn
        >
        <v-btn color="red" variant="elevated" @click="dialogDelete = false"
          >Excluir</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
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
          @keyup.enter="salvarNovaArea(); dialogAddArea = false"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="px-5 justify-between mb-2">
        <v-btn color="grey" variant="elevated" @click="dialogAddArea = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="salvarNovaArea(); dialogAddArea = false" class="bg-red-600 text-white">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDeleteCompetencia" max-width="400px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Excluir Competência
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Deseja excluir a competência selecionada?
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDeleteCompetencia = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="dialogDeleteCompetencia = false">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

