<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "@/components/Menu.vue";

const turma = ref("");
const turno = ref("");
const user = ref({
  name: "User",
  foto: "https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80",
});

const turmas = [
  { label: "CPTMTDS04", value: "cptmtds04" },
  { label: "CPTMTDS03", value: "cptmtds03" },
  { label: "CPTMTDS02", value: "cptmtds02" },
  { label: "CPTMTDS01", value: "cptmtds01" },
];

const areas = [
  { label: "Tecnologia", value: "tecnologia" },
  { label: "Manutenção", value: "manutenção" },
  { label: "Elétrica", value: "eletrica" },
];



const professores = [
  {
    id: 1,
    nome: "João Silva",
    area: "Tecnologia",
    foto: "https://static.vecteezy.com/system/resources/thumbnails/037/823/296/small/ai-generated-smiling-male-teacher-in-classroom-with-elementary-school-students-learning-in-the-background-photo.jpeg",
  },
  {
    id: 2,
    nome: "Maria Santos",
    area: "Tecnologia",
    foto: "https://img.freepik.com/fotos-gratis/criancas-e-professor-comemorando-o-dia-do-professor_23-2148668597.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    area: "Tecnologia",
    foto: "https://www.fiaonline.com.br/hubfs/Card%20Professor%20-%20J%C3%BAlio%20Lancellotti%20400x400.png",
  },
  {
    id: 4,
    nome: "Ana Costa",
    area: "Tecnologia",
    foto: "https://f.hubspotusercontent30.net/hubfs/6565283/Tais%20Targa.png",
  },
  {
    id: 5,
    nome: "Carlos Lima",
    area: "Tecnologia",
    foto: "https://www.fiaonline.com.br/hubfs/Card%20Professor%20-%20Jo%C3%A3o%20Valente%20400x400.png",
  },
  {
    id: 6,
    nome: "Sofia Pereira",
    area: "Tecnologia",
    foto: "https://img.freepik.com/fotos-gratis/parabens-fez-muito-bem-o-teste_637285-8618.jpg",
  },
  {
    id: 7,
    nome: "Miguel Torres",
    area: "Tecnologia",
    foto: "https://f.hubspotusercontent30.net/hubfs/6565283/Victor%20Richarte%20Martinez.png",
  },
  {
    id: 8,
    nome: "Laura Mendes",
    area: "Tecnologia",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDPtI9m_xJ-AXgMA41F01PeDrRoYZhze726Q&s",
  },
];

const slides = computed(() => {
  const cardsPerSlide = 4;
  const slidesArray = [];
  for (let i = 0; i < professores.length; i += cardsPerSlide) {
    slidesArray.push(professores.slice(i, i + cardsPerSlide));
  }
  return slidesArray;
});

const competencias = ref([
  { id: 1, nome: "Programação em Python", proficiencia: "Avançado" },
  { id: 2, nome: "Desenvolvimento Web", proficiencia: "Intermediário" },
  { id: 3, nome: "Banco de Dados SQL", proficiencia: "Básico" },
  { id: 4, nome: "Inteligência Artificial", proficiencia: "Intermediário" },
  { id: 5, nome: "Redes de Computadores", proficiencia: "Avançado" },
]);

const items = ref([
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
]);

const selectedProfessor = ref(null);
const showProfileDialog = ref(false);
const showSuccessDialog = ref(false);
const cancelTeacherDialog = ref(false);

const handleOpenProfile = (professor) => {
  selectedProfessor.value = professor;
  showProfileDialog.value = true;
};

const handleDesignate = () => {
  showProfileDialog.value = false;
  showSuccessDialog.value = true;
};
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

  <section>
    <v-card class="mx-auto mt-8 max-w-4xl p-6 border-t-6 border-t-red-500">
      <v-card-title class="text-center">
        <span class="text-h5">Lista de Professores</span>
      </v-card-title>

      <v-card-text>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <v-select :items="turmas" label="Turmas" item-title="label" item-value="value" v-model="turma"
            variant="outlined" density="comfortable" />

          <v-select :items="areas" label="Área" item-title="label" item-value="value" v-model="turno" variant="outlined"
            density="comfortable" />
        </div>

      </v-card-text>
    </v-card>

    <v-card class="mt-8">
      <v-card-title class="text-center">
        <span class="text-h5">Professores em Destaque</span>
      </v-card-title>
      <v-card-text>
        <v-carousel height="auto" hide-delimiters>
          <v-carousel-item v-for="(slide, index) in slides" :key="index">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-items-center">
              <v-card v-for="professor in slide" :key="professor.id"
                class="w-full max-w-[300px] border-b-6 border-b-red-500">
                <v-img :src="professor.foto" height="300" cover></v-img>

                <v-card-title>{{ professor.nome }}</v-card-title>
                <v-card-subtitle>{{ professor.area }}</v-card-subtitle>

                <v-card-actions class="pa-2">
                  <v-btn color="surface-variant" text="Selecionar" variant="flat" class="btn-perfil"
                    @click="handleOpenProfile(professor)"></v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
    </v-card>

    
    <v-dialog v-model="showProfileDialog" max-width="500">
      <v-card v-if="selectedProfessor">
        <v-card-actions>
          <v-spacer>
            <v-card-title>
              <span class="text-h5">Perfil do Professor</span>
            </v-card-title>
          </v-spacer>

          <v-btn icon="mdi-close" @click="showProfileDialog = false"></v-btn>
        </v-card-actions>
        <v-card-text class="flex items-center justify-center">
          <div class="">
            <div class="flex justify-center mb-8">
              <div>
                <v-avatar :image="selectedProfessor.foto" size="80"></v-avatar>
              </div>
              <div>
                <v-card-title class="">{{ selectedProfessor.nome }}</v-card-title>
                <v-card-subtitle>Área: {{ selectedProfessor.area }}</v-card-subtitle>
              </div>
            </div>
            <div>
              <div class="max-h-48 overflow-y-auto space-y-3 pr-2">
                <div v-for="competencia in competencias" :key="competencia.id" class="mb-2">
                  <div class="flex gap-3 rounded w-full">
                    <p
                      class="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex-grow">
                      {{ competencia.nome }}
                    </p>
                    <p class="p-4 rounded-lg flex-shrink-0 min-w-[120px] text-center" :class="{
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200':
                        competencia.proficiencia === 'Básico',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200':
                        competencia.proficiencia ===
                        'Intermediário',
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200':
                        competencia.proficiencia ===
                        'Avançado',
                    }">
                      {{ competencia.proficiencia }}
                    </p>
                  </div>
                </div>
              </div>
              <v-card-actions class="mt-6">
                <v-btn color="surface-variant" text="Selecionar e Designar a turma" variant="flat"
                  class="rounded-lg bg-red-600 text-white" @click="handleDesignate"></v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSuccessDialog" max-width="500" class="rounded-lg">
      <v-card v-if="selectedProfessor">
        <v-card-text class="flex items-center justify-center p-0">
          <div class="mt-8">
            <div class="flex justify-center mb-8">
              <div>
                <v-avatar :image="selectedProfessor.foto" size="80"></v-avatar>
              </div>
              <div>
                <v-card-title >{{ selectedProfessor.nome }}</v-card-title>
                <v-card-subtitle>Área: {{ selectedProfessor.area }}</v-card-subtitle>
              </div>
            </div>
          </div>
        </v-card-text>
        <p class="text-center px-30">O professor foi designado para a turma com <span
            class="text-green-500">sucesso</span></p>
        <div class="flex justify-center mt-3 ">
          <p class="border-2 px-6 py-1 border-gray-200 dark:border-gray-700 rounded-sm"><b>Turma:</b> {{ turmas[0]?.label
            }}</p>
        </div>
        <div class="flex justify-center my-8 gap-3 px-40">
          <v-btn text="Cancelar ação" variant="flat"
            class="border border-gray-600 border-2 rounded-lg dark:border-white w-full"
            @click="showSuccessDialog = false; cancelTeacherDialog = true"></v-btn>
          <v-btn text="Continuar" variant="flat" class="bg-red-600 text-white w-full rounded-lg"
            @click="showSuccessDialog = false"></v-btn>
        </div>
      </v-card>
    </v-dialog>

 <v-dialog v-model="cancelTeacherDialog" max-width="500" class="rounded-lg">
      <v-card v-if="selectedProfessor">
        <v-card-text class="flex items-center justify-center p-0 mt-8">
        </v-card-text>
        <p class="text-center px-30">Deseja realmente retirar o professor desta turma?</p>
        <div class="flex justify-center mt-3 ">
          <p class="border-2 px-6 py-1 border-gray-200 dark:border-gray-700 rounded-sm"><b>Turma:</b> {{ turmas[0]?.label
            }}</p>
        </div>
        <div class="flex justify-center my-8 gap-3 px-40">
          <v-btn text="Cancelar ação" variant="flat"
            class="border border-gray-600 border-2 rounded-lg dark:border-white w-full"
            @click="cancelTeacherDialog = false"></v-btn>
          <v-btn text="Continuar" variant="flat" class="bg-red-600 text-white w-full rounded-lg"
            @click="cancelTeacherDialog = false"></v-btn>
        </div>
      </v-card>
    </v-dialog>


  </section>
</template>

<style scoped>
.btn-perfil {
  background: #e30613;
  color: white;
  transition: all 0.3s ease;
}

.btn-perfil:hover {
  background: #b8000f;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(227, 6, 19, 0.35);
}
</style>
