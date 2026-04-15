<script setup>


const dados = [

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

]


</script>

<template>
  <v-table class="">
    <thead>
      <tr>
        <th class="text-center bg-gray-200">
          Nome da Área
        </th>
        <th class="text-center bg-gray-200">
          Quantidade de Competências
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
</template>


