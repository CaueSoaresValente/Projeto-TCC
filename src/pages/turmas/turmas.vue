<script setup>
import { ref, computed } from "vue";
import Menu from '@/components/Menu.vue';

const user = ref({
    name: "User",
    foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

const selectedPeriod = ref("Todas");
const search = ref("");

const modalidadeLabels = {
    tec: "Técnico",
    cai: "Aprendizagem Industrial (CAI)",
    fic: "Formação Inicial e Continuada (FIC)"
};


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

const filteredTurmas = computed(() => {
    return turmas.filter(turma => {
        
        const matchesPeriod = selectedPeriod.value === "Todas" || 
                            (selectedPeriod.value === "Manhã" && turma.siglas.startsWith('M')) ||
                            (selectedPeriod.value === "Tarde" && turma.siglas.startsWith('T')) ||
                            (selectedPeriod.value === "Noite" && turma.siglas.startsWith('N')) ||
                            (selectedPeriod.value === "Integral" && turma.siglas === 'INT');

       
        const term = search.value.trim().toLowerCase();
        if (term === "") return matchesPeriod;

        const matchesLabel = turma.label.toLowerCase().includes(term);
        const matchesSigla = turma.siglas.toLowerCase().includes(term);
        
        
        const modLabel = modalidadeLabels[turma.modalidade] || "";
        const matchesModalidade = turma.modalidade.toLowerCase().includes(term) || 
                                 modLabel.toLowerCase().includes(term);

        const matchesAreas = turma.areas.some(area => area.toLowerCase().includes(term));

        return matchesPeriod && (matchesLabel || matchesSigla || matchesModalidade || matchesAreas);
    });
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
    <div class="w-full px-2 md:px-4 lg:px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 p-2 md:p-5">

            <div class="hidden md:block md:row-span-1 lg:row-span-2">
                <v-card class="mt-4 border-t-6 border-red-600 p-5 shadow-lg h-fit">
                    <div class="flex items-center gap-3">
                        <v-icon size="36" icon="mdi-book-open-outline" color="grey-darken-3"></v-icon>
                        <h2 class="text-2xl font-medium text-grey-darken-3">Legenda</h2>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <p class="font-bold text-lg mb-1">Manhã</p>
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
                            <p class="font-bold text-lg mb-1">Tarde</p>
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
                            <p class="font-bold text-lg mb-1">Noite</p>
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
                            <p class="font-bold text-lg mb-1">Integral</p>
                            <ul class="list-none space-y-1 ml-2">
                                <li class="flex items-center gap-2 text-sm">
                                    <span class="text-gray-400">•</span> <b>INT</b> &rarr; Integral
                                </li>
                            </ul>
                        </div>
                    </div>
                </v-card>
            </div>

            <div class="md:col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4 self-start">
                <div class="flex items-center justify-between mt-2">
                    <h1 class="text-3xl font-bold">Turmas</h1>
                    <v-text-field label="Buscar" v-model="search" variant="outlined" density="compact" hide-details
                        class="max-w-[200px]"></v-text-field>
                </div>

                <v-chip-group v-model="selectedPeriod" mandatory class="mt-2" selected-class="bg-red-600! text-white!">
                    <v-chip value="Todas" variant="tonal">Todas</v-chip>
                    <v-chip value="Manhã" variant="tonal">Manhã</v-chip>
                    <v-chip value="Tarde" variant="tonal">Tarde</v-chip>
                    <v-chip value="Noite" variant="tonal">Noite</v-chip>
                    <v-chip value="Integral" variant="tonal">Integral</v-chip>
                </v-chip-group>
            </div>

            <v-card v-for="turma in filteredTurmas" :key="turma.value" class="border-t-6 h-fit"
                :class="{ 'border-green-300': turma.modalidade === 'cai', 'border-blue-300': turma.modalidade === 'fic', 'border-orange-300': turma.modalidade === 'tec' }">
                <v-card-title class="flex justify-between">
                    <div class="flex items-center">
                        <span class="text-h5">{{ turma.label }}</span>
                    </div>
                    <div class="flex">
                        <v-btn icon="mdi-pencil" variant="text" color="primary"
                            :class="{ 'text-green-900': turma.modalidade === 'cai', 'text-blue-900': turma.modalidade === 'fic', 'text-orange-900': turma.modalidade === 'tec' }"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" color="primary"
                            :class="{ 'text-green-900': turma.modalidade === 'cai', 'text-blue-900': turma.modalidade === 'fic', 'text-orange-900': turma.modalidade === 'tec' }"></v-btn>
                    </div>
                </v-card-title>
                <v-sheet class="ms-1" max-width="600">
                    <v-slide-group show-arrows>
                        <v-slide-group-item v-for="area in turma.areas" :key="area">
                            <v-btn class="m-2 p-2 chip">
                                {{ area }}
                            </v-btn>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>

                <v-chip-group mandatory class="ms-2 mt-1">
                    <v-chip value="Seg" variant="tonal" class="chip">Seg</v-chip>
                    <v-chip value="Ter" variant="tonal" class="chip">Ter</v-chip>
                    <v-chip value="Qua" variant="tonal" class="chip">Qua</v-chip>
                    <v-chip value="Qui" variant="tonal" class="chip">Qui</v-chip>
                    <v-chip value="Sex" variant="tonal" class="chip">Sex</v-chip>
                    <v-chip value="Sáb" variant="tonal" class="chip">Sáb</v-chip>
                </v-chip-group>

                <v-divider :thickness="4" class="hidden my-1 mx-3  md:flex "></v-divider>

                <v-chip-group class="hidden md:flex ms-2 mt-1">
                    <v-chip variant="tonal" class="chip text-red-600!">
                        {{ turma.siglas }}
                    </v-chip>
                </v-chip-group>

                <v-chip-group class="ms-2 mt-1 md:hidden">
                    <v-chip variant="tonal" size="small" class="text-red-600!">
                        {{ turma.siglas }} <v-icon icon="mdi-information-outline" end size="x-small"></v-icon>
                        <v-tooltip activator="parent" location="top">
                            <div class="text-xs p-1">
                                <p class="font-bold border-b mb-1">📖 Legenda</p>
                                <p class="font-bold mt-1 text-red-500">Manhã</p>
                                <p>• M01 &rarr; Antes do intervalo</p>
                                <p>• M02 &rarr; Depois do intervalo</p>
                                <p class="font-bold mt-1 text-red-500">Tarde</p>
                                <p>• T01 &rarr; Antes do intervalo</p>
                                <p>• T02 &rarr; Depois do intervalo</p>
                                <p class="font-bold mt-1 text-red-500">Noite</p>
                                <p>• N01 &rarr; Antes do intervalo</p>
                                <p>• N02 &rarr; Depois do intervalo</p>
                                <p class="font-bold mt-1 text-red-500">Integral</p>
                                <p>• INT &rarr; Integral</p>
                            </div>
                        </v-tooltip>
                    </v-chip>
                </v-chip-group>
                <v-divider :thickness="4" class="my-1 mx-3"></v-divider>
                <div class="hidden md:flex justify-around gap-2 p-3">

                    <div class="flex items-center gap-2">
                        <v-icon size="32" icon="mdi-book-open-variant"
                            :class="{ 'text-green-600': turma.modalidade === 'cai', 'text-blue-600': turma.modalidade === 'fic', 'text-orange-600': turma.modalidade === 'tec' }"></v-icon>
                        <div class="flex flex-col leading-tight">
                            <span class="text-xs text-gray-500!">Aulas/Semana</span>
                            <span class="text-lg font-bold">4</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <v-icon size="32" icon="mdi-calendar-range"
                            :class="{ 'text-green-600': turma.modalidade === 'cai', 'text-blue-600': turma.modalidade === 'fic', 'text-orange-600': turma.modalidade === 'tec' }"></v-icon>
                        <div class="flex flex-col leading-tight">
                            <span class="text-xs text-gray-500!">Total de aulas</span>
                            <span class="text-lg font-bold">16</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <v-icon size="32" icon="mdi-clock-outline"
                            :class="{ 'text-green-600': turma.modalidade === 'cai', 'text-blue-600': turma.modalidade === 'fic', 'text-orange-600': turma.modalidade === 'tec' }"></v-icon>
                        <div class="flex flex-col leading-tight">
                            <span class="text-xs text-gray-500!">Duração</span>
                            <span class="text-lg font-bold">31 dias</span>
                        </div>
                    </div>
                </div>
                <v-divider :thickness="4" class="hidden my-1 mx-3  md:flex "></v-divider>
                <p class="ms-3 text-sm my-2 font-bold ">Professores</p>
                <div class="flex gap-3 mx-3 mb-3">
                    <v-avatar :image="user.foto"></v-avatar>
                    <p class="flex items-center justify-center font-bold text-sm">{{ user.name }}</p>
                </div>
                <v-divider :thickness="4" class="my-1 mx-3"></v-divider>
                <p class="ms-3 text-sm my-2 font-bold">Descrição<span class="text-gray-500 font-normal">
                        (Opcional)</span></p>
                <v-textarea label="..." rows="4" hide-details class="mx-3 mt-2 text-sm mb-3"></v-textarea>
                <v-divider :thickness="4" class="my-1 mx-3"></v-divider>
                <div class="flex items-center justify-between m-3 p-2 rounded-lg"
                    :class="{ 'bg-green-100': turma.modalidade === 'cai', 'bg-blue-100': turma.modalidade === 'fic', 'bg-orange-100': turma.modalidade === 'tec' }">
                    <div class="flex items-center gap-1">
                        <v-icon icon="mdi-calendar"
                            :class="{ 'text-green-700': turma.modalidade === 'cai', 'text-blue-700': turma.modalidade === 'fic', 'text-orange-700': turma.modalidade === 'tec' }"></v-icon>
                        <p class="p-1 font-bold text-sm"
                            :class="{ 'text-green-700': turma.modalidade === 'cai', 'text-blue-700': turma.modalidade === 'fic', 'text-orange-700': turma.modalidade === 'tec' }">
                            27/01/2026 - 27/02/2026</p>
                    </div>
                    <p class="font-bold p-1 rounded text-sm uppercase px-2"
                        :class="{ 'bg-green-300 text-green-900': turma.modalidade === 'cai', 'bg-blue-300 text-blue-900': turma.modalidade === 'fic', 'bg-orange-300 text-orange-900': turma.modalidade === 'tec' }">
                        {{ turma.modalidade === 'tec' ? 'Téc' : turma.modalidade }}
                    </p>
                </div>
            </v-card>
        </div>
    </div>




</template>


<style scoped>
.chip {
    cursor: default;

}
</style>