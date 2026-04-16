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

const tags = ["Áreas", "Competências"];

const selectedTag = ref("Áreas");

const dados_area = [
  {
    nome: "Power BI",
    quantidade: "10",
  },
  {
    nome: "Front-End",
    quantidade: "10",
  },
  {
    nome: "Back-End",
    quantidade: "10",
  },
  {
    nome: "Banco de Dados",
    quantidade: "10",
  },
  {
    nome: "Python",
    quantidade: "10",
  },
  {
    nome: "Java",
    quantidade: "10",
  },
];

const dados = [
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

const areas = [
  { label: "Tecnologia", value: "tecnologia" },
  { label: "Manutenção", value: "manutenção" },
  { label: "Elétrica", value: "eletrica" },
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
  <div class="mx-5 lg:mx-50!">
    <h1 class="text-2xl md:text-4xl font-bold mt-10 mb-3">
      Gerenciamento de Áreas e Competências
    </h1>

    <v-sheet class="relative top-1">
      <v-chip-group
        v-model="selectedTag"
        selected-class="bg-red-600 text-white"
        mandatory
      >
        <v-chip
          v-for="tag in tags"
          :key="tag"
          :value="tag"
          :text="tag"
          rounded="md"
          class="m-0 w-[150px]! flex justify-center"
        ></v-chip>
      </v-chip-group>
    </v-sheet>
    <v-card class="border-t-4 border-red-600 px-8 rounded-lg shadow-lg py-8">
      <div class="gap-10 md:gap-5 md:flex justify-between mb-8">
        <v-btn color="bg-red-500 text-white" class="md:hidden h-14 mb-4 w-full"
          >Adicionar Área e Competência</v-btn
        >
        <v-text-field
          label="Buscar Área ou Competência"
          type="text"
          variant="filled"
          hide-details
        ></v-text-field>

        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              color="bg-red-500 text-white"
              text="Adicionar Área e Competência"
              variant="flat"
              class="hidden h-14 md:block"
            ></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card class="px-8 flex flex-col gap-4">
              <div class="flex justify-between mt-2 mb-6">
                <v-card-title class="flex items-center p-0">Adicionar Área e Competência</v-card-title>
                <v-btn @click="isActive.value = false" variant="text" icon="mdi-close"  class="p-0"></v-btn>
              </div>
            
              <v-select
                label="Área"
                :items="areas"
                item-title="label"
                item-value="value"
                hide-details
              ></v-select>
              <v-text-field
                label="Nome da Competência"
                type="text"
                variant="filled"
                hide-details
              ></v-text-field>
              <v-textarea
                label="Descrição"
                rows="4"
                hide-details
                class="mb-8"
              ></v-textarea>

              
            </v-card>
          </template>
        </v-dialog>
      </div>
      <v-table v-if="selectedTag === 'Áreas'">
        <thead>
          <tr class="">
            <th class="text-center bg-gray-200 dark:bg-[#121212]">
              Nome da Área
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212]">
              Quantidade de Competências
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212]">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dados_area" :key="item.nome">
            <td class="text-center">{{ item.nome }}</td>
            <td class="text-center">{{ item.quantidade }}</td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn icon="mdi-pencil" color="primary" size="small"></v-btn>
                <v-btn icon="mdi-delete" color="error" size="small"></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-table v-else>
        <thead>
          <tr>
            <th class="text-center bg-gray-200 dark:bg-[#121212]">
              Competências
            </th>
            <th class="text-center bg-gray-200 dark:bg-[#121212]">Áreas</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212]">Descrição</th>
            <th class="text-center bg-gray-200 dark:bg-[#121212]">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dados" :key="item.nome">
            <td class="text-center">{{ item.nome }}</td>
            <td class="text-center">{{ item.area }}</td>
            <td class="text-center">{{ item.descricao }}</td>

            <td>
              <div class="flex gap-2 justify-center">
                <v-btn icon="mdi-pencil" color="primary" size="small"></v-btn>
                <v-btn icon="mdi-delete" color="error" size="small"></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>
