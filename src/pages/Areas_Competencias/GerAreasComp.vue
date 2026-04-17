<script setup>
import Menu from '@/components/Menu.vue';
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

const tags = [
  'Áreas',
  'Competências',
]

const selecionado = ref("Áreas")

const dialogAdd = ref(false)
const dialogEdit = ref(false)
const dialogDelete = ref(false)



const dadosAreas = [

  {
    nome: "Tecnologia",
    quantidade: "10",

  },
  {
    nome: "Tecnologia",
    quantidade: "10",
  },
  {
    nome: "Tecnologia",
    quantidade: "10",
  },
  {
    nome: "Tecnologia",
    quantidade: "10",
  },
  {
    nome: "Tecnologia",
    quantidade: "10",
  },
  {
    nome: "Tecnologia",
    quantidade: "10",
  },

]


const dadosCompetencias = [

  {
    nome: "Power BI",
    area: "Tecnologia",
    descricao: "Desenvolver relatórios e painéis interativos para análise de dados.",

  },
  {
    nome: "Front-End",
    area: "Tecnologia",
    descricao: "Desenvolver in  terfaces de usuário para aplicações web.",
  },
  {
    nome: "Power BI",
    area: "Tecnologia",
    descricao: "Desenvolver relatórios e painéis interativos para análise de dados.",

  },
  {
    nome: "Front-End",
    area: "Tecnologia",
    descricao: "Desenvolver in  terfaces de usuário para aplicações web.",
  },
  {
    nome: "Power BI",
    area: "Tecnologia",
    descricao: "Desenvolver relatórios e painéis interativos para análise de dados.",

  },
  {
    nome: "Front-End",
    area: "Tecnologia",
    descricao: "Desenvolver in  terfaces de usuário para aplicações web.",
  },
  {
    nome: "Back-End",
    area: "Tecnologia",
    descricao: "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
  {
    nome: "Banco de Dados",
    area: "Tecnologia",
    descricao: "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
  {
    nome: "Python",
    area: "Tecnologia",
    descricao: "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },
  {
    nome: "Java",
    area: "Tecnologia",
    descricao: "Desenvolver a lógica de negócio e integração com o banco de dados.",
  },

]


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
            <v-list-item v-for="(item, index) in items" :key="index" :value="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-avatar :image="user.foto"></v-avatar>
    </div>
  </Menu>
  <div class="mx-5 md:mx-20! lg:mx-50!">
    <h1 class="text-3xl font-bold my-4 break-words">Gerenciamento de Áreas e Competências</h1>

    <v-sheet class="relative top-1 px-1 ">
      <v-chip-group selected-class="text-white bg-red-600!" mandatory v-model="selecionado" class="relative top-1!">
        <v-chip v-for="(tag) in tags" :key="tag" :value="tag" :text="tag"
          class="flex justify-center m-0! w-[150px]! p-5 font-bold" rounded="md"></v-chip>
      </v-chip-group>
    </v-sheet>
    <v-card class="border-t-4 border-red-600 px-8 rounded-lg shadow-lg py-8">
      <div class="flex flex-col-reverse sm:flex-row justify-between gap-4">
        <v-text-field label="Pesquisar..." type="text" variant="filled" hide-details></v-text-field>
        <v-btn class="h-14 bg-red-500! text-white" @click="dialogAdd = true">Adicionar Área e Competência</v-btn>
      </div>

      <v-table class="mt-8" v-if="selecionado == 'Áreas'" fixed-header height="400px">
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
            <td class="text-center font-bold dark:text-white">{{ item.nome }}</td>
            <td class="text-center font-bold dark:text-white">{{ item.quantidade }}</td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn icon="mdi-pencil" color="primary" size="small" @click="dialogEdit = true"
                  class="dark:bg-[#121212]"></v-btn>
                <v-btn icon="mdi-delete" color="error" size="small" @click="dialogDelete = true"
                  class="dark:bg-[#121212]"></v-btn>
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
            <td class="text-center font-bold dark:text-white">{{ item.nome }}</td>
            <td class="text-center font-bold">
              <p class="p-2 bg-gray-200 dark:bg-[#121212] rounded-lg">{{ item.area }}</p>
            </td>
            <td class="text-center font-bold dark:text-white">{{ item.descricao }}</td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn icon="mdi-pencil" color="primary" size="small" @click="dialogEdit = true"></v-btn>
                <v-btn icon="mdi-delete" color="error" size="small" @click="dialogDelete = true"></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

    </v-card>
  </div>


  <v-dialog v-model="dialogAdd" max-width="600px">
    <v-card class="rounded-lg">
      <v-card-title class="text-lg font-bold bg-red-600 text-white pa-4">
        Adicionar Área / Competência
      </v-card-title>
      <v-card-text class="flex flex-col gap-5 mt-4">
        <v-select label="Área" :items="dadosAreas" item-title="nome" item-value="nome"
          variant="outlined"
          hide-details
          class=""
          ></v-select>
        <v-text-field label="Nome da Competência" variant="outlined" class=""
        hide-details
        
        ></v-text-field>
        <v-textarea label="Descrição da Competência" variant="outlined" class="" hide-details></v-textarea>

        <v-btn class="bg-red-600 text-white" variant="elevated">Adicionar</v-btn>

         <v-divider :thickness="4" class="rounded-lg"></v-divider>

         <div class="h-auto p-5 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2 ">
            <div v-for="item in dadosCompetencias" :key="item.nome" class="flex flex-col h-60 gap-2 bg-gray-100 dark:bg-black p-5 rounded-lg border-b-4! border-red-600!">
              <p class="text-md font-bold dark:text-white uppercase shrink-0">{{ item.nome }}</p>
              <p class="text-sm font-bold dark:text-white text-gray-700 uppercase shrink-0">{{ item.area }}</p>
              
              <div class="flex-1 overflow-y-auto pr-1">
                <p class="text-sm font-bold dark:text-white text-gray-500">{{ item.descricao }}</p>
              </div>
              
              <div class="flex gap-2 justify-end align-center mt-auto shrink-0 pt-2">
                <v-btn icon="mdi-pencil" color="primary" size="x-small" density="compact" class="dark:bg-[#121212]" @click="dialogEdit = true"></v-btn>
                <v-btn icon="mdi-delete" color="error" size="x-small" density="compact" class="dark:bg-[#121212]" @click="dialogDelete = true"></v-btn> 
              </div>
            </div>
         </div>



      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="elevated" @click="dialogAdd = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="dialogAdd = false">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogEdit" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-blue-600 text-white pa-4">
        Editar Registro
      </v-card-title>
      <v-card-text class="pa-4">
        <v-text-field label="Nome" variant="outlined" class="mb-4"></v-text-field>
        <v-text-field label="Área / Categoria" variant="outlined" class="mb-4"></v-text-field>
        <v-textarea label="Descrição (se houver)" variant="outlined"></v-textarea>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogEdit = false">Cancelar</v-btn>
        <v-btn color="blue" variant="elevated" @click="dialogEdit = false">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 bg-red-600 text-white pa-4">
        Confirmar Exclusão
      </v-card-title>
      <v-card-text class="pa-4 text-center text-lg">
        Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialogDelete = false">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="dialogDelete = false">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>



</template>
