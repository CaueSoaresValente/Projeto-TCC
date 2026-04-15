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

const turmas = [
    { label: "CPTMTDS04", value: "cptmtds04", modalidade: "tec", siglas: "M01", areas: ["Tecnologia", "Software"] },
    { label: "CPTMTDS03", value: "cptmtds03", modalidade: "fic", siglas: "M02", areas: ["Manutenção", "Hardware"] },
    { label: "CPTMTDS02", value: "cptmtds02", modalidade: "cai", siglas: "T01", areas: ["Elétrica", "Automação"] },
    { label: "CPTMTDS01", value: "cptmtds01", modalidade: "tec", siglas: "T02", areas: ["Tecnologia", "Cloud"] },
    { label: "CPTMTDS04", value: "cptmtds04", modalidade: "tec", siglas: "N01", areas: ["Software", "Web"] },
    { label: "CPTMTDS03", value: "cptmtds03", modalidade: "fic", siglas: "N02", areas: ["Redes", "Infra"] },
    { label: "CPTMTDS02", value: "cptmtds02", modalidade: "cai", siglas: "INT", areas: ["Elétrica"] },
    { label: "CPTMTDS01", value: "cptmtds01", modalidade: "tec", siglas: "INT", areas: ["Tecnologia"] },
    { label: "CPTMTDS04", value: "cptmtds04", modalidade: "tec", siglas: "INT", areas: ["Mobile"] },
    { label: "CPTMTDS03", value: "cptmtds03", modalidade: "fic", siglas: "INT", areas: ["Gestão"] },
    { label: "CPTMTDS02", value: "cptmtds02", modalidade: "cai", siglas: "INT", areas: ["Mecânica"] },
    { label: "CPTMTDS01", value: "cptmtds01", modalidade: "tec", siglas: "INT", areas: ["Design"] },
];

const selectedAreas = ref([]);
const areasDisponiveis = [...new Set(turmas.flatMap(t => t.areas))];

const tipoCurso = ref('tec');

const diasDaSemana = ref([
    { label: "Segunda-feira", value: "segunda" },
    { label: "Terça-feira", value: "terca" },
    { label: "Quarta-feira", value: "quarta" },
    { label: "Quinta-feira", value: "quinta" },
    { label: "Sexta-feira", value: "sexta" },
    { label: "Sábado", value: "sabado" },
]);


const selectedPeriodo = ref({
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: [],
});

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

    <div class="flex justify-between mx-50! mt-8">
        <div>
            <p class="text-4xl font-bold">Adicionar Turma</p>
            <p>Preencha as informações necessárias para adicionar uma turma</p>
        </div>
        <div class="hidden lg:flex relative top-8.5">
            <img src="@/assets/prototipo_opp.png" alt="Desenho de um professor" width="200px">
        </div>
    </div>

    <div class="mx-2 border-t-4 border-red-600 mt-3 px-8 rounded-lg shadow-lg py-8 mx-50!">

        <div class="mx-5">
            <div class="mb-6">
                <p class="mb-2 font-bold">Nome da Turma</p>
                <v-text-field label="Digite o nome..." variant="filled" hide-details></v-text-field>
            </div>

            <div class="sm:flex justify-between items-start gap-10">
                <div class="w-full mb-6">
                    <p class="mb-2 font-bold">Áreas</p>
                    <v-select v-model="selectedAreas" chips label="Selecione..." :items="areasDisponiveis"
                        multiple variant="filled" hide-details></v-select>
                </div>


                <div class="mb-6">
                    <p class="font-bold mb-2">Tipos de curso</p>
                    <v-radio-group v-model="tipoCurso" inline hide-details>
                        <v-radio class="font-bold" label="TÉC" value="tec" color="red"></v-radio>
                        <v-radio class="font-bold" label="CAI" value="cai" color="red"></v-radio>
                        <v-radio class="font-bold" label="FIC" value="fic" color="red"></v-radio>
                    </v-radio-group>
                </div>
            </div>

        </div>

        <v-divider :thickness="4" class="my-1 mx-3 md:flex mb-2"></v-divider>

        <div class="flex mx-5 sm:gap-8">
            <div class="w-full flex flex-col gap-4">
                <p class="mt-5 font-bold">Dias da Semana</p>
                <div
                    class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                    <div v-for="(dia, index) in diasDaSemana" :key="index">
                        <p class="mb-2 font-bold text-sm text-gray-600">{{ dia.label }}</p>
                        <v-select v-model="selectedPeriodo[dia.value]" chips label="Período"
                            :items="['M01', 'M02', 'T01', 'T02', 'N01', 'N02', 'INT']" multiple
                            variant="filled" hide-details></v-select>
                    </div>
                </div>
                
                <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 mb-4">
                    <div>
                        <p class="font-bold mb-2 font-bold text-sm text-gray-600">Início</p>
                        <v-text-field label="Selecione data" type="date" variant="filled" hide-details></v-text-field>
                    </div>

                    <div>
                        <p class="font-bold mb-2 font-bold text-sm text-gray-600">Fim</p>
                        <v-text-field label="Selecione data" type="date" variant="filled" hide-details></v-text-field>
                    </div>

                    <div>
                        <p class="font-bold mb-2 font-bold text-sm text-gray-600">Aulas por semana</p>  
                        <v-text-field label="Aulas por semana" variant="filled" hide-details type="number"></v-text-field>
                    </div>

                    <div>
                        <p class="font-bold mb-2 font-bold text-sm text-gray-600">Total de aulas</p>
                        <v-text-field label="Total de aulas" variant="filled" hide-details type="number"></v-text-field>
                    </div>
                </div>
            </div>


            <div class="mb-4 mt-5">
                <div class="hidden lg:block md:row-span-1 lg:row-span-2 min-w-[250px]">
                    <v-card class="mt-4 border-t-6 border-red-600 p-5 shadow-lg h-fit">
                        <div class="flex items-center gap-3 mb-2">
                            <v-icon size="36" icon="mdi-book-open-outline" color="grey-darken-3"></v-icon>
                            <h2 class="text-lg font-medium text-grey-darken-3">Legenda</h2>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <p class="font-bold mb-1">Manhã</p>
                                <ul class="list-none space-y-1 ml-2">
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>M01</b> &rarr; Antes do intervalo
                                    </li>
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>M02</b> &rarr; Depois do intervalo
                                    </li>
                                </ul>
                            </div>

                            <v-divider class="opacity-100"></v-divider>

                            <div>
                                <p class="font-bold mb-1">Tarde</p>
                                <ul class="list-none space-y-1 ml-2">
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>T01</b> &rarr; Antes do intervalo
                                    </li>
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>T02</b> &rarr; Depois do intervalo
                                    </li>
                                </ul>
                            </div>

                            <v-divider class="opacity-100"></v-divider>

                            <div>
                                <p class="font-bold mb-1">Noite</p>
                                <ul class="list-none space-y-1 ml-2">
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>N01</b> &rarr; Antes do intervalo
                                    </li>
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>N02</b> &rarr; Depois do intervalo
                                    </li>
                                </ul>
                            </div>

                            <v-divider class="opacity-100"></v-divider>

                            <div>
                                <p class="font-bold mb-1">Integral</p>
                                <ul class="list-none space-y-1 ml-2">
                                    <li class="flex items-center gap-2 text-sm">
                                        <span class="text-gray-400">•</span> <b>INT</b> &rarr; Integral
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </v-card>
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-end gap-2 mt-5 mx-50!">
        <v-btn color="red">Cancelar</v-btn>
        <v-btn color="red" class="bg-red-600 text-white">Adicionar Turma</v-btn>
    </div>


</template>
