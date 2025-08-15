<template>
    <q-page class="bg-gradient-to-br from-secondary to-primary q-pa-xl" style="min-height: 100vh;">
      <div class="row justify-center">
        <div class="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-10">
          <q-card class="gym-card register-card q-pa-xl full-width">
          <q-card-section class="text-center q-pb-none">
            <div class="gym-logo q-mb-md">
              <q-icon name="person_add" size="64px" color="secondary" />
            </div>
            <h4 class="text-h4 text-weight-bold text-secondary q-mt-none q-mb-sm">
              Registrar Usuario
            </h4>
          </q-card-section>
  
          <q-card-section>
            <q-form @submit.prevent="guardar" class="gym-form">
              <div class="row q-gutter-md q-mb-md">
                <q-input
                  v-model="form.username"
                  label="Usuario"
                  outlined
                  class="gym-input col"
                  :rules="[val => !!val || 'El nombre es requerido']"
                >
                </q-input>
              </div>
  
              <q-input
                v-model="form.email"
                type="email"
                label="Correo electrónico"
                outlined
                class="gym-input q-mb-md"
                :rules="[
                  val => !!val || 'El email es requerido',
                  val => /.+@.+\..+/.test(val) || 'Email debe ser válido'
                ]"
              >
              </q-input>

              <div class="row q-gutter-md q-mb-md">
                <q-select
                  v-model="form.role"
                  :options="roles"
                  label="Rol"
                  outlined
                  class="gym-input col"
                  :rules="[val => !!val || 'El rol es requerido']"
                />
              </div>

              <q-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                outlined
                class="gym-input q-mb-md"
                :rules="[
                  val => !!val || 'La contraseña es requerida',
                  val => val.length >= 6 || 'Mínimo 6 caracteres'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="secondary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
  
              <q-btn
                type="submit"
                color="secondary"
                label="Crear Cuenta"
                class="full-width gym-btn q-mb-md"
                size="lg"
                :loading="loading"
                :disable="loading || !acceptTerms"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Creando cuenta...
                </template>
              </q-btn>
            </q-form>
          </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import useUsers from '../../composables/useUsers'
  import { useRouter } from 'vue-router'
  
  const { createUser, loading, error } = useUsers();
  const roles = ['user', 'admin']
  const form = ref({ username: '', email: '', password: '', role: 'user' });
  const router = useRouter()
  const showPassword = ref(false)
  const acceptTerms = ref(true)
  
  const guardar = async () => {
    await createUser(form.value);
    if (!error.value) {
      form.value = { username: '', email: '', password: '', role: 'user' };
      router.push({ name: 'usuarios' })
    }
  };

  </script>