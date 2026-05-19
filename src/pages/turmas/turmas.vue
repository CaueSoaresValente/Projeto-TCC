<script setup>
import { ref, computed, onMounted } from "vue";
import Menu from '@/components/Menu.vue';
import ModalEditarTurma from "@/components/ModalEditarTurma.vue";
import { listarTurmas, excluirTurma, editarTurma } from "@/services/api";

const carregando = ref(false);
const erro = ref("");

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

async function salvarTurma(form) {
    if (!turmaParaEditar.value?.idTurma) {
        editModal.value = false;
        return;
    }
    try {
        await editarTurma(turmaParaEditar.value.idTurma, {
            nome: form.label,
            tipoCurso: form.modalidade,
            dataInicio: form.dataInicio,
            dataTermino: form.dataFim,
            horarios: form.horarios,
        });
        editModal.value = false;
        await carregarTurmas();
    } catch (e) {
        alert(e.message || "Erro ao salvar turma");
    }
}

async function excluirTurmaCard(turma) {
    if (!confirm(`Excluir a turma "${turma.label}"?`)) return;
    try {
        await excluirTurma(turma.idTurma);
        await carregarTurmas();
    } catch (e) {
        alert(e.message || "Erro ao excluir turma");
    }
}

const turmas = ref([]);

async function carregarTurmas() {
    carregando.value = true;
    erro.value = "";
    try {
        turmas.value = await listarTurmas();
    } catch (e) {
        erro.value = e.message || "Erro ao carregar turmas";
        turmas.value = [];
    } finally {
        carregando.value = false;
    }
}

onMounted(() => {
    carregarTurmas();
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
    <v-container class="max-w-[1600px] w-full mx-auto p-0 md:px-4 lg:px-50">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">

            <div class="col-span-full self-start">
                <div class="flex items-center justify-between">
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
                <p v-if="erro" class="text-red-600 text-sm mt-2">{{ erro }}</p>
                <p v-else-if="carregando" class="text-gray-500 text-sm mt-2">Carregando turmas...</p>
            </div>

            <v-card v-for="turma in filteredTurmas" :key="turma.value" class="border-t-6 h-full flex flex-col justify-between"
                :class="{ 'border-green-300': turma.modalidade === 'cai', 'border-blue-300': turma.modalidade === 'fic', 'border-orange-300': turma.modalidade === 'tec' }">
                <div class="flex-grow">
                    <v-card-title class="flex justify-between">
                        <div class="flex items-center">
                            <span class="text-h5">{{ turma.label }}</span>
                        </div>
                        <div class="flex">
                            <v-btn icon="mdi-pencil" variant="text" color="primary"
                                @click="abrirEdicao(turma)"
                                :class="{ 'text-green-900': turma.modalidade === 'cai', 'text-blue-900': turma.modalidade === 'fic', 'text-orange-900': turma.modalidade === 'tec' }"></v-btn>
                            <v-btn icon="mdi-delete" variant="text" color="primary"
                                @click="excluirTurmaCard(turma)"
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
                                <span class="text-lg font-bold">{{ turma.aulasSemana ?? 0 }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <v-icon size="32" icon="mdi-calendar-range"
                                :class="{ 'text-green-600': turma.modalidade === 'cai', 'text-blue-600': turma.modalidade === 'fic', 'text-orange-600': turma.modalidade === 'tec' }"></v-icon>
                            <div class="flex flex-col leading-tight">
                                <span class="text-xs text-gray-500!">Total de aulas</span>
                                <span class="text-lg font-bold">{{ turma.totalAulas ?? 0 }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <v-icon size="32" icon="mdi-clock-outline"
                                :class="{ 'text-green-600': turma.modalidade === 'cai', 'text-blue-600': turma.modalidade === 'fic', 'text-orange-600': turma.modalidade === 'tec' }"></v-icon>
                            <div class="flex flex-col leading-tight">
                                <span class="text-xs text-gray-500!">Duração</span>
                                <span class="text-lg font-bold">{{ turma.duracaoDias ?? 0 }} dias</span>
                            </div>
                        </div>
                    </div>
                    <v-divider :thickness="4" class="hidden my-1 mx-3  md:flex "></v-divider>
                    <p class="ms-3 text-sm my-2 font-bold ">Professores</p>
                    <div v-if="turma.professores?.length" class="flex flex-wrap gap-3 mx-3 mb-3">
                        <div v-for="(prof, idx) in turma.professores" :key="idx" class="flex items-center gap-2">
                            <v-avatar :image="prof.foto" size="36"></v-avatar>
                            <p class="font-bold text-sm">{{ prof.nome }}</p>
                        </div>
                    </div>
                    <p v-else class="mx-3 mb-3 text-sm text-gray-500">Nenhum professor designado</p>
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
                </div>
                <div class="flex items-center justify-between m-3 p-2 rounded-lg"
                    :class="{ 'bg-green-100': turma.modalidade === 'cai', 'bg-blue-100': turma.modalidade === 'fic', 'bg-orange-100': turma.modalidade === 'tec' }">
                    <div class="flex items-center gap-1">
                        <v-icon icon="mdi-calendar"
                            :class="{ 'text-green-700': turma.modalidade === 'cai', 'text-blue-700': turma.modalidade === 'fic', 'text-orange-700': turma.modalidade === 'tec' }"></v-icon>
                        <p class="p-1 font-bold text-sm"
                            :class="{ 'text-green-700': turma.modalidade === 'cai', 'text-blue-700': turma.modalidade === 'fic', 'text-orange-700': turma.modalidade === 'tec' }">
                            {{ turma.dataInicio }} - {{ turma.dataTermino }}</p>
                    </div>
                    <p class="font-bold p-1 rounded text-sm uppercase px-2"
                        :class="{ 'bg-green-300 text-green-900': turma.modalidade === 'cai', 'bg-blue-300 text-blue-900': turma.modalidade === 'fic', 'bg-orange-300 text-orange-900': turma.modalidade === 'tec' }">
                        {{ turma.modalidade === 'tec' ? 'Téc' : turma.modalidade }}
                    </p>
                </div>
            </v-card>
        </div>
    </v-container>

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