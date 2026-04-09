<script setup lang="ts">
import { ref, computed } from 'vue'
import Menu from '@/components/Menu.vue'

const disciplina = ref('')
const turma = ref('')
const turno = ref('')
const categoria = ref('')
const nivel = ref('basic')


const turmas = [
    { label: 'CPTMTDS04', value: 'cptmtds04' },
    { label: 'CPTMTDS03', value: 'cptmtds03' },
    { label: 'CPTMTDS02', value: 'cptmtds02' },
    { label: 'CPTMTDS01', value: 'cptmtds01' },
]

const areas = [
    { label: 'Tecnologia', value: 'tecnologia' },
    { label: 'Manutenção', value: 'manutenção' },
    { label: 'Elétrica', value: 'eletrica' },
]

const niveis = [
    { label: 'Básico', value: 'basic' },
    { label: 'Intermediário', value: 'intermediario' },
    { label: 'Avançado', value: 'avancado' },
]

const professores = [
    { id: 1, nome: 'João Silva', disciplina: 'Matemática', foto: 'https://static.vecteezy.com/system/resources/thumbnails/037/823/296/small/ai-generated-smiling-male-teacher-in-classroom-with-elementary-school-students-learning-in-the-background-photo.jpeg' },
    { id: 2, nome: 'Maria Santos', disciplina: 'Português', foto: 'https://img.freepik.com/fotos-gratis/criancas-e-professor-comemorando-o-dia-do-professor_23-2148668597.jpg?semt=ais_hybrid&w=740&q=80' },
    { id: 3, nome: 'Pedro Oliveira', disciplina: 'História', foto: 'https://www.fiaonline.com.br/hubfs/Card%20Professor%20-%20J%C3%BAlio%20Lancellotti%20400x400.png' },
    { id: 4, nome: 'Ana Costa', disciplina: 'Ciências', foto: 'https://f.hubspotusercontent30.net/hubfs/6565283/Tais%20Targa.png' },
    { id: 5, nome: 'Carlos Lima', disciplina: 'Física', foto: 'https://www.fiaonline.com.br/hubfs/Card%20Professor%20-%20Jo%C3%A3o%20Valente%20400x400.png' },
    { id: 6, nome: 'Sofia Pereira', disciplina: 'Química', foto: 'https://img.freepik.com/fotos-gratis/parabens-fez-muito-bem-o-teste_637285-8618.jpg' },
    { id: 7, nome: 'Miguel Torres', disciplina: 'Biologia', foto: 'https://f.hubspotusercontent30.net/hubfs/6565283/Victor%20Richarte%20Martinez.png' },
    { id: 8, nome: 'Laura Mendes', disciplina: 'Geografia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDPtI9m_xJ-AXgMA41F01PeDrRoYZhze726Q&s' },
]

const slides = computed(() => {
  const cardsPerSlide = 4 // Ajuste conforme necessário para responsividade
  const slidesArray = []
  for (let i = 0; i < professores.length; i += cardsPerSlide) {
    slidesArray.push(professores.slice(i, i + cardsPerSlide))
  }
  return slidesArray
})
</script>


<template>

    <Menu>
        <p class="mt-8">Teste</p>
    </Menu>

    <v-card class="mx-auto mt-8 max-w-4xl p-6">
        <v-card-title class="text-center">
            <span class="text-h5">Lista de Professores</span>
        </v-card-title>

        <v-card-text>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">

                <v-select :items="turmas" label="Turmas" item-title="label" item-value="value" v-model="turma"
                    variant="outlined" density="comfortable" />

                <v-select :items="areas" label="Área" item-title="label" item-value="value" v-model="turno"
                    variant="outlined" density="comfortable" />

            </div>

            <div class="mt-6">
                <v-btn-toggle v-model="nivel" class="w-full" variant="outlined" density="comfortable" rounded>
                    <v-btn v-for="opcao in niveis" :key="opcao.value" :value="opcao.value">
                        {{ opcao.label }}
                    </v-btn>
                </v-btn-toggle>
            </div>
        </v-card-text>
    </v-card>

    <v-card class="mt-8">
        <v-card-title class="text-center">
            <span class="text-h5">Professores em Destaque</span>
        </v-card-title>
        <v-card-text>
            <v-carousel height="auto"  hide-delimiters>
                <v-carousel-item v-for="(slide, index) in slides" :key="index">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        <v-card v-for="professor in slide" :key="professor.id" class="mx-auto" width="300">
                            <v-img :src="professor.foto" width="300" min-height="300"></v-img>
                            <v-card-title class="text-sm">{{ professor.nome }}</v-card-title>
                            <v-card-subtitle class="text-xs">{{ professor.disciplina }}</v-card-subtitle>
                            <v-card-actions class="pa-2">
                                <v-btn color="primary" variant="outlined" size="small">Ver Perfil</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </v-carousel-item>
            </v-carousel>
        </v-card-text>
    </v-card>
</template>