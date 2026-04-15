<script setup>


const dados = [

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
  <v-table class="">
    <thead>
      <tr>
        <th class="text-center bg-gray-200">
          Competências
        </th>
        <th class="text-center bg-gray-200">
          Áreas
        </th>
        <th class="text-center bg-gray-200">
          Descrição
        </th>
        <th class="text-center bg-gray-200">
          Ações
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in dados"
        :key="item.nome"
      >
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
</template>


