<template>
    <q-layout view="hHh lpR fFf">
      <q-page-container>
        <q-page class="flex flex-center bg-grey-2">
          <q-card class="q-pa-lg" style="width: 100%; max-width: 400px;">
            <q-form @submit.prevent="handleLogin">
              <q-card-section>
                <div class="text-h5 text-weight-bold text-center q-mb-md">Iniciar Sesión</div>
                <q-banner v-if="error" class="bg-negative text-white q-mb-md">
                  {{ error }}
                </q-banner>
              </q-card-section>
  
              <q-card-section class="q-gutter-y-md">
                <q-input
                  v-model="form.email"
                  label="Correo electrónico"
                  type="email"
                  :rules="[val => !!val || 'El correo es requerido']"
                  outlined
                  dense
                  lazy-rules
                />
                <q-input
                  v-model="form.password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[val => !!val || 'La contraseña es requerida']"
                  outlined
                  dense
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </q-card-section>
  
              <q-card-actions class="q-px-md">
                <q-btn
                  label="Ingresar"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="loading"
                />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { useAuth } from 'src/composables/useAuth'
  
  const $q = useQuasar()
  const router = useRouter()
  const route = useRoute()
  const { login } = useAuth()
  
  const form = ref({
    email: '',
    password: ''
  })
  const error = ref('')
  const loading = ref(false)
  const showPassword = ref(false)
  
  const handleLogin = async () => {
    try {
      loading.value = true
      error.value = ''
      await login(form.value)
      $q.notify({
        type: 'positive',
        message: '¡Bienvenido!'
      })
      const redirectPath = route.query.redirect || '/inicio'
      router.push(redirectPath)
    } catch (err) {
      error.value = err.message || 'Error al iniciar sesión'
    } finally {
      loading.value = false
    }
  }
  </script>