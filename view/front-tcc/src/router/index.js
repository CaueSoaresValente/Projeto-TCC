import { createRouter, createWebHistory } from "vue-router";

import LoginDesktop from "@/pages/login/loginDesktop";
import Cadastro from "@/pages/login/Cadastro.vue";
import TelaInput from "@/pages/login/TelaInput.vue";
import Findprofessor from "@/pages/gestaoProfessores/Findprofessor.vue";


const routes = [

  {
    path: "/",
    name: "login",
    component: TelaInput,
  },

  {
    path: "/logindesktop",
    name: "logindesktopin",
    component: LoginDesktop,
  },
  {
     path: "/cadastro",
     name: "cadastro",
     component: Cadastro,
  },
  {
     path: "/findprofessor",
     name: "findprofessor",
     component: Findprofessor,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;