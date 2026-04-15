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
<div class="mx-50!">    
<h1 class="text-2xl font-bold text-center mt-8">Gerenciamento de Áreas e Competências</h1>

  <v-sheet class="relative top-1 px-1">
    <v-chip-group
      selected-class="text-red-600"
      mandatory
      
    >
      <v-chip
        v-for="tag in tags"
        :key="tag"
        :text="tag"
        class="m-0"
      ></v-chip>
    </v-chip-group>
  </v-sheet>
  <v-card class="border-t-4 border-red-600 px-8 rounded-lg shadow-lg py-8">
    <div class="flex justify-between gap-4">
      <v-text-field label="Nome da Área" type="text" variant="filled" hide-details></v-text-field>
      <v-btn color="red" class="h-14">Adicionar Área e Competência</v-btn>
    </div>
  </v-card>
</div>



</template>
