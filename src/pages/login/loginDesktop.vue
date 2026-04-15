<script setup>
import { reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import Menu from "@/components/Menu.vue";

const initialState = {
  password: "",
  email: "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  password: { required },
  email: { required, email },
};

const v$ = useVuelidate(rules, state);

function clear() {
  v$.value.$reset();

  Object.assign(state, initialState);
}

async function submit() {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    console.log("Formulário inválido");
    return;
  }

  console.log("Formulário válido", state);
}
</script>

<template>

    <Menu/>

    <div class="flex h-200 items-center justify-center ">

  <div
    class="flex flex-col space-y-3 bg-gray-100 p-8 dark:bg-[#121212] w-150 rounded-lg shadow-lg h-90 m-5"
  >
    <h2 class="text-center font-bold text-2xl">Bem-vindo</h2>

    <form @submit.prevent="submit">
      <v-text-field
        v-model="state.email"
        :error-messages="v$.email.$errors.map((e) => e.$message)"
        label="E-mail"
        required
        @blur="v$.email.$touch()"
        @input="v$.email.$touch()"
      />

      <v-text-field
        v-model="state.password"
        :error-messages="v$.password.$errors.map((e) => e.$message)"
        label="Senha"
        type="password"
        required
        @blur="v$.password.$touch()"
        @input="v$.password.$touch()"
      />

      <v-btn
        type="submit"
        class="mt-4 me-4 bg-red-500 text-white"
      >
        submit
      </v-btn>

      <v-btn @click="clear" class="mt-4">
        clear
      </v-btn>
    </form>
  </div>
  </div>
</template>