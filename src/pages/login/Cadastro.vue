<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { ref } from "vue";
import Menu from "@/components/Menu.vue";


const show1 = ref(false);
const show2 = ref(true);
const password = ref("");

const initialState = {
  name: "",
  email: "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  name: { required },
  email: { required, email },
  required: (value) => !!value || "Required.",
  min: (v) => v.length >= 8 || "Min 8 characters",
  emailMatch: () => `The email and password you entered don't match`,
};

const v$ = useVuelidate(rules, state);

function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}
</script>

<template>

  <Menu/>

  <div class="flex  h-200 items-center justify-center p-4">
    <div
      class="flex flex-col space-y-3 bg-gray-100 dark:bg-[#121212] p-12 rounded-lg round-lg shadow-lg w-150"
    >
      <h2 class="text-center font-bold text-2xl">Bem-vindo</h2>
      <form class="dark:bg-[#121212]">
        <v-text-field
          v-model="state.name"
          :counter="10"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
          label="Name"
          required
          @blur="v$.name.$touch"
          @input="v$.name.$touch"
        ></v-text-field>

        <v-select
          label="Cargo"
          :items="[
            'Gestor',
            'OPP',
            'Professor'
            
          ]"
        ></v-select>

        <v-text-field
          v-model="state.email"
          :error-messages="v$.email.$errors.map((e) => e.$message)"
          label="E-mail"
          required
          @blur="v$.email.$touch"
          @input="v$.email.$touch"
        ></v-text-field>

        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show2 ? 'text' : 'password'"
                class="input-group--focused"
                hint="At least 8 characters"
                label="Confirme sua senha"
                name="input-10-2"
                @click:append="show2 = !show2"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show2 ? 'text' : 'password'"
                class="input-group--focused"
                hint="At least 8 characters"
                label="Confirme sua senha"
                name="input-10-2"
                @click:append="show2 = !show2"
              ></v-text-field>
            </v-col>

          </v-row>
        </v-container>

        <v-btn class="mt-4 me-4 bg-red-500 text-white" @click="v$.$validate">
          Cadastrar
        </v-btn>
        <v-btn @click="clear" class="mt-4"> clear </v-btn>
      </form>

      <p class="text-center">
        Já possui uma conta?<a class="text-red-600 font-semibold hover:underline decoration-2 underline-offset-4 mx-1 transition-all hover:cursor-pointer"> Login</a>
      </p>
    </div>
  </div>

  <ThemeToggle />

</template>
