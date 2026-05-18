<script setup>
import { ref, computed, onMounted } from "vue";
import Menu from '@/components/Menu.vue';
import ModalEditarTurma from "@/components/ModalEditarTurma.vue";

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


// Itens do menu dropdown do avatar (Padronizado)
const items = ref([
  { title: "Meu Perfil", icon: "mdi-account-outline" },
  { title: "Sair", icon: "mdi-logout" },
]);


const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Dialog para visão panorâmica do cronograma
const dialogGrade = ref(false);
const turmaSelecionada = ref(null);

function abrirGrade(turma) {
    turmaSelecionada.value = turma;
    dialogGrade.value = true;
}

const editModal = ref(false);
const turmaParaEditar = ref(null);

function abrirEdicao(turma) {
    turmaParaEditar.value = JSON.parse(JSON.stringify(turma)); // Deep clone simple object
    editModal.value = true;
}

function salvarTurma(form) {
    console.log("Salvando alterações da turma:", form);
    // Aqui viria a chamada para o backend
    // Por enquanto apenas fechamos o modal
    editModal.value = false;
    alert("Alterações salvas com sucesso!");
}

// DIDÁTICA: Transformamos a lista fixa em reativa (ref)
const turmas = ref([
    {
        label: "CPTMTDS04", value: "cptmtds04", modalidade: "tec", siglas: "M01",
        areas: ["Tecnologia", "Software"],
        grade: [
            { periodo: "M01", aulas: { Seg: { disciplina: "Power BI", professor: "Douglas dos Reis" }, Qua: { disciplina: "IOT", professor: "Lincoln Loud" }, Sex: { disciplina: "Power BI", professor: "Douglas dos Reis" } } },
            { periodo: "M02", aulas: { Seg: { disciplina: "Power BI", professor: "Douglas dos Reis" }, Ter: { disciplina: "IOT", professor: "Lincoln Loud" }, Qua: { disciplina: "IOT", professor: "Lincoln Loud" } } },
        ]
    },
    {
        label: "CPTMTDS03", value: "cptmtds03", modalidade: "fic", siglas: "M02",
        areas: ["Manutenção", "Hardware"],
        grade: [
            { periodo: "M01", aulas: { Seg: { disciplina: "Manutenção", professor: "Carlos Silva" }, Qui: { disciplina: "Manutenção", professor: "Carlos Silva" } } },
            { periodo: "M02", aulas: { Ter: { disciplina: "Hardware", professor: "Ana Paula" }, Sex: { disciplina: "Hardware", professor: "Ana Paula" } } },
        ]
    },
    {
        label: "CPTMTDS02", value: "cptmtds02", modalidade: "cai", siglas: "T01",
        areas: ["Elétrica", "Automação"],
        grade: [
            { periodo: "T01", aulas: { Ter: { disciplina: "Front-End", professor: "Lincoln Loud" }, Qui: { disciplina: "Power BI", professor: "Douglas dos Reis" } } },
            { periodo: "T02", aulas: { Seg: { disciplina: "Elétrica", professor: "João Marcos" }, Qua: { disciplina: "Automação", professor: "Pedro H." } } },
        ]
    },
    {
        label: "CPTMTDS01", value: "cptmtds01", modalidade: "tec", siglas: "T02",
        areas: ["Tecnologia", "Cloud"],
        grade: [
            { periodo: "T01", aulas: { Seg: { disciplina: "Cloud", professor: "Marcos Vini" }, Qua: { disciplina: "DevOps", professor: "Marcos Vini" } } },
            { periodo: "T02", aulas: { Ter: { disciplina: "Front-End", professor: "Lincoln Loud" }, Qui: { disciplina: "Power BI", professor: "Douglas dos Reis" }, Sex: { disciplina: "IOT", professor: "Lincoln Loud" } } },
        ]
    },
    {
        label: "CPTMTDS04", value: "cptmtds04b", modalidade: "tec", siglas: "N01",
        areas: ["Software", "Web"],
        grade: [
            { periodo: "N01", aulas: { Seg: { disciplina: "IOT", professor: "Lincoln Loud" }, Qua: { disciplina: "Front-End", professor: "Lincoln Loud" } } },
            { periodo: "N02", aulas: { Ter: { disciplina: "Back-End", professor: "Douglas dos Reis" }, Qui: { disciplina: "Banco de Dados", professor: "Ana Paula" } } },
        ]
    },
    {
        label: "CPTMTDS03", value: "cptmtds03b", modalidade: "fic", siglas: "N02",
        areas: ["Redes", "Infra"],
        grade: [
            { periodo: "N01", aulas: { Seg: { disciplina: "IOT", professor: "Lincoln Loud" }, Qui: { disciplina: "Redes", professor: "Ricardo M." } } },
            { periodo: "N02", aulas: { Ter: { disciplina: "Infra", professor: "Pedro H." }, Sex: { disciplina: "Front-End", professor: "Lincoln Loud" } } },
        ]
    },
    {
        label: "CPTMTDS02", value: "cptmtds02c", modalidade: "cai", siglas: "INT",
        areas: ["Elétrica"],
        grade: [
            { periodo: "Manhã", aulas: { Seg: { disciplina: "Elétrica I", professor: "João Marcos" }, Qua: { disciplina: "Elétrica II", professor: "João Marcos" }, Sex: { disciplina: "Prática", professor: "Pedro H." } } },
            { periodo: "Tarde", aulas: { Ter: { disciplina: "Circuitos", professor: "Ana Paula" }, Qui: { disciplina: "Automação", professor: "Pedro H." } } },
        ]
    },
    {
        label: "CPTMTDS01", value: "cptmtds01c", modalidade: "tec", siglas: "INT",
        areas: ["Tecnologia"],
        grade: [
            { periodo: "Manhã", aulas: { Ter: { disciplina: "Programação", professor: "Douglas dos Reis" }, Qui: { disciplina: "Lógica", professor: "Carlos Silva" } } },
            { periodo: "Tarde", aulas: { Seg: { disciplina: "Web", professor: "Lincoln Loud" }, Qua: { disciplina: "Mobile", professor: "Marcos Vini" } } },
            { periodo: "Integral", aulas: { Sex: { disciplina: "Projeto", professor: "Carlos Silva" } } },
        ]
    },
    {
        label: "CPTMTDS04", value: "cptmtds04a", modalidade: "tec", siglas: "INT",
        areas: ["Mobile"],
        grade: [
            { periodo: "Manhã", aulas: { Seg: { disciplina: "React", professor: "Lincoln Loud" }, Qua: { disciplina: "Flutter", professor: "Marcos Vini" } } },
            { periodo: "Tarde", aulas: { Ter: { disciplina: "UI/UX", professor: "Ana Paula" }, Sex: { disciplina: "Testes", professor: "Carlos Silva" } } },
        ]
    },
    {
        label: "CPTMTDS03", value: "cptmtds03a", modalidade: "fic", siglas: "INT",
        areas: ["Gestão"],
        grade: [
            { periodo: "Manhã", aulas: { Ter: { disciplina: "Gestão", professor: "Ricardo M." }, Qui: { disciplina: "Processos", professor: "Ricardo M." } } },
            { periodo: "Tarde", aulas: { Seg: { disciplina: "Liderança", professor: "Carlos Silva" } } },
        ]
    },
    {
        label: "CPTMTDS02", value: "cptmtds02a", modalidade: "cai", siglas: "INT",
        areas: ["Mecânica"],
        grade: [
            { periodo: "Manhã", aulas: { Seg: { disciplina: "Mecânica I", professor: "João Marcos" }, Qua: { disciplina: "Mecânica II", professor: "Pedro H." } } },
            { periodo: "Tarde", aulas: { Ter: { disciplina: "Prática", professor: "João Marcos" }, Qui: { disciplina: "Solda", professor: "Pedro H." } } },
            { periodo: "Noite", aulas: { Sáb: { disciplina: "Reforço", professor: "João Marcos" } } },
        ]
    },
    {
        label: "CPTMTDS01", value: "cptmtds01a", modalidade: "tec", siglas: "INT",
        areas: ["Design"],
        grade: [
            { periodo: "Manhã", aulas: { Seg: { disciplina: "Design I", professor: "Ana Paula" }, Qua: { disciplina: "Figma", professor: "Ana Paula" }, Sex: { disciplina: "Photoshop", professor: "Marcos Vini" } } },
            { periodo: "Tarde", aulas: { Ter: { disciplina: "Ilustração", professor: "Ana Paula" }, Qui: { disciplina: "Branding", professor: "Ricardo M." } } },
            { periodo: "Integral", aulas: { Sáb: { disciplina: "Portfólio", professor: "Ana Paula" } } },
        ]
    },
]);

// --------------------------------------------------------
// DIDÁTICA: Assim que a página carrega, verificamos o LocalStorage
// Se o usuário adicionou alguma turma nova, nós a juntamos aqui!
// --------------------------------------------------------
onMounted(() => {
    const turmasSalvas = JSON.parse(localStorage.getItem('novasTurmas')) || [];
    if (turmasSalvas.length > 0) {
        // Pega as turmas existentes e junta com as novas
        turmas.value = [...turmas.value, ...turmasSalvas];
    }
});

const periodoDescricoes = {
    'M01': 'Manhã - Antes do intervalo',
    'M02': 'Manhã - Depois do intervalo',
    'T01': 'Tarde - Antes do intervalo',
    'T02': 'Tarde - Depois do intervalo',
    'N01': 'Noite - Antes do intervalo',
    'N02': 'Noite - Depois do intervalo',
    'Manhã': 'Período da Manhã',
    'Tarde': 'Período da Tarde',
    'Noite': 'Período da Noite',
    'INT': 'Período Integral',
    'Integral': 'Período Integral'
};

const filteredTurmas = computed(() => {
    // DIDÁTICA: Como 'turmas' agora é uma 'ref', precisamos acessar '.value'
    return turmas.value.filter(turma => {
        
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
    <Menu />
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
                            @click="abrirEdicao(turma)"
                            :class="{ 'text-green-900': turma.modalidade === 'cai', 'text-blue-900': turma.modalidade === 'fic', 'text-orange-900': turma.modalidade === 'tec' }"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" color="primary"
                            :class="{ 'text-green-900': turma.modalidade === 'cai', 'text-blue-900': turma.modalidade === 'fic', 'text-orange-900': turma.modalidade === 'tec' }"></v-btn>
                    </div>
                </v-card-title>
                <div class="md:hidden">
                    <v-chip-group class="ms-2 mt-1">
                        <v-chip v-for="slot in turma.grade" :key="slot.periodo"
                            variant="tonal" size="small" class="text-red-600!">
                            {{ slot.periodo }} <v-icon icon="mdi-information-outline" end size="x-small"></v-icon>
                            <v-tooltip activator="parent" location="top">
                                <div class="text-xs p-1">
                                    <p class="font-bold border-b mb-1">📖 Legenda</p>
                                    <p>{{ periodoDescricoes[slot.periodo] || 'Período de aula' }}</p>
                                </div>
                            </v-tooltip>
                        </v-chip>
                    </v-chip-group>
                </div>
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
                <p class="ms-3 text-sm my-2 font-bold">Descrição <span class="text-gray-500 font-normal">(Opcional)</span></p>
                <v-textarea label="..." rows="4" hide-details class="mx-3 mt-2 text-sm mb-3"></v-textarea>
                <v-divider :thickness="4" class="my-1 mx-3"></v-divider>

                <!-- Grade de Horário Acoplada no Card -->
                <div v-if="turma.grade" class="mx-3 my-3 cursor-pointer" @click="abrirGrade(turma)">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <v-icon size="16" icon="mdi-calendar-clock"
                                :class="{ 'text-green-600': turma.modalidade === 'cai', 'text-blue-600': turma.modalidade === 'fic', 'text-orange-600': turma.modalidade === 'tec' }"></v-icon>
                            <p class="text-xs font-bold text-gray-600">Cronograma Semanal</p>
                        </div>
                        <v-icon size="14" icon="mdi-arrow-expand" color="grey"></v-icon>
                    </div>

                    <div class="overflow-x-auto rounded-lg border"
                         :class="{
                             'border-green-200': turma.modalidade === 'cai',
                             'border-blue-200': turma.modalidade === 'fic',
                             'border-orange-200': turma.modalidade === 'tec'
                         }">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr
                                    :class="{
                                        'bg-green-50': turma.modalidade === 'cai',
                                        'bg-blue-50': turma.modalidade === 'fic',
                                        'bg-orange-50': turma.modalidade === 'tec'
                                    }">
                                    <th class="p-1.5 border-r border-b w-12 text-center"
                                        :class="{
                                            'border-green-200': turma.modalidade === 'cai',
                                            'border-blue-200': turma.modalidade === 'fic',
                                            'border-orange-200': turma.modalidade === 'tec'
                                        }"></th>
                                    <th v-for="dia in diasSemana" :key="dia"
                                        class="p-1.5 border-b text-center text-[10px] font-bold uppercase"
                                        :class="{
                                            'border-green-200 text-green-700': turma.modalidade === 'cai',
                                            'border-blue-200 text-blue-700': turma.modalidade === 'fic',
                                            'border-orange-200 text-orange-700': turma.modalidade === 'tec'
                                        }">
                                        {{ dia }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(slot, idx) in turma.grade" :key="slot.periodo"
                                    :class="{ 'border-b': idx < turma.grade.length - 1,
                                        'border-green-100': turma.modalidade === 'cai',
                                        'border-blue-100': turma.modalidade === 'fic',
                                        'border-orange-100': turma.modalidade === 'tec'
                                    }">
                                    <td class="p-1.5 border-r text-[8px] font-bold text-gray-400 text-center leading-tight"
                                        :class="{
                                            'border-green-200 bg-green-50/50': turma.modalidade === 'cai',
                                            'border-blue-200 bg-blue-50/50': turma.modalidade === 'fic',
                                            'border-orange-200 bg-orange-50/50': turma.modalidade === 'tec'
                                        }">
                                        {{ slot.periodo }}
                                    </td>
                                    <td v-for="dia in diasSemana" :key="dia" class="p-1">
                                        <div v-if="slot.aulas?.[dia]"
                                             class="p-1.5 rounded-md text-center"
                                             :class="{
                                                 'bg-green-100 text-green-800': turma.modalidade === 'cai',
                                                 'bg-blue-100 text-blue-800': turma.modalidade === 'fic',
                                                 'bg-orange-100 text-orange-800': turma.modalidade === 'tec'
                                             }">
                                            <p class="text-[9px] font-bold leading-tight">{{ slot.aulas[dia].disciplina }}</p>
                                            <p class="text-[7px] opacity-60 mt-0.5">{{ slot.aulas[dia].professor }}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

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

    <!-- Modal de Edição de Turma -->
    <ModalEditarTurma 
        v-model="editModal" 
        :turma="turmaParaEditar" 
        @save="salvarTurma"
    />

    <!-- Dialog de Visão Panorâmica -->
    <v-dialog v-model="dialogGrade" max-width="1000" scrollable>
        <v-card v-if="turmaSelecionada" class="rounded-xl">
            <v-card-title class="flex items-center justify-between pa-5"
                :class="{
                    'bg-green-50': turmaSelecionada.modalidade === 'cai',
                    'bg-blue-50': turmaSelecionada.modalidade === 'fic',
                    'bg-orange-50': turmaSelecionada.modalidade === 'tec'
                }">
                <div class="flex items-center gap-3">
                    <v-icon size="28" icon="mdi-calendar-clock"
                        :class="{
                            'text-green-600': turmaSelecionada.modalidade === 'cai',
                            'text-blue-600': turmaSelecionada.modalidade === 'fic',
                            'text-orange-600': turmaSelecionada.modalidade === 'tec'
                        }"></v-icon>
                    <div>
                        <h2 class="text-xl font-bold">{{ turmaSelecionada.label }}</h2>
                        <div class="flex gap-2 items-center">
                            <p class="text-xs text-gray-500">Cronograma Semanal</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <v-menu open-on-hover location="bottom end" :offset="5" transition="slide-y-transition">
                        <template v-slot:activator="{ props }">
                            <button v-bind="props" class="flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-t-4 rounded-lg text-gray-800 font-bold text-sm shadow-sm hover:shadow transition-colors"
                                :class="{
                                    'border-green-200 border-t-green-600 hover:bg-green-50': turmaSelecionada.modalidade === 'cai',
                                    'border-blue-200 border-t-blue-600 hover:bg-blue-50': turmaSelecionada.modalidade === 'fic',
                                    'border-orange-200 border-t-orange-600 hover:bg-orange-50': turmaSelecionada.modalidade === 'tec'
                                }">
                                <v-icon icon="mdi-clipboard-list-outline" size="18"></v-icon>
                                Legenda
                            </button>
                        </template>
                        <v-card class="p-4 shadow-2xl rounded-xl border-t-4 bg-white" width="280"
                            :class="{
                                'border-green-600': turmaSelecionada.modalidade === 'cai',
                                'border-blue-600': turmaSelecionada.modalidade === 'fic',
                                'border-orange-600': turmaSelecionada.modalidade === 'tec'
                            }">
                            <div class="flex items-center gap-2 mb-4">
                                <v-icon size="20" icon="mdi-book-open-variant" color="grey-darken-4"></v-icon>
                                <h2 class="text-lg font-black text-grey-darken-4 uppercase tracking-tight">Legenda</h2>
                            </div>

                            <div class="space-y-3">
                                <div>
                                    <p class="font-black text-xs text-gray-400 uppercase mb-1">Manhã</p>
                                    <ul class="list-none space-y-1 ml-1">
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>M01</b> &rarr; Antes do intervalo
                                        </li>
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>M02</b> &rarr; Depois do intervalo
                                        </li>
                                    </ul>
                                </div>
                                <v-divider></v-divider>
                                <div>
                                    <p class="font-black text-xs text-gray-400 uppercase mb-1">Tarde</p>
                                    <ul class="list-none space-y-1 ml-1">
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>T01</b> &rarr; Antes do intervalo
                                        </li>
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>T02</b> &rarr; Depois do intervalo
                                        </li>
                                    </ul>
                                </div>
                                <v-divider></v-divider>
                                <div>
                                    <p class="font-black text-xs text-gray-400 uppercase mb-1">Noite</p>
                                    <ul class="list-none space-y-1 ml-1">
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>N01</b> &rarr; Antes do intervalo
                                        </li>
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>N02</b> &rarr; Depois do intervalo
                                        </li>
                                    </ul>
                                </div>
                                <v-divider></v-divider>
                                <div>
                                    <p class="font-black text-xs text-gray-400 uppercase mb-1">Integral</p>
                                    <ul class="list-none space-y-1 ml-1">
                                        <li class="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                            <span class="text-red-500">•</span> <b>INT</b> &rarr; Integral
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </v-card>
                    </v-menu>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="dialogGrade = false"></v-btn>
                </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-6">
                <!-- Tabela de Cronograma -->
                <div class="overflow-x-auto border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr
                                :class="{
                                    'bg-green-50': turmaSelecionada.modalidade === 'cai',
                                    'bg-blue-50': turmaSelecionada.modalidade === 'fic',
                                    'bg-orange-50': turmaSelecionada.modalidade === 'tec'
                                }">
                                <th class="p-3 border-b-2 border-r w-20 text-center text-sm font-bold text-gray-500"
                                :class="{
                                    'border-green-200': turmaSelecionada.modalidade === 'cai',
                                    'border-blue-200': turmaSelecionada.modalidade === 'fic',
                                    'border-orange-200': turmaSelecionada.modalidade === 'tec'
                                }">Horário</th>
                            <th v-for="dia in diasSemana" :key="dia"
                                class="p-3 border-b-2 text-center text-sm font-bold uppercase"
                                :class="{
                                    'border-green-200 text-green-700': turmaSelecionada.modalidade === 'cai',
                                    'border-blue-200 text-blue-700': turmaSelecionada.modalidade === 'fic',
                                    'border-orange-200 text-orange-700': turmaSelecionada.modalidade === 'tec'
                                }">
                                {{ dia }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(slot, idx) in turmaSelecionada.grade" :key="slot.periodo"
                            :class="{ 'border-b': idx < turmaSelecionada.grade.length - 1,
                                'border-green-100': turmaSelecionada.modalidade === 'cai',
                                'border-blue-100': turmaSelecionada.modalidade === 'fic',
                                'border-orange-100': turmaSelecionada.modalidade === 'tec'
                            }">
                            <td class="p-3 border-r text-xs font-bold text-gray-400 text-center"
                                :class="{
                                    'border-green-200 bg-green-50/50': turmaSelecionada.modalidade === 'cai',
                                    'border-blue-200 bg-blue-50/50': turmaSelecionada.modalidade === 'fic',
                                    'border-orange-200 bg-orange-50/50': turmaSelecionada.modalidade === 'tec'
                                }">
                                {{ slot.periodo }}
                            </td>
                            <td v-for="dia in diasSemana" :key="dia" class="p-2">
                                <div v-if="slot.aulas?.[dia]"
                                     class="p-3 rounded-lg text-center"
                                     :class="{
                                         'bg-green-100 text-green-900': turmaSelecionada.modalidade === 'cai',
                                         'bg-blue-100 text-blue-900': turmaSelecionada.modalidade === 'fic',
                                         'bg-orange-100 text-orange-900': turmaSelecionada.modalidade === 'tec'
                                     }">
                                    <p class="text-sm font-bold leading-tight">{{ slot.aulas[dia].disciplina }}</p>
                                    <p class="text-xs opacity-60 mt-1">{{ slot.aulas[dia].professor }}</p>
                                </div>
                                <div v-else class="h-16 rounded-lg border-2 border-dashed border-gray-100"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>


<style scoped>
.chip {
    cursor: default;

}
</style>