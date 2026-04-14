<script setup>
import LoginMobile from "./LoginMobile.vue";
import Menu from "@/components/Menu.vue";



</script>

<template>
  <header class="flex">
  
    <Menu />

    <div class="w-full">
      <div class="flex bg-red-600">
        <div class="p-1 bg-red-600 relative -left-3 w-full"></div>
      </div>
      <nav class="bg-white flex justify-end me-25 dark:bg-[#121212]">
        <ul class="flex gap-10 items-center h-17">
          <li class="hidden md:flex font-bold relative -bottom-2">Login</li>
          <li class="hidden md:flex font-bold relative -bottom-2">
            Cadastre-se
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <section>
    <div class="md:flex justify-center">
      <img src="../../assets/imgmulher.png" class="hidden md:flex h-170" />
      <div class="h-150 flex flex-col justify-center gap-3">
       
        <LoginMobile />

        <span class="font-bold hidden md:flex text-6xl">Bem-vindo, </span>
        <p class="hidden md:flex text-5xl">
          ao Sistema de gestão de Professores
        </p>
        <p
          class="text-center md:text-left text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed hidden md:block"
        >
          Faça
          <a
            href="#"
            class="text-red-600 font-semibold hover:underline decoration-2 underline-offset-4 mx-1 transition-all"
          >
            login
          </a>
          ou
          <a
            href="#"
            class="text-red-600 font-semibold hover:underline decoration-2 underline-offset-4 mx-1 transition-all"
          >
            cadastre-se
          </a>
          para obter acesso à página.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap");

li {
  transition: 400ms ease-in-out;
}

html, body {
  overflow-x: hidden !important;
}

li:hover {
  background: red;
  border-radius: 15px;
  padding: 10px;
  color: white;
  cursor: pointer;
}

a {
  cursor: pointer;
}
</style>
