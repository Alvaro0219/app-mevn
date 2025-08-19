<template>
  <q-page class="q-pa-xl" style="min-height: 100vh;">
    <div class="row justify-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
        <q-card class="q-pa-xl">
          <q-card-section class="text-center q-pb-none">
            <h4 class="text-h4 text-weight-bold q-mt-none q-mb-sm">Editar Usuario</h4>
            <div class="text-grey-6 q-mb-lg">Modifica los datos y guarda los cambios</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="guardar" class="gym-form">
              <div class="row q-gutter-md q-mb-md">
                <q-input
                  v-model="form.username"
                  label="Usuario"
                  outlined
                  class="col"
                  :rules="[val => !!val || 'El nombre es requerido']"
                />
              </div>

              <q-input
                v-model="form.email"
                type="email"
                label="Correo electrónico"
                outlined
                class="q-mb-md"
                :rules="[
                  val => !!val || 'El email es requerido',
                  val => /.+@.+\..+/.test(val) || 'Email debe ser válido'
                ]"
              />

              <div class="row q-gutter-md q-mb-md">
                <q-select
                  v-model="form.role"
                  :options="roles"
                  label="Rol"
                  outlined
                  class="col"
                  :rules="[val => !!val || 'El rol es requerido']"
                />
                <q-toggle v-model="form.isActive" label="Activo" />
              </div>

              <div class="row q-col-gutter-md">
                <div class="col">
                  <q-btn type="submit" color="primary" label="Guardar" class="full-width" :loading="loading" :disable="loading" />
                </div>
                <div class="col">
                  <q-btn flat color="grey-7" label="Cancelar" class="full-width" @click="router.push({ name: 'usuarios' })" />
                </div>
              </div>
            </q-form>

            <div v-if="error" class="text-negative q-mt-md">{{ error }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useUsers from 'src/composables/useUsers.js'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const { user, loading, error, fetchUserById, updateUser } = useUsers()
const roles = ['user', 'admin']

const form = ref({ username: '', email: '', role: 'user', isActive: true })

onMounted(() => {
  const id = route.params.id
  if (id) fetchUserById(id)
})

watch(user, (val) => {
  if (val) {
    form.value = {
      username: val.username || '',
      email: val.email || '',
      role: val.role || 'user',
      isActive: typeof val.isActive === 'boolean' ? val.isActive : true,
    }
  }
}, { immediate: true })

const guardar = async () => {
  const id = route.params.id
  await updateUser(id, form.value)
  if (!error.value) {
    $q.notify({ type: 'positive', message: 'Usuario actualizado' })
    router.push({ name: 'usuarios' })
  } else {
    $q.notify({ type: 'negative', message: error.value })
  }
}
</script>
